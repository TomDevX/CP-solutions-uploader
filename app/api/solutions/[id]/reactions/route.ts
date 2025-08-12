/**
 * Solution Reactions API Endpoint
 * 
 * Handles adding and removing reactions (like, helpful, bookmark) on solutions.
 * Supports toggle functionality and proper user authorization.
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

const reactionSchema = z.object({
  type: z.enum(['LIKE', 'HELPFUL', 'BOOKMARK']),
})

export async function POST(
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

    const body = await request.json()
    const { type } = reactionSchema.parse(body)

    // Check if solution exists
    const solution = await prisma.solution.findUnique({
      where: { id: params.id },
    })

    if (!solution) {
      return NextResponse.json(
        { error: 'Solution not found' },
        { status: 404 }
      )
    }

    // Check if reaction already exists
    const existingReaction = await prisma.reaction.findUnique({
      where: {
        solutionId_userId_type: {
          solutionId: params.id,
          userId: user.userId,
          type,
        },
      },
    })

    if (existingReaction) {
      // Remove existing reaction (toggle off)
      await prisma.reaction.delete({
        where: { id: existingReaction.id },
      })

      return NextResponse.json({
        message: 'Reaction removed',
        action: 'removed',
      })
    } else {
      // Add new reaction
      await prisma.reaction.create({
        data: {
          solutionId: params.id,
          userId: user.userId,
          type,
        },
      })

      return NextResponse.json({
        message: 'Reaction added',
        action: 'added',
      })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Reaction error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
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

    // Get all reactions for the solution
    const reactions = await prisma.reaction.findMany({
      where: { solutionId: params.id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })

    // Get user's reactions for this solution
    const userReactions = await prisma.reaction.findMany({
      where: {
        solutionId: params.id,
        userId: user.userId,
      },
      select: { type: true },
    })

    // Count reactions by type
    const reactionCounts = reactions.reduce((acc, reaction) => {
      acc[reaction.type] = (acc[reaction.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      reactions,
      userReactions: userReactions.map(r => r.type),
      counts: reactionCounts,
    })
  } catch (error) {
    console.error('Get reactions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
