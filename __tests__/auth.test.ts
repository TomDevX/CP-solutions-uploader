/**
 * Authentication Tests
 * 
 * Unit tests for authentication utilities and API endpoints.
 * Tests password hashing, JWT token generation, and user authentication.
 */

import { hashPassword, verifyPassword, generateToken, verifyToken } from '@/lib/auth'

describe('Authentication Utilities', () => {
  describe('Password Hashing', () => {
    it('should hash password correctly', async () => {
      const password = 'testPassword123'
      const hashedPassword = await hashPassword(password)
      
      expect(hashedPassword).toBeDefined()
      expect(hashedPassword).not.toBe(password)
      expect(hashedPassword.length).toBeGreaterThan(20)
    })

    it('should verify password correctly', async () => {
      const password = 'testPassword123'
      const hashedPassword = await hashPassword(password)
      
      const isValid = await verifyPassword(password, hashedPassword)
      expect(isValid).toBe(true)
    })

    it('should reject incorrect password', async () => {
      const password = 'testPassword123'
      const wrongPassword = 'wrongPassword123'
      const hashedPassword = await hashPassword(password)
      
      const isValid = await verifyPassword(wrongPassword, hashedPassword)
      expect(isValid).toBe(false)
    })
  })

  describe('JWT Token', () => {
    const mockUser = {
      id: 'user123',
      email: 'test@example.com',
      username: 'testuser',
      role: 'USER' as const,
    }

    it('should generate valid token', () => {
      const token = generateToken(mockUser)
      
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3) // JWT has 3 parts
    })

    it('should verify valid token', () => {
      const token = generateToken(mockUser)
      const payload = verifyToken(token)
      
      expect(payload).toBeDefined()
      expect(payload?.userId).toBe(mockUser.id)
      expect(payload?.email).toBe(mockUser.email)
      expect(payload?.username).toBe(mockUser.username)
      expect(payload?.role).toBe(mockUser.role)
    })

    it('should reject invalid token', () => {
      const invalidToken = 'invalid.token.here'
      const payload = verifyToken(invalidToken)
      
      expect(payload).toBeNull()
    })
  })
})
