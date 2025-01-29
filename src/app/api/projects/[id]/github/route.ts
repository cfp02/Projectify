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
    const response = await octokit.repos.getReadme({
      owner,
      repo,
      mediaType: {
        format: 'raw',
      },
    });
    return response.data.content;
  } catch (error) {
    console.error('Error fetching README:', error);
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
      let existingReadme = await prisma.readme.findUnique({
        where: { projectId: params.id },
      });

      // First, get the current max version
      const currentVersion = await prisma.readmeVersion.findFirst({
        where: { readmeId: existingReadme?.id },
        orderBy: { version: 'desc' },
      });

      const nextVersion: number = (currentVersion?.version ?? 0) + 1;

      const updatedReadme = await prisma.readme.upsert({
        where: {
          projectId: params.id,
        },
        create: {
          content: readmeContent,
          projectId: params.id,
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