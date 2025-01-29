import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { id: string; versionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    // Get the version to restore
    const versionToRestore = await prisma.readmeVersion.findUnique({
      where: {
        id: params.versionId,
      },
      include: {
        readme: true,
      },
    });

    if (!versionToRestore) {
      return new NextResponse(JSON.stringify({ error: 'Version not found' }), {
        status: 404,
      });
    }

    // Verify the version belongs to the correct project's README
    if (versionToRestore.readme.projectId !== params.id) {
      return new NextResponse(
        JSON.stringify({ error: 'Version does not belong to this project' }),
        { status: 403 }
      );
    }

    // Get the current version number
    const currentReadme = await prisma.readme.findUnique({
      where: {
        projectId: params.id,
      },
      include: {
        versions: {
          orderBy: {
            version: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!currentReadme) {
      return new NextResponse(JSON.stringify({ error: 'README not found' }), {
        status: 404,
      });
    }

    const nextVersion = currentReadme.versions[0].version + 1;

    // Create a new version with the restored content
    const updatedReadme = await prisma.readme.update({
      where: {
        projectId: params.id,
      },
      data: {
        content: versionToRestore.content,
        versions: {
          create: {
            version: nextVersion,
            content: versionToRestore.content,
            message: `Restored from version ${versionToRestore.version}`,
          },
        },
      },
      include: {
        versions: {
          orderBy: {
            version: 'desc',
          },
        },
      },
    });

    // Log the activity
    await prisma.activity.create({
      data: {
        projectId: params.id,
        type: 'readme_restore',
        content: `Restored README from version ${versionToRestore.version}`,
      },
    });

    return new NextResponse(JSON.stringify(updatedReadme));
  } catch (error) {
    console.error('Error restoring README version:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to restore README version' }),
      { status: 500 }
    );
  }
} 