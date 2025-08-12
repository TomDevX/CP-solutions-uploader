/**
 * Root Layout Component
 * 
 * Provides the main layout structure, metadata, and global providers
 * for the competitive programming solutions platform.
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CP Solutions Uploader',
  description: 'A platform for competitive programming users to upload, store, view, edit, and react to solutions',
  keywords: ['competitive programming', 'algorithms', 'solutions', 'codeforces', 'leetcode'],
  authors: [{ name: 'TomDev' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
