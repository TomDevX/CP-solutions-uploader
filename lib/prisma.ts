/**
 * Prisma Client Singleton
 * 
 * This module provides a singleton instance of PrismaClient to ensure
 * we don't create multiple database connections during development.
 * In production, this helps with connection pooling and performance.
 */

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
