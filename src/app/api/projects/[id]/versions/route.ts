import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/projects/[id]/versions - Get all versions of a project
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const versions = await prisma.projectVersion.findMany({
      where: {
        projectId: params.id,
        project: {
          userId: session.user.id,
        },
      },
      orderBy: {
        version: 'desc',
      },
    });

    return NextResponse.json(versions);
  } catch (error) {
    console.error("Error fetching project versions:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// POST /api/projects/[id]/versions - Create a new version
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await request.json();
    const { reason } = json;

    // Get the project with all related data
    const project = await prisma.project.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        sections: true,
        resources: true,
        tags: true,
        activities: {
          take: 10, // Include only recent activities
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    }

    // Get the latest version number
    const latestVersion = await prisma.projectVersion.findFirst({
      where: { projectId: params.id },
      orderBy: { version: 'desc' },
    });

    const newVersionNumber = (latestVersion?.version ?? 0) + 1;

    // Create a new version
    const newVersion = await prisma.projectVersion.create({
      data: {
        version: newVersionNumber,
        projectId: params.id,
        userId: session.user.id,
        title: project.title,
        subtitle: project.subtitle,
        description: project.description,
        status: project.status,
        reason,
        snapshot: project, // Store the complete project state
      },
    });

    // Create an activity entry for the new version
    await prisma.activity.create({
      data: {
        type: 'version',
        content: `Created version ${newVersionNumber}${reason ? `: ${reason}` : ''}`,
        projectId: params.id,
      },
    });

    return NextResponse.json(newVersion);
  } catch (error) {
    console.error("Error creating project version:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// POST /api/projects/[id]/versions/restore/[versionId] - Restore a specific version
export async function PUT(
  request: Request,
  { params }: { params: { id: string; versionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the version to restore
    const version = await prisma.projectVersion.findUnique({
      where: {
        id: params.versionId,
        projectId: params.id,
        project: {
          userId: session.user.id,
        },
      },
    });

    if (!version) {
      return new NextResponse("Version not found", { status: 404 });
    }

    const snapshot = version.snapshot as any;

    // Start a transaction to restore the project state
    const restoredProject = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Update the project's main information
      const updatedProject = await tx.project.update({
        where: { id: params.id },
        data: {
          title: version.title,
          subtitle: version.subtitle,
          description: version.description,
          status: version.status,
        },
      });

      // Delete existing sections and recreate them from the snapshot
      await tx.section.deleteMany({
        where: { projectId: params.id },
      });
      if (snapshot.sections?.length) {
        await tx.section.createMany({
          data: snapshot.sections.map((section: any) => ({
            ...section,
            id: undefined, // Let Prisma generate new IDs
            projectId: params.id,
          })),
        });
      }

      // Delete existing resources and recreate them from the snapshot
      await tx.resource.deleteMany({
        where: { projectId: params.id },
      });
      if (snapshot.resources?.length) {
        await tx.resource.createMany({
          data: snapshot.resources.map((resource: any) => ({
            ...resource,
            id: undefined,
            projectId: params.id,
          })),
        });
      }

      // Update tags
      await tx.project.update({
        where: { id: params.id },
        data: {
          tags: {
            set: snapshot.tags?.map((tag: any) => ({ id: tag.id })) || [],
          },
        },
      });

      return updatedProject;
    });

    // Create an activity entry for the restoration
    await prisma.activity.create({
      data: {
        type: 'version_restore',
        content: `Restored to version ${version.version}`,
        projectId: params.id,
      },
    });

    return NextResponse.json(restoredProject);
  } catch (error) {
    console.error("Error restoring project version:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 