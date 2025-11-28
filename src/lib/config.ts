import { getDictionary } from './dictionaries'
import { Locale, defaultLocale } from './i18n'

// Type definitions for better TypeScript support
export interface SiteConfig {
  site: {
    name: string
    description: string
    url: string
    email: string
    author: string
    logo: string
    copyright: string
    tagline: string
  }
  social: Array<{
    name: string
    url: string
    icon: string
  }>
}

export interface NavigationConfig {
  header: {
    navigation: Array<{
      name: string
      href: string
    }>
    cta: {
      text: string
      href: string
    }
  }
  footer: {
    sections: Array<{
      title: string
      links: Array<{
        name: string
        href: string
      }>
    }>
  }
}

// Pricing types are now in @/types/pricing
export type { 
  PricingPlan, 
  ComparisonFeature, 
  PricingConfig 
} from '@/types/pricing'

// Feature types are now in @/types/features
export type { 
  Feature, 
  FeatureCategory, 
  FeaturesConfig 
} from '@/types/features'

// Testimonial types are now in @/types/testimonials
export type { Testimonial, TestimonialsConfig } from '@/types/testimonials'

// FAQ types are now in @/types/faq
export type { FAQConfig } from '@/types/faq'

export interface BlockComponent {
  id: string
  name: string
  description: string
  category: string
  previewUrl?: string
  preview: {
    title: string
    description: string
    code: string
  }
}

export interface BlockCategory {
  name: string
  id: string
  components: BlockComponent[]
}

export interface BlockPreview {
  title: string
  description: string
  code: string
}

export interface BlocksConfig {
  categories: BlockCategory[]
}

// Helper functions for common operations that now use dictionaries
export const getSiteInfo = async (locale: Locale = defaultLocale) => {
  const dict = await getDictionary(locale)
  return dict.site
}

export const getSocialLinks = async (locale: Locale = defaultLocale) => {
  const dict = await getDictionary(locale)
  return dict.social
}

export const getHeaderNavigation = async (locale: Locale = defaultLocale) => {
  const dict = await getDictionary(locale)
  return dict.header
}

export const getFooterNavigation = async (locale: Locale = defaultLocale) => {
  const dict = await getDictionary(locale)
  return dict.footer
}

export const getPricingPlans = async (locale: Locale = defaultLocale) => {
  const dict = await getDictionary(locale)
  return dict.pricing.plans
}

export const getPricingComparison = async (locale: Locale = defaultLocale) => {
  // Note: comparison data might need to be added to dictionaries if needed
  return []
}

export const getPricingFAQs = async (locale: Locale = defaultLocale) => {
  const dict = await getDictionary(locale)
  // 返回定价页面特有的FAQ + 共享的常见FAQ
  return [...dict.pricing.faqs, ...dict.shared.commonFaqs]
}

export const getMainFeatures = async (locale: Locale = defaultLocale) => {
  const dict = await getDictionary(locale)
  return dict.features.main
}

export const getHeroFeatures = async (locale: Locale = defaultLocale) => {
  const dict = await getDictionary(locale)
  return dict.shared.heroFeatures
}

export const getFeatureCategories = async (locale: Locale = defaultLocale) => {
  // Note: categories data might need to be added to dictionaries if needed
  return []
}

export const getSupportFeatures = async (locale: Locale = defaultLocale) => {
  const dict = await getDictionary(locale)
  return dict.features.page.supportFeatures
}

export const getTestimonials = async (locale: Locale = defaultLocale) => {
  const dict = await getDictionary(locale)
  return dict.testimonials.testimonials
}

export const getTestimonialStats = async (locale: Locale = defaultLocale) => {
  const dict = await getDictionary(locale)
  return dict.testimonials.stats
}

export const getFAQs = async (locale: Locale = defaultLocale) => {
  const dict = await getDictionary(locale)
  return dict.faq.faqs
}



// Icon mapping utility (since we can't import React components in JSON)
export const getIconComponent = (iconName: string) => {
  // This will be used in components to map string icon names to actual icon components
  return iconName
} 