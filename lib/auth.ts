/**
 * Authentication Utilities
 * 
 * Provides JWT token management, password hashing, and user authentication
 * functions. Uses bcrypt for password hashing and jsonwebtoken for JWT tokens.
 */

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'
import { User, UserRole } from '@prisma/client'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production'

export interface JWTPayload {
  userId: string
  email: string
  role: UserRole
  username: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: User): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    username: user.username,
  }
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user || !user.passwordHash) {
    return null
  }

  const isValidPassword = await verifyPassword(password, user.passwordHash)
  return isValidPassword ? user : null
}

export function isAdmin(user: User | null): boolean {
  return user?.role === UserRole.ADMIN
}

export function canEditSolution(user: JWTPayload | null, solutionAuthorId: string | null): boolean {
  if (!user) return false
  if (user.role === UserRole.ADMIN) return true
  return user.userId === solutionAuthorId
}
