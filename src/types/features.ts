/**
 * Feature related type definitions
 * Centralized types for features, feature categories, and related data structures
 */

export interface Feature {
  icon: string
  title: string
  description: string
  benefits?: string[]
}

export interface DetailedFeature {
  icon: string
  title: string
  description: string
  benefits: string[]
}

export interface FeatureCategory {
  category: string
  description: string
  features: DetailedFeature[]
}

export interface FeaturesConfig {
  hero: Feature[]
  main: Feature[]
  categories: FeatureCategory[]
  support: Feature[]
}

// For UI components that need different icon types
export interface FeatureWithLucideIcon {
  icon: any // LucideIcon type
  title: string
  description: string
  benefits?: string[]
  link?: {
    href: string
    text: string
  }
} 