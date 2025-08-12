'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, User, Eye, EyeOff } from 'lucide-react'

interface Solution {
  id: string
  problemCode: string
  title: string
  contentMarkdown: string
  contentHtml: string
  problemLink?: string
  submissionLink?: string
  isPublic: boolean
  isAnonymous: boolean
  createdAt: string
  author?: {
    id: string
    username: string
  }
  _count: {
    reactions: number
  }
}

interface SolutionListProps {
  viewMode: 'public' | 'private'
  searchQuery: string
}

export default function SimpleSolutionList({ viewMode, searchQuery }: SolutionListProps) {
  const [solutions, setSolutions] = useState<Record<string, Solution[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSolutions = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          public: viewMode === 'public' ? 'true' : 'false',
          search: searchQuery,
        })

        const response = await fetch(`/api/solutions?${params}`)
        
        if (!response.ok) {
          if (response.status === 401) {
            setError('Please log in to view private solutions')
          } else {
            setError('Failed to load solutions')
          }
          return
        }

        const data = await response.json()
        setSolutions(data.solutions)
      } catch (error) {
        setError('Failed to load solutions')
        console.error('Error fetching solutions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSolutions()
  }, [viewMode, searchQuery])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading solutions...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        {error.includes('log in') && (
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
          >
            Try Again
          </button>
        )}
      </div>
    )
  }

  const problemCodes = Object.keys(solutions).sort()

  if (problemCodes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          {viewMode === 'public' ? 'No public solutions found' : 'No private solutions found'}
        </div>
        {searchQuery && (
          <div className="text-sm text-gray-400">
            Try adjusting your search terms
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {problemCodes.map((problemCode) => (
        <div key={problemCode} className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">{problemCode}</h3>
              <div className="flex items-center gap-2">
                {solutions[problemCode][0]?.isPublic ? (
                  <Eye className="w-5 h-5 text-green-500" />
                ) : (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {solutions[problemCode].map((solution) => (
              <div key={solution.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {solution.title}
                    </h4>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>
                          {solution.isAnonymous ? 'Anonymous' : solution.author?.username || 'Unknown'}
                        </span>
                      </div>
                      <span>
                        {new Date(solution.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {solution.problemLink && (
                      <div className="mb-2">
                        <a
                          href={solution.problemLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Problem Link
                        </a>
                      </div>
                    )}

                    {solution.submissionLink && (
                      <div className="mb-3">
                        <a
                          href={solution.submissionLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-green-500 hover:text-green-600 text-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Submission Link
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                    {solution.contentMarkdown}
                  </pre>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span>{solution._count.reactions} reactions</span>
                  <div className="flex items-center gap-2">
                    {solution.isPublic && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        Public
                      </span>
                    )}
                    {solution.isAnonymous && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        Anonymous
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
