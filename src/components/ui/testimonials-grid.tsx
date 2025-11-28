"use client"

import { Star, User } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import type { 
  Testimonial, 
  TestimonialStat, 
  TestimonialsGridProps, 
  TestimonialCardProps,
  StatsRowProps 
} from '@/types/testimonials'

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        {/* Rating */}
        <div className="flex items-center mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-primary text-primary" />
          ))}
        </div>

        {/* Content */}
        <blockquote className="text-foreground mb-4 leading-relaxed">
          "{testimonial.content}"
        </blockquote>

        {/* Author */}
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center mr-3">
            {testimonial.avatar ? (
              <Image
                src={testimonial.avatar}
                alt={testimonial.name || 'User avatar'}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-primary/60" />
            )}
          </div>
          <div>
            <div className="font-medium text-foreground">{testimonial.name}</div>
            <div className="text-sm text-muted-foreground">{testimonial.role}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
      {stats.map((stat, index) => (
        <div key={index}>
          <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
          <div className="text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

export function TestimonialsGrid({ 
  testimonials, 
  stats,
  columns = 3, 
  className = '',
  showStats = true 
}: TestimonialsGridProps) {
  const getGridClasses = () => {
    const gridClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    }
    return gridClasses[columns]
  }
  
  return (
    <div className={className}>
      {/* Testimonials Grid */}
      <div className={`grid ${getGridClasses()} gap-8`}>
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} testimonial={testimonial} />
        ))}
      </div>
      
      {/* Stats Section */}
      {showStats && stats && stats.length > 0 && (
        <div className="mt-16">
          <StatsRow stats={stats} />
        </div>
      )}
    </div>
  )
} 