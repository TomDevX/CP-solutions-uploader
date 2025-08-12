/**
 * Utility Functions
 * 
 * Provides helper functions for problem code parsing, search functionality,
 * and common operations used throughout the application.
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseProblemCode(code: string): {
  number: number
  suffix: string
  prefix: string
  original: string
} {
  const prefixMatch = code.match(/^([A-Za-z-]+)-(.+)$/)
  if (prefixMatch) {
    const [, prefix, rest] = prefixMatch
    const parsed = parseProblemCode(rest)
    return {
      ...parsed,
      prefix,
      original: code,
    }
  }

  const match = code.match(/^(\d+)([A-Za-z]*)$/)
  if (match) {
    const [, numberStr, suffix] = match
    return {
      number: parseInt(numberStr, 10),
      suffix: suffix || '',
      prefix: '',
      original: code,
    }
  }

  return {
    number: 0,
    suffix: '',
    prefix: '',
    original: code,
  }
}

export function sortProblemCodes(codes: string[]): string[] {
  return codes.sort((a, b) => {
    const parsedA = parseProblemCode(a)
    const parsedB = parseProblemCode(b)

    if (parsedA.prefix !== parsedB.prefix) {
      return parsedA.prefix.localeCompare(parsedB.prefix)
    }

    if (parsedA.number !== parsedB.number) {
      return parsedA.number - parsedB.number
    }

    return parsedA.suffix.localeCompare(parsedB.suffix)
  })
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
