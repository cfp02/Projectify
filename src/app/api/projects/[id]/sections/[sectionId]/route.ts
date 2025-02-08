import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// PATCH /api/projects/[id]/sections/[sectionId]
export async function PATCH(
  request: Request,
  { params }: { params: { id: string; sectionId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { title, content, order } = await request.json()

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: params.id,
        userId: session.user.email,
      },
      include: {
        sections: {
          where: {
            id: params.sectionId,
          },
        },
      },
    })

    if (!project) {
      return new NextResponse('Project not found', { status: 404 })
    }

    if (!project.sections.length) {
      return new NextResponse('Section not found', { status: 404 })
    }

    const section = await prisma.section.update({
      where: {
        id: params.sectionId,
      },
      data: {
        title,
        content,
        order,
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'SECTION_UPDATED',
        content: `Updated section: ${title}`,
        projectId: params.id,
      },
    })

    return NextResponse.json(section)
  } catch (error) {
    console.error('Failed to update section:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// DELETE /api/projects/[id]/sections/[sectionId]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; sectionId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: params.id,
        userId: session.user.email,
      },
      include: {
        sections: {
          where: {
            id: params.sectionId,
          },
        },
      },
    })

    if (!project) {
      return new NextResponse('Project not found', { status: 404 })
    }

    if (!project.sections.length) {
      return new NextResponse('Section not found', { status: 404 })
    }

    const section = await prisma.section.delete({
      where: {
        id: params.sectionId,
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'SECTION_DELETED',
        content: `Deleted section: ${section.title}`,
        projectId: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete section:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 