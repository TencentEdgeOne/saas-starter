"use client"

import {
  Zap,
  Shield,
  Palette,
  Code,
  Database,
  Globe,
  Smartphone,
  BarChart3,
  Lock,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Icon mapping
const iconMap = {
  Zap,
  Shield,
  Palette,
  Code,
  Database,
  Globe,
  Smartphone,
  BarChart3,
  Lock,
} as const

import type { Feature } from '@/types/features'

interface FeaturesGridProps {
  features: Feature[]
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export function FeatureItem({ feature }: { feature: Feature }) {
  const IconComponent = iconMap[feature.icon as keyof typeof iconMap]
  
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
          <IconComponent className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-xl">{feature.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">
          {feature.description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}

export function FeaturesGrid({ 
  features, 
  columns = 3, 
  className = '' 
}: FeaturesGridProps) {
  const getGridClasses = () => {
    const gridClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    }
    return gridClasses[columns]
  }
  
  return (
    <div className={`grid ${getGridClasses()} gap-8 ${className}`}>
      {features.map((feature, index) => (
        <FeatureItem key={index} feature={feature} />
      ))}
    </div>
  )
} 