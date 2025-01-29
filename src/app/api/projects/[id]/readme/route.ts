import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_README_TEMPLATE = `# Project Name

## 🚨 Project Management Instructions
<details>
<summary>Click to expand project management guidelines</summary>

**IMPORTANT**: This README is a living document managed by Projectify and Cursor.
To maintain compatibility and effectiveness:
1. Do not modify the structure of special sections (marked with 🚨)
2. Keep all Cursor-specific metadata intact
3. Update the Progress Log with every significant change
4. Use the provided section templates for new content
5. Maintain the established heading hierarchy
</details>

## Current Focus
- [ ] Current phase/milestone
- [ ] Active tasks/features
- [ ] Immediate next steps

## Progress Log
<details>
<summary>View complete progress history</summary>

### YYYY-MM-DD (Latest)
- Phase: [Current Phase]
- Work completed:
  - [List of completed items]
- Next steps:
  - [List of next steps]
- Notes/Challenges:
  - [Any notable points]
</details>

## Project Overview
[Project description goes here]

## Features
- [Feature 1]
- [Feature 2]
- [Feature 3]

## Setup & Usage
[Setup and usage instructions go here]

## Development
[Development instructions go here]

## Contributing
[Contributing guidelines go here]

## License
[License information goes here]
`;

// GET /api/projects/[id]/readme
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    const readme = await prisma.readme.findUnique({
      where: {
        projectId: params.id,
      },
      include: {
        versions: {
          orderBy: {
            version: 'desc',
          },
        },
      },
    });

    if (!readme) {
      return new NextResponse(JSON.stringify({ error: 'README not found' }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(readme));
  } catch (error) {
    console.error('Error fetching README:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch README' }),
      { status: 500 }
    );
  }
}

// POST /api/projects/[id]/readme
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    const { content, message } = await request.json();

    // Get the current README or create a new one with the template
    let readme = await prisma.readme.findUnique({
      where: {
        projectId: params.id,
      },
      include: {
        versions: {
          orderBy: {
            version: 'desc',
          },
        },
      },
    });

    const nextVersion = readme?.versions.length ? readme.versions[0].version + 1 : 1;

    if (!readme) {
      // Create new README with initial version
      readme = await prisma.readme.create({
        data: {
          projectId: params.id,
          content: content || DEFAULT_README_TEMPLATE,
          versions: {
            create: {
              version: 1,
              content: content || DEFAULT_README_TEMPLATE,
              message: message || 'Initial README',
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
    } else {
      // Update existing README and create new version
      readme = await prisma.readme.update({
        where: {
          projectId: params.id,
        },
        data: {
          content,
          versions: {
            create: {
              version: nextVersion,
              content,
              message: message || `Updated README to version ${nextVersion}`,
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
    }

    // Log the activity
    await prisma.activity.create({
      data: {
        projectId: params.id,
        type: 'readme_update',
        content: message
          ? `Updated README: ${message}`
          : `Updated README to version ${nextVersion}`,
      },
    });

    return new NextResponse(JSON.stringify(readme));
  } catch (error) {
    console.error('Error updating README:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to update README' }),
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id]/readme/restore/[versionId]
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

    const version = await prisma.readmeVersion.findUnique({
      where: {
        id: params.versionId,
      },
    });

    if (!version) {
      return new NextResponse(JSON.stringify({ error: 'Version not found' }), {
        status: 404,
      });
    }

    const [updatedReadme, _] = await prisma.$transaction([
      prisma.readme.update({
        where: {
          id: version.readmeId,
        },
        data: {
          content: version.content,
          versions: {
            create: {
              version: version.version + 1,
              content: version.content,
              message: `Restored from version ${version.version}`,
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
      }),
      prisma.activity.create({
        data: {
          type: 'readme_restore',
          content: `Restored README from version ${version.version}`,
          projectId: params.id,
        },
      }),
    ]);

    return new NextResponse(JSON.stringify(updatedReadme));
  } catch (error) {
    console.error('Error restoring README version:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to restore README version' }),
      { status: 500 }
    );
  }
} 