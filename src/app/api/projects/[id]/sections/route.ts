import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/projects/[id]/sections
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const sections = await prisma.section.findMany({
      where: {
        projectId: params.id,
        project: {
          userId: session.user.email,
        },
      },
      orderBy: {
        order: 'asc',
      },
    })

    return NextResponse.json(sections)
  } catch (error) {
    console.error('Failed to fetch sections:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// POST /api/projects/[id]/sections
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
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
    })

    if (!project) {
      return new NextResponse('Project not found', { status: 404 })
    }

    const section = await prisma.section.create({
      data: {
        title,
        content,
        order,
        projectId: params.id,
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'SECTION_CREATED',
        content: `Created section: ${title}`,
        projectId: params.id,
      },
    })

    return NextResponse.json(section)
  } catch (error) {
    console.error('Failed to create section:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// POST /api/projects/[id]/sections/reorder
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { sections } = await request.json()

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: params.id,
        userId: session.user.email,
      },
    })

    if (!project) {
      return new NextResponse('Project not found', { status: 404 })
    }

    // Update all sections in a transaction
    await prisma.$transaction(
      sections.map((section: any) =>
        prisma.section.update({
          where: { id: section.id },
          data: { order: section.order },
        })
      )
    )

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'SECTIONS_REORDERED',
        content: 'Reordered project sections',
        projectId: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to reorder sections:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 