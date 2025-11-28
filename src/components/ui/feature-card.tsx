"use client";

import React from 'react';
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { FeatureWithLucideIcon } from '@/types/features'

// Re-export for backward compatibility
export type FeatureItem = FeatureWithLucideIcon

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  variant?: 'default' | 'center' | 'compact';
}

export function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  className = "",
  variant = 'default'
}: FeatureCardProps) {
  const isCenter = variant === 'center';
  const isCompact = variant === 'compact';

  return (
    <Card className={`border-none shadow-lg hover:shadow-xl transition-shadow ${className}`}>
      <CardContent className={`p-6 ${isCenter ? 'text-center' : ''} ${isCompact ? 'p-4' : ''}`}>
        <Icon className={`h-12 w-12 text-primary ${isCenter ? 'mx-auto' : ''} mb-4`} />
        <h3 className={`font-semibold mb-2 ${isCompact ? 'text-base' : 'text-lg'}`}>
          {title}
        </h3>
        <p className={`text-muted-foreground ${isCompact ? 'text-xs' : 'text-sm'}`}>
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

// Preset Feature component variants
export function HeroFeatureCard({ feature, className }: { feature: FeatureItem; className?: string }) {
  return <FeatureCard icon={feature.icon} title={feature.title} description={feature.description} className={className} variant="center" />;
}

export function DetailedFeatureCard({ feature, className }: { feature: FeatureItem; className?: string }) {
  return <FeatureCard icon={feature.icon} title={feature.title} description={feature.description} className={className} variant="center" />;
}

export function CompactFeatureCard({ feature, className }: { feature: FeatureItem; className?: string }) {
  return <FeatureCard icon={feature.icon} title={feature.title} description={feature.description} className={className} variant="compact" />;
}

export function MinimalFeatureCard({ feature, className }: { feature: FeatureItem; className?: string }) {
  return <FeatureCard icon={feature.icon} title={feature.title} description={feature.description} className={className} variant="center" />;
} 