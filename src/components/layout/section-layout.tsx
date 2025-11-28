"use client"

import React from 'react'
import { getHighlightedText } from '@/lib/text-highlight'
import { Badge } from '@/components/ui/badge'

interface SectionLayoutProps {
  children: React.ReactNode
  className?: string
  containerClassName?: string
  contentClassName?: string
  id?: string
  
  // Badge props
  badge?: string
  badgeClassName?: string
  
  // Header props
  title?: string
  description?: string
  titleClassName?: string
  descriptionClassName?: string
  headerClassName?: string
  locale?: string
  enableHighlight?: boolean
  
  // Bottom content props
  bottomContent?: React.ReactNode
  bottomClassName?: string
  
  // Layout variants
  variant?: 'default' | 'narrow' | 'wide'
  background?: 'default' | 'muted' | 'transparent'
  padding?: 'default' | 'large' | 'small'
  headerAlignment?: 'center' | 'left' | 'right'
}

export function SectionLayout({
  children,
  className = '',
  containerClassName = '',
  contentClassName = '',
  id,
  
  // Badge props
  badge,
  badgeClassName = 'bg-primary text-white',
  
  // Header props
  title,
  description,
  titleClassName = '',
  descriptionClassName = '',
  headerClassName = '',
  locale = 'en',
  enableHighlight = true,
  
  // Bottom content props
  bottomContent,
  bottomClassName = '',
  
  // Layout variants
  variant = 'default',
  background = 'default',
  padding = 'default',
  headerAlignment = 'center',
}: SectionLayoutProps) {
  
  // Get variant-based classes
  const getVariantClasses = () => {
    const variants = {
      default: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
      narrow: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8',
      wide: 'max-w-full mx-auto px-4 sm:px-6 lg:px-8',
    }
    return variants[variant]
  }
  
  const getBackgroundClasses = () => {
    const backgrounds = {
      default: '',
      muted: 'bg-muted/30',
      transparent: 'bg-transparent',
    }
    return backgrounds[background]
  }
  
  const getPaddingClasses = () => {
    const paddings = {
      default: 'section-padding',
      large: 'py-24 md:py-32',
      small: 'py-12 md:py-16',
    }
    return paddings[padding]
  }
  
  const getHeaderAlignmentClasses = () => {
    const alignments = {
      center: 'text-center',
      left: 'text-left',
      right: 'text-right',
    }
    return alignments[headerAlignment]
  }
  
  const sectionClasses = `${getPaddingClasses()} ${getBackgroundClasses()} ${className}`.trim()
  const containerClasses = `${getVariantClasses()} ${containerClassName}`.trim()
  const headerClasses = `${getHeaderAlignmentClasses()} ${headerClassName || 'mb-6'}`.trim()
  
  return (
    <section id={id} className={sectionClasses}>
      <div className={containerClasses}>
        {/* Section Header */}
        {(badge || title || description) && (
          <div className={headerClasses}>
            {badge && (
              <Badge className={`mb-4 ${badgeClassName}`}>
                {badge}
              </Badge>
            )}
            {title && (
              <h2 className={`text-responsive-lg font-bold text-foreground mb-4 ${titleClassName}`}>
                {enableHighlight ? (
                  <span dangerouslySetInnerHTML={{
                    __html: getHighlightedText(title, locale)
                  }} />
                ) : (
                  title
                )}
              </h2>
            )}
            {description && (
              <p className={`text-xl text-muted-foreground ${
                headerAlignment === 'center' ? 'max-w-3xl mx-auto' : 
                headerAlignment === 'right' ? 'max-w-3xl ml-auto' : 'max-w-3xl'
              } ${descriptionClassName}`}>
                {description}
              </p>
            )}
          </div>
        )}
        
        {/* Main Content */}
        <div className={contentClassName}>
          {children}
        </div>
        
        {/* Bottom Content */}
        {bottomContent && (
          <div className={`mt-16 ${bottomClassName}`}>
            {bottomContent}
          </div>
        )}
      </div>
    </section>
  )
} 