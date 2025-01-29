import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/config';
import { PrismaClient } from '@prisma/client';
import { Octokit } from '@octokit/rest';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user's GitHub access token
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
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

    // Fetch user's repositories
    const { data: repositories } = await octokit.repos.listForAuthenticatedUser({
      sort: 'updated',
      direction: 'desc',
      per_page: 100,
      visibility: 'all',  // Show both private and public repos
      affiliation: 'owner,collaborator,organization_member',  // Show all repos user has access to
    });

    // Log the response for debugging
    console.log('Fetched repositories:', repositories.map(r => ({ 
      name: r.full_name, 
      private: r.private,
      permissions: r.permissions 
    })));

    return NextResponse.json({
      repositories: repositories.map(repo => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        private: repo.private,
        html_url: repo.html_url,
      })),
    });
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
} 