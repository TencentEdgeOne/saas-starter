"use client"

import { SectionLayout } from "@/components/layout/section-layout"
import { TestimonialsGrid } from "@/components/ui/testimonials-grid"
import type { TestimonialsProps } from '@/types/testimonials'

export function Testimonials({ dict, lang }: TestimonialsProps) {
  const testimonials = dict?.testimonials.testimonials || []
  const stats = dict?.testimonials.stats || []
  
  return (
    <SectionLayout
      title={dict?.testimonials?.title}
      description={dict?.testimonials?.description}
      locale={lang || 'en'}
      background="muted"
    >
      <TestimonialsGrid 
        testimonials={testimonials} 
        stats={stats}
        showStats={stats.length > 0}
      />
    </SectionLayout>
  )
} 