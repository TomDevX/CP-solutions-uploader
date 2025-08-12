import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const userCount = await prisma.user.count()
    const adminUser = await prisma.user.findUnique({
      where: { email: 'tomdev@example.com' }
    })
    
    return NextResponse.json({
      success: true,
      userCount,
      adminUser: adminUser ? {
        id: adminUser.id,
        email: adminUser.email,
        username: adminUser.username,
        role: adminUser.role,
        hasPassword: !!adminUser.passwordHash
      } : null
    })
  } catch (error) {
    console.error('Test API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
