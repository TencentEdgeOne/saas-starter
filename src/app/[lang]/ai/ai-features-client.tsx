"use client"

import { FeatureCard } from '@/components/ui/feature-card'
import type { Feature } from '@/types/features'
import {
  Zap,
  Palette,
  Settings,
  Shield,
  Sparkles
} from 'lucide-react'

const iconMap = {
  Zap,
  Palette,
  Settings,
  Shield
} as const

interface AIFeaturesClientProps {
  features: Feature[]
}

export function AIFeaturesClient({ features }: AIFeaturesClientProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map((feature, index) => {
        const IconComponent =
          iconMap[feature.icon as keyof typeof iconMap] || Sparkles

        return (
          <FeatureCard
            key={`${feature.title}-${index}`}
            icon={IconComponent}
            title={feature.title}
            description={feature.description}
            variant="center"
          />
        )
      })}
    </div>
  )
}

