/**
 * Authentication Hook
 * 
 * Manages user authentication state, login/logout functions,
 * and provides user context throughout the application.
 */

"use client";

import { useState, useEffect, createContext, useContext } from 'react'
import { verifyToken } from '@/lib/auth'

interface User {
  id: string
  email: string
  username: string
  role: 'USER' | 'ADMIN'
}

interface AuthContextType {
  user: User | null
  login: (token: string, userData: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing token on app load
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth-token')
        if (token) {
          const payload = verifyToken(token)
          if (payload) {
            setUser({
              id: payload.userId,
              email: payload.email,
              username: payload.username,
              role: payload.role,
            })
          } else {
            localStorage.removeItem('auth-token')
          }
        }
      } catch (error) {
        console.error('Auth check error:', error)
        localStorage.removeItem('auth-token')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = (token: string, userData: User) => {
    localStorage.setItem('auth-token', token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('auth-token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
