/**
 * Header Component
 * 
 * Animated header with navigation, user authentication, and lively UI elements
 * inspired by summer.hackclub.com design patterns.
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, User, LogIn, LogOut, Settings, Crown, Code } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import AuthModal from './AuthModal'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, logout } = useAuth()

  return (
    <>
      <motion.header
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                CP Solutions
              </span>
            </motion.div>

            <nav className="hidden md:flex items-center gap-6">
              <motion.a
                href="#"
                className="text-gray-600 hover:text-primary-600 transition-colors"
                whileHover={{ y: -2 }}
              >
                Browse
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-600 hover:text-primary-600 transition-colors"
                whileHover={{ y: -2 }}
              >
                Problems
              </motion.a>
            </nav>

            <div className="flex items-center gap-4">
              {user ? (
                <motion.div
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {user.role === 'ADMIN' && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                      <Crown className="w-3 h-3" />
                      <span>Admin</span>
                    </div>
                  )}

                  <div className="relative">
                    <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span className="hidden sm:block">{user.username}</span>
                      {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                    </button>

                    {isMenuOpen && (
                      <motion.div
                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <button className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors">
                          <User className="w-4 h-4" />
                          Profile
                        </button>
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-red-50 text-red-600 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.05 }}
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:block">Sign In</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </>
  )
}
