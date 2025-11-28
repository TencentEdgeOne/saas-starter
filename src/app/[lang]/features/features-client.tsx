"use client";

import { 
  Zap, 
  Shield, 
  Globe, 
  BarChart3, 
  Users, 
  Smartphone, 
  Clock, 
  Database,
  Settings,
  Palette,
  Lock,
  Headphones,
  Rocket,
  Target,
  Layers,
  Code
} from "lucide-react";
import { FeatureCard } from "@/components/ui/feature-card";
import { FeatureCardDetailed } from "@/components/ui/feature-card-detailed";
import { SupportCard } from "@/components/ui/support-card";

// Icon mapping for dynamic icon rendering
const iconMap = {
  Zap,
  Shield,
  Globe,
  BarChart3,
  Users,
  Smartphone,
  Clock,
  Database,
  Settings,
  Palette,
  Lock,
  Headphones,
  Rocket,
  Target,
  Layers,
  Code
} as const;

import type { 
  Feature, 
  DetailedFeature, 
  FeatureCategory 
} from '@/types/features'

{/* Hero Features */}
export function HeroFeatures({ heroFeatures }: { heroFeatures: Feature[] }) {
  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
        {heroFeatures.map((feature, index) => {
          const IconComponent = iconMap[feature.icon as keyof typeof iconMap];
          return (
            <FeatureCard
              key={index}
              icon={IconComponent}
              title={feature.title}
              description={feature.description}
              variant="center"
            />
          );
        })}
      </div>
  )
}

{/* Feature Categories */}
export function FeaturesClient({ featureCategories }: { featureCategories: FeatureCategory[] }) {
  return (
    <>

      {/* Feature Categories */}
      {featureCategories.map((category, categoryIndex) => (
        <section key={categoryIndex} className={`py-1 px-4 ${categoryIndex % 2 === 1 ? 'bg-muted/50' : ''}`}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {category.features.map((feature, featureIndex) => {
                const FeatureIcon = iconMap[feature.icon as keyof typeof iconMap];
                return (
                  <FeatureCardDetailed
                    key={featureIndex}
                    icon={FeatureIcon}
                    title={feature.title}
                    description={feature.description}
                    benefits={feature.benefits}
                  />
                );
              })}
            </div>
          </div>
        </section>
      ))}

      
    </>
  );
} 
{/* Support Features */}
export function SupportFeatures({ supportFeatures }: { supportFeatures: Feature[] }) {
  return (<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {supportFeatures.map((feature, index) => {
          const SupportIcon = iconMap[feature.icon as keyof typeof iconMap];
          return (
            <SupportCard
              key={index}
              icon={SupportIcon}
              title={feature.title}
              description={feature.description}
            />
          );
        })}
      </div>);
}