import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date into a consistent string format.
 * Ensures consistency between server-side and client-side rendering.
 * @param date - Date string or Date object
 * @returns Formatted date string (MM/DD/YYYY format)
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return 'N/A'
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    // Use a fixed format to ensure consistency between server and client
    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const day = String(dateObj.getDate()).padStart(2, '0')
    
    return `${month}/${day}/${year}`
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'N/A'
  }
}


export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
} 