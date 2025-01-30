import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/config';
import { PrismaClient } from '@prisma/client';
import { Octokit } from '@octokit/rest';

const prisma = new PrismaClient();

// Helper function to validate GitHub URL
function parseGitHubUrl(url: string) {
  try {
    // If URL doesn't start with http/https, prepend https://github.com/
    const fullUrl = url.startsWith('http') ? url : `https://github.com/${url}`;
    const urlObj = new URL(fullUrl);
    
    // Ensure it's a GitHub URL
    if (!urlObj.hostname.includes('github.com')) {
      throw new Error('Not a GitHub URL');
    }
    
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    if (pathParts.length !== 2) {
      throw new Error('Invalid GitHub repository URL format. Expected: username/repository');
    }
    
    return {
      ownerName: pathParts[0],
      repoName: pathParts[1],
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Invalid GitHub repository URL');
  }
}

// Helper function to get README content from GitHub
async function getGitHubReadme(octokit: Octokit, owner: string, repo: string) {
  try {
    console.log('Starting README search for:', { owner, repo });
    
    // Try common README filenames
    const commonReadmeNames = ['README.md', 'Readme.md', 'readme.md', 'README'];
    console.log('Will try these filenames in order:', commonReadmeNames);
    
    let response = null;
    let error = null;

    for (const filename of commonReadmeNames) {
      try {
        console.log(`Attempting to fetch: ${filename}`);
        const result = await octokit.repos.getContent({
          owner,
          repo,
          path: filename,
        });
        
        // Check if we got a file (not a directory) and it has content
        if ('content' in result.data && typeof result.data.content === 'string') {
          console.log(`✅ Found valid README at: ${filename}`);
          response = result;
          break;
        } else {
          console.log(`❌ Found ${filename} but it's not a valid file:`, {
            type: typeof result.data,
            hasContent: 'content' in result.data
          });
        }
      } catch (e) {
        error = e;
        console.log(`❌ Failed to fetch ${filename}:`, {
          error: e instanceof Error ? e.message : 'Unknown error'
        });
        continue;
      }
    }

    if (!response?.data || !('content' in response.data)) {
      console.error('No README found after trying all filenames:', {
        error,
        triedFiles: commonReadmeNames,
        lastError: error instanceof Error ? error.message : 'Unknown error'
      });
      return null;
    }

    // Get the raw content from base64
    const content = Buffer.from(response.data.content, 'base64').toString('utf8');

    // Log the response for debugging
    console.log('README successfully fetched:', {
      status: response.status,
      filename: response.data.path,
      contentLength: content.length,
      firstFewChars: content.substring(0, 100) + '...',
      encoding: response.data.encoding,
      sha: response.data.sha
    });

    return content;
  } catch (error) {
    console.error('Error in getGitHubReadme:', {
      error,
      owner,
      repo,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });
    return null;
  }
}

// Connect or update GitHub repository
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { repoUrl } = body;

    if (!repoUrl) {
      return NextResponse.json(
        { error: 'Repository URL is required' },
        { status: 400 }
      );
    }

    // Get the project and verify ownership
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    if (project.user.email !== session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse GitHub URL
    const { ownerName, repoName } = parseGitHubUrl(repoUrl);

    // Get the user's GitHub access token
    const account = await prisma.account.findFirst({
      where: {
        userId: project.userId,
        provider: 'github',
      },
    });

    if (!account?.access_token) {
      return NextResponse.json(
        { error: 'GitHub account not connected' },
        { status: 400 }
      );
    }

    // Initialize Octokit with the user's token
    const octokit = new Octokit({
      auth: account.access_token,
    });

    // Verify repository exists and user has access
    try {
      await octokit.repos.get({
        owner: ownerName,
        repo: repoName,
      });
    } catch (error) {
      return NextResponse.json(
        { error: 'Repository not found or access denied' },
        { status: 404 }
      );
    }

    // Get README content from GitHub
    const readmeContent = await getGitHubReadme(octokit, ownerName, repoName);

    // Create or update GitHub repository connection
    const githubRepo = await prisma.githubRepo.upsert({
      where: {
        projectId: params.id,
      },
      create: {
        repoUrl,
        repoName,
        ownerName,
        projectId: params.id,
      },
      update: {
        repoUrl,
        repoName,
        ownerName,
        lastSynced: new Date(),
      },
    });

    // If README exists on GitHub, create or update project README
    if (readmeContent) {
      // First, get the current max version
      const currentReadme = await prisma.readme.findUnique({
        where: { projectId: params.id },
        include: {
          versions: {
            orderBy: { version: 'desc' },
            take: 1,
          },
        },
      });

      const nextVersion = currentReadme?.versions[0]?.version 
        ? currentReadme.versions[0].version + 1 
        : 1;

      const updatedReadme = await prisma.readme.upsert({
        where: {
          projectId: params.id,
        },
        create: {
          projectId: params.id,
          content: readmeContent,
          versions: {
            create: {
              version: 1,
              content: readmeContent,
              message: 'Imported from GitHub',
            },
          },
        },
        update: {
          content: readmeContent,
          versions: {
            create: {
              version: nextVersion,
              content: readmeContent,
              message: 'Synced from GitHub',
            },
          },
        },
        include: {
          versions: true,
        },
      });

      console.log('Created/Updated README:', {
        readmeId: updatedReadme.id,
        projectId: updatedReadme.projectId,
        versionsCount: updatedReadme.versions.length,
      });
    }

    return NextResponse.json({ githubRepo });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to connect repository' },
      { status: 500 }
    );
  }
}

// Disconnect GitHub repository
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the project and verify ownership
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    if (project.user.email !== session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Delete GitHub repository connection
    await prisma.githubRepo.delete({
      where: {
        projectId: params.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect repository' },
      { status: 500 }
    );
  }
}

// Get GitHub repository status
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const githubRepo = await prisma.githubRepo.findUnique({
      where: {
        projectId: params.id,
      },
    });

    return NextResponse.json({ githubRepo });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to get repository status' },
      { status: 500 }
    );
  }
} 