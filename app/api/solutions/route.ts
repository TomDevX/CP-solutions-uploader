/**
 * Solutions API Endpoint
 * 
 * Handles listing solutions with search, filtering, and pagination.
 * Supports public/private views and intelligent problem code sorting.
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { sortProblemCodes } from '@/lib/utils'

const getSolutionsSchema = z.object({
  problem: z.string().optional(),
  public: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
})

const createSolutionSchema = z.object({
  problemCode: z.string().min(1, 'Problem code is required'),
  title: z.string().min(1, 'Title is required'),
  contentMarkdown: z.string().min(1, 'Content is required'),
  contentHtml: z.string().min(1, 'HTML content is required'),
  problemLink: z.string().optional(),
  submissionLink: z.string().optional(),
  editorial: z.string().optional(),
  isPublic: z.boolean().default(false),
  isAnonymous: z.boolean().default(false),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams.entries())
    const { problem, public: isPublic, page, limit, search } = getSolutionsSchema.parse(params)

    const pageNum = parseInt(page || '1', 10)
    const limitNum = parseInt(limit || '20', 10)
    const offset = (pageNum - 1) * limitNum

    // Build where clause
    const where: any = {
      isDraft: false,
    }

    if (problem) {
      where.problemCode = problem
    }

    if (isPublic === 'true') {
      where.isPublic = true
    } else if (isPublic === 'false') {
      // For private solutions, we need to check user authentication
      const authHeader = request.headers.get('authorization')
      const token = authHeader?.replace('Bearer ', '') || request.cookies.get('auth-token')?.value
      const user = token ? verifyToken(token) : null
      
      if (!user) {
        return NextResponse.json(
          { error: 'Authentication required for private solutions' },
          { status: 401 }
        )
      }
      
      where.authorId = user.userId
    }

    if (search) {
      where.OR = [
        { problemCode: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { contentMarkdown: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Get solutions with author and reactions
    const solutions = await prisma.solution.findMany({
      where,
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
      orderBy: [
        { createdAt: 'desc' },
      ],
      skip: offset,
      take: limitNum,
    })

    // Get total count for pagination
    const total = await prisma.solution.count({ where })

    // Group solutions by problem code
    const problemGroups = solutions.reduce((acc, solution) => {
      if (!acc[solution.problemCode]) {
        acc[solution.problemCode] = []
      }
      acc[solution.problemCode].push(solution)
      return acc
    }, {} as Record<string, typeof solutions>)

    // Sort problem codes
    const sortedProblemCodes = sortProblemCodes(Object.keys(problemGroups))

    return NextResponse.json({
      solutions: problemGroups,
      sortedProblemCodes,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Get solutions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const solutionData = createSolutionSchema.parse(body)

    // Check authentication requirements
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('auth-token')?.value
    const user = token ? verifyToken(token) : null

    // If making public, require authentication
    if (solutionData.isPublic && !user) {
      return NextResponse.json(
        { error: 'Authentication required for public solutions' },
        { status: 401 }
      )
    }

    // If posting anonymously, don't require authentication
    if (solutionData.isAnonymous) {
      solutionData.isPublic = false // Anonymous posts are always private
    }

    const solution = await prisma.solution.create({
      data: {
        ...solutionData,
        authorId: user?.userId || null, // null for anonymous posts
      },
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
      message: 'Solution created successfully',
      solution,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create solution error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
