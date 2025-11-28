/**
 * Blog related type definitions
 * Centralized types for blog posts and related data structures
 */

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  author: string
  date: string
  readTime: string
  tags: string[]
  category?: string
  image?: string
  imageAlt?: string
  content?: string
} 