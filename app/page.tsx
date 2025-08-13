'use client'

import { useState } from 'react'
import TestButtons from '@/components/TestButtons'
import SimpleAuthModal from '@/components/SimpleAuthModal'
import SimpleCreateSolutionModal from '@/components/SimpleCreateSolutionModal'
import SimpleSolutionList from '@/components/SimpleSolutionList'

export default function HomePage() {
  const [viewMode, setViewMode] = useState<'public' | 'private'>('public')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleSolutionCreated = () => {
    setShowCreateModal(false)
    setRefreshKey(prev => prev + 1) // Trigger refresh
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Simple Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">CP</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CP Solutions
              </span>
            </div>
            
            <button 
              onClick={() => setShowAuthModal(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 bg-clip-text text-transparent">
            CP Solutions
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Share, discover, and learn from competitive programming solutions
          </p>
        </section>

        {/* Controls Section */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white rounded-2xl p-6 shadow-lg">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search problems, solutions, or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('public')}
                className={`px-4 py-2 rounded-xl transition-all ${
                  viewMode === 'public'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Public
              </button>
              <button
                onClick={() => setViewMode('private')}
                className={`px-4 py-2 rounded-xl transition-all ${
                  viewMode === 'private'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Private
              </button>
            </div>

            {/* Create Solution Button */}
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
            >
              New Solution
            </button>
          </div>
        </section>

        {/* Test Buttons */}
        <section className="mb-8">
          <TestButtons />
        </section>

        {/* Solutions List */}
        <section>
          <SimpleSolutionList
            viewMode={viewMode}
            searchQuery={searchQuery}
            refreshKey={refreshKey}
          />
        </section>
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <SimpleAuthModal onClose={() => setShowAuthModal(false)} />
      )}

      {/* Create Solution Modal */}
      {showCreateModal && (
        <SimpleCreateSolutionModal 
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleSolutionCreated}
        />
      )}
    </div>
  )
}
