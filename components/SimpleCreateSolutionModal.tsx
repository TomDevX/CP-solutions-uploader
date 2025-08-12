'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface SimpleCreateSolutionModalProps {
  onClose: () => void
}

export default function SimpleCreateSolutionModal({ onClose }: SimpleCreateSolutionModalProps) {
  const [formData, setFormData] = useState({
    problemCode: '',
    title: '',
    content: '',
    problemLink: '',
    submissionLink: '',
    isPublic: false,
    isAnonymous: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/solutions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemCode: formData.problemCode,
          title: formData.title,
          contentMarkdown: formData.content,
          contentHtml: formData.content,
          problemLink: formData.problemLink,
          submissionLink: formData.submissionLink,
          isPublic: formData.isPublic,
          isAnonymous: formData.isAnonymous,
        }),
      })

      if (response.ok) {
        alert('Solution created successfully!')
        onClose()
        // Refresh the page to show new solution
        window.location.reload()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create solution')
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to create solution')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Create New Solution</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Problem Code *
            </label>
            <input
              type="text"
              required
              value={formData.problemCode}
              onChange={(e) => setFormData(prev => ({ ...prev, problemCode: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 148A, CF-148A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder="Solution title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Problem Link
            </label>
            <input
              type="url"
              value={formData.problemLink}
              onChange={(e) => setFormData(prev => ({ ...prev, problemLink: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder="https://codeforces.com/problemset/problem/148/A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Submission Link
            </label>
            <input
              type="url"
              value={formData.submissionLink}
              onChange={(e) => setFormData(prev => ({ ...prev, submissionLink: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder="https://codeforces.com/contest/148/submission/123456"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Solution Content *
            </label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 h-32 resize-none"
              placeholder="Write your solution here..."
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="postType"
                checked={formData.isPublic && !formData.isAnonymous}
                onChange={() => setFormData(prev => ({ ...prev, isPublic: true, isAnonymous: false }))}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Make public (requires login)</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="postType"
                checked={formData.isAnonymous && !formData.isPublic}
                onChange={() => setFormData(prev => ({ ...prev, isAnonymous: true, isPublic: false }))}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Post anonymously (no login required)</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Solution'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
