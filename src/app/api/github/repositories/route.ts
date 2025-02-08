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
        userId: session.user.id as string,
        provider: 'github',
      },
    });

    if (!account?.access_token) {
      // Instead of forcing a reauth, just return empty repositories
      return NextResponse.json({
        repositories: [],
        status: 'no_connection'
      });
    }

    // Initialize Octokit with the user's token
    const octokit = new Octokit({
      auth: account.access_token,
    });

    try {
      // Fetch user's repositories
      const { data: repositories } = await octokit.repos.listForAuthenticatedUser({
        sort: 'updated',
        direction: 'desc',
        per_page: 100,
        visibility: 'all',
        affiliation: 'owner,collaborator,organization_member',
      });

      return NextResponse.json({
        repositories: repositories.map(repo => ({
          id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          private: repo.private,
          html_url: repo.html_url,
        })),
        status: 'connected'
      });
    } catch (error: any) {
      if (error.status === 401) {
        // Instead of forcing a reauth, return empty repositories with a status
        return NextResponse.json({
          repositories: [],
          status: 'token_expired'
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return NextResponse.json({
      repositories: [],
      status: 'error',
      error: 'Failed to fetch repositories'
    });
  }
} 