/**
 * Testimonials related type definitions
 * Centralized types for testimonials, stats, and related components
 */

export interface Testimonial {
  rating: number
  content: string
  avatar?: string
  name?: string
  role?: string
}

export interface TestimonialStat {
  value: string
  label: string
}

export interface TestimonialsData {
  title?: string
  description?: string
  testimonials: Testimonial[]
  stats?: TestimonialStat[]
}

export interface TestimonialsConfig {
  testimonials: Testimonial[]
  stats: TestimonialStat[]
}

export interface TestimonialsGridProps {
  testimonials: Testimonial[]
  stats?: TestimonialStat[]
  columns?: 1 | 2 | 3
  className?: string
  showStats?: boolean
}

export interface TestimonialsProps {
  dict?: {
    testimonials: TestimonialsData
  }
  lang?: string
}

export interface TestimonialCardProps {
  testimonial: Testimonial
}

export interface StatsRowProps {
  stats: TestimonialStat[]
} 