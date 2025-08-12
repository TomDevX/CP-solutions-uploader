'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronRight, Eye, Edit, Trash2, Heart, Bookmark, ThumbsUp } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { formatDate } from '@/lib/utils'

interface Solution {
  id: string
  problemCode: string
  title: string
  contentMarkdown: string
  isPublic: boolean
  isAnonymous: boolean
  createdAt: string
  author?: {
    id: string
    username: string
  } | null
  _count: {
    reactions: number
  }
}

interface SolutionListProps {
  viewMode: 'public' | 'private'
  searchQuery: string
}

export default function SolutionList({ viewMode, searchQuery }: SolutionListProps) {
  const [solutions, setSolutions] = useState<Record<string, Solution[]>>({})
  const [sortedProblemCodes, setSortedProblemCodes] = useState<string[]>([])
  const [expandedProblems, setExpandedProblems] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchSolutions()
  }, [viewMode, searchQuery])

  const fetchSolutions = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        public: viewMode === 'public' ? 'true' : 'false',
      })
      
      if (searchQuery) {
        params.append('search', searchQuery)
      }

      const response = await fetch(`/api/solutions?${params}`)
      const data = await response.json()

      if (response.ok) {
        setSolutions(data.solutions)
        setSortedProblemCodes(data.sortedProblemCodes)
      }
    } catch (error) {
      console.error('Error fetching solutions:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleProblem = (problemCode: string) => {
    const newExpanded = new Set(expandedProblems)
    if (newExpanded.has(problemCode)) {
      newExpanded.delete(problemCode)
    } else {
      newExpanded.add(problemCode)
    }
    setExpandedProblems(newExpanded)
  }

  const handleReaction = async (solutionId: string, type: 'LIKE' | 'HELPFUL' | 'BOOKMARK') => {
    if (!user) return

    try {
      const response = await fetch(`/api/solutions/${solutionId}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      })

      if (response.ok) {
        fetchSolutions()
      }
    } catch (error) {
      console.error('Error adding reaction:', error)
    }
  }

  const canEditSolution = (solution: Solution) => {
    if (!user) return false
    if (user.role === 'ADMIN') return true
    return solution.author?.id === user.id
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="spinner"></div>
        <span className="ml-3 text-gray-600">Loading solutions...</span>
      </div>
    )
  }

  if (sortedProblemCodes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">
          {searchQuery ? 'No solutions found for your search.' : 'No solutions available.'}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sortedProblemCodes.map((problemCode) => {
        const problemSolutions = solutions[problemCode] || []
        const isExpanded = expandedProblems.has(problemCode)
        const solutionCount = problemSolutions.length

        return (
          <motion.div
            key={problemCode}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => toggleProblem(problemCode)}
              className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    )}
                  </motion.div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {problemCode}
                    </h3>
                    <p className="text-gray-600">
                      {solutionCount} solution{solutionCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  {solutionCount > 0 && (
                    <span>
                      Latest: {formatDate(problemSolutions[0].createdAt)}
                    </span>
                  )}
                </div>
              </div>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-100"
                >
                  <div className="p-4 space-y-4">
                    {problemSolutions.map((solution) => (
                      <motion.div
                        key={solution.id}
                        className="bg-gray-50 rounded-xl p-4"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">
                              {solution.title}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>
                                by {solution.isAnonymous ? 'Anonymous' : solution.author?.username || 'Unknown'}
                              </span>
                              <span>{formatDate(solution.createdAt)}</span>
                              {!solution.isPublic && (
                                <span className="text-orange-600">Private</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </div>

                        <div className="text-gray-700 text-sm mb-3 line-clamp-2">
                          {solution.contentMarkdown.substring(0, 200)}...
                        </div>

                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => handleReaction(solution.id, 'LIKE')}
                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <Heart className="w-4 h-4" />
                            <span>{solution._count.reactions}</span>
                          </button>
                          
                          <button 
                            onClick={() => handleReaction(solution.id, 'HELPFUL')}
                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-500 transition-colors"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            <span>Helpful</span>
                          </button>
                          
                          <button 
                            onClick={() => handleReaction(solution.id, 'BOOKMARK')}
                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500 transition-colors"
                          >
                            <Bookmark className="w-4 h-4" />
                            <span>Bookmark</span>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}
