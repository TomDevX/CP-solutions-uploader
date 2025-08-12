/**
 * Drafts API Endpoint
 * 
 * Handles autosave functionality for solution drafts.
 * Supports both client-side localStorage and server-side persistence
 * with intelligent merging of draft content.
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

const saveDraftSchema = z.object({
  solutionId: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  lastSavedAt: z.string().optional(),
})

export async function POST(request: NextRequest) {
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
    const { solutionId, content, lastSavedAt } = saveDraftSchema.parse(body)

    // Check if draft already exists
    const existingDraft = await prisma.draft.findFirst({
      where: {
        userId: user.userId,
        solutionId: solutionId || null,
      },
    })

    let draft
    if (existingDraft) {
      // Update existing draft
      draft = await prisma.draft.update({
        where: { id: existingDraft.id },
        data: {
          content,
          lastSavedAt: new Date(),
        },
      })
    } else {
      // Create new draft
      draft = await prisma.draft.create({
        data: {
          userId: user.userId,
          solutionId: solutionId || null,
          content,
          lastSavedAt: new Date(),
        },
      })
    }

    return NextResponse.json({
      message: 'Draft saved successfully',
      draft: {
        id: draft.id,
        content: draft.content,
        lastSavedAt: draft.lastSavedAt,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Save draft error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const solutionId = searchParams.get('solutionId')

    // Get user's drafts
    const drafts = await prisma.draft.findMany({
      where: {
        userId: user.userId,
        solutionId: solutionId || null,
      },
      orderBy: {
        lastSavedAt: 'desc',
      },
    })

    return NextResponse.json({
      drafts: drafts.map(draft => ({
        id: draft.id,
        content: draft.content,
        lastSavedAt: draft.lastSavedAt,
        solutionId: draft.solutionId,
      })),
    })
  } catch (error) {
    console.error('Get drafts error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const draftId = searchParams.get('id')

    if (!draftId) {
      return NextResponse.json(
        { error: 'Draft ID is required' },
        { status: 400 }
      )
    }

    // Delete draft (only if it belongs to the user)
    await prisma.draft.deleteMany({
      where: {
        id: draftId,
        userId: user.userId,
      },
    })

    return NextResponse.json({
      message: 'Draft deleted successfully',
    })
  } catch (error) {
    console.error('Delete draft error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
