/**
 * Individual Solution API Endpoint
 * 
 * Handles GET, PUT, and DELETE operations for specific solutions.
 * Includes authorization checks and proper error handling.
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyToken, canEditSolution } from '@/lib/auth'

const updateSolutionSchema = z.object({
  problemCode: z.string().min(1, 'Problem code is required'),
  title: z.string().min(1, 'Title is required'),
  contentMarkdown: z.string().min(1, 'Content is required'),
  contentHtml: z.string().min(1, 'HTML content is required'),
  editorial: z.string().optional(),
  isPublic: z.boolean().default(false),
  isAnonymous: z.boolean().default(false),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const solution = await prisma.solution.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
        _count: {
          select: {
            reactions: true,
          },
        },
      },
    })

    if (!solution) {
      return NextResponse.json(
        { error: 'Solution not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ solution })
  } catch (error) {
    console.error('Get solution error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('auth-token')?.value
    const user = token ? verifyToken(token) : null

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const solution = await prisma.solution.findUnique({
      where: { id: params.id },
      select: { authorId: true },
    })

    if (!solution) {
      return NextResponse.json(
        { error: 'Solution not found' },
        { status: 404 }
      )
    }

    if (!canEditSolution(user, solution.authorId)) {
      return NextResponse.json(
        { error: 'Not authorized to edit this solution' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const updateData = updateSolutionSchema.parse(body)

    const updatedSolution = await prisma.solution.update({
      where: { id: params.id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })

    return NextResponse.json({
      message: 'Solution updated successfully',
      solution: updatedSolution,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update solution error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('auth-token')?.value
    const user = token ? verifyToken(token) : null

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const solution = await prisma.solution.findUnique({
      where: { id: params.id },
      select: { authorId: true },
    })

    if (!solution) {
      return NextResponse.json(
        { error: 'Solution not found' },
        { status: 404 }
      )
    }

    if (!canEditSolution(user, solution.authorId)) {
      return NextResponse.json(
        { error: 'Not authorized to delete this solution' },
        { status: 403 }
      )
    }

    await prisma.solution.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      message: 'Solution deleted successfully',
    })
  } catch (error) {
    console.error('Delete solution error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
