'use client'

import { useState } from 'react'

export default function TestButtons() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('')

  const handleClick = () => {
    setCount(count + 1)
    setMessage(`Button clicked ${count + 1} times!`)
    console.log('Button clicked!')
  }

  const handleSignIn = () => {
    setMessage('Sign In button clicked!')
    console.log('Sign In clicked!')
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4">Test Buttons</h3>
      
      <div className="space-y-4">
        <button
          onClick={handleClick}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Button (Count: {count})
        </button>
        
        <button
          onClick={handleSignIn}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Sign In Test
        </button>
        
        {message && (
          <div className="p-2 bg-yellow-100 text-yellow-800 rounded">
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
