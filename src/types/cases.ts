/**
 * Case showcase related type definitions
 * Centralized types for case studies and showcase items
 */

export interface CaseShowcaseItem {
  slug: string
  title: string
  description: string
  image?: string
  externalUrl: string
  tags?: string[]
} 