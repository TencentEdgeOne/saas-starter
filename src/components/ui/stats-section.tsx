"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

import type { StatItem } from '@/types/stats'
export type { StatItem }

export interface StatsSectionProps {
  stats: StatItem[];
  title?: string;
  description?: string;
  variant?: "default" | "cards" | "minimal" | "highlight";
  columns?: 2 | 3 | 4 | 5;
  className?: string;
  children?: ReactNode;
}

export function StatsSection({
  stats,
  title,
  description,
  variant = "default",
  columns = 3,
  className = ""
}: StatsSectionProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "cards":
        return "bg-muted/30";
      case "minimal":
        return "bg-background";
      case "highlight":
        return "bg-gradient-to-r from-primary/5 via-background to-primary/5";
      default:
        return "bg-background";
    }
  };

  const getColumnClasses = () => {
    switch (columns) {
      case 2:
        return "grid-cols-1 sm:grid-cols-2";
      case 3:
        return "grid-cols-1 sm:grid-cols-3";
      case 4:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
      case 5:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5";
      default:
        return "grid-cols-1 sm:grid-cols-3";
    }
  };

  const getColorClasses = (color: StatItem['color'] = 'primary') => {
    switch (color) {
      case "secondary":
        return "text-secondary";
      case "success":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "destructive":
        return "text-red-600";
      default:
        return "text-primary";
    }
  };

  const StatItemComponent = ({ stat, index }: { stat: StatItem; index: number }) => {
    const colorClass = getColorClasses(stat.color);
    
    if (variant === "cards") {
      return (
        <div className="bg-card rounded-xl border shadow-sm p-6 text-center hover:shadow-md transition-shadow">
          {stat.icon && (
            <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4`}>
              <stat.icon className={`w-6 h-6 ${colorClass}`} />
            </div>
          )}
          <div className={`text-3xl md:text-4xl font-bold ${colorClass} mb-2`}>
            {stat.prefix}{stat.value}{stat.suffix}
          </div>
          <div className="text-muted-foreground font-medium">{stat.label}</div>
          {stat.description && (
            <div className="text-sm text-muted-foreground/80 mt-2">{stat.description}</div>
          )}
        </div>
      );
    }

    if (variant === "minimal") {
      return (
        <div className="text-center">
          <div className={`text-2xl md:text-3xl font-bold ${colorClass} mb-1`}>
            {stat.prefix}{stat.value}{stat.suffix}
          </div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </div>
      );
    }

    // Default and highlight variants
    return (
      <div className="text-center">
        {stat.icon && (
          <div className={`w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3`}>
            <stat.icon className={`w-5 h-5 ${colorClass}`} />
          </div>
        )}
        <div className={`text-4xl md:text-5xl font-bold ${colorClass} mb-2`}>
          {stat.prefix}{stat.value}{stat.suffix}
        </div>
        <div className="text-muted-foreground font-medium">{stat.label}</div>
        {stat.description && (
          <div className="text-sm text-muted-foreground/80 mt-2">{stat.description}</div>
        )}
      </div>
    );
  };

  return (
    <section className={`section-padding ${getVariantClasses()} ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || description) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-responsive-lg font-bold text-foreground mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xl text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}
        
        <div className={`grid ${getColumnClasses()} gap-8`}>
          {stats.map((stat, index) => (
            <StatItemComponent key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Preset statistics component variants - now receives dictionary data
export function CompanyStats({ 
  stats,
  className = "" 
}: { 
  stats?: Array<{
    value: string;
    label: string;
    suffix?: string;
    prefix?: string;
    color?: string;
  }>;
  className?: string;
}) {
  // Use default values as fallback if no stats provided
  const defaultStats = [
    { value: "250+", label: "Happy Customers", color: "primary" },
    { value: "50+", label: "Countries Served", color: "primary" },
    { value: "99%", label: "Satisfaction Rate", color: "primary" }
  ];

  const statsData = stats || defaultStats;

  return (
    <StatsSection
      stats={statsData.map(stat => ({
        ...stat,
        color: (stat.color as StatItem['color']) || 'primary'
      }))}
      variant="default"
      columns={3}
      className={className}
    />
  );
}

export function BusinessMetrics({ 
  stats,
  className = "" 
}: { 
  stats?: Array<{
    value: string;
    label: string;
    suffix?: string;
    prefix?: string;
    color?: string;
  }>;
  className?: string;
}) {
  // Use default values as fallback if no stats provided
  const defaultStats = [
    { value: "500", suffix: "K+", label: "Active Users", color: "primary" },
    { value: "150", suffix: "+", label: "Integrations", color: "secondary" },
    { value: "99.9", suffix: "%", label: "Uptime", color: "success" },
    { value: "24/7", label: "Support", color: "primary" }
  ];

  const statsData = stats || defaultStats;

  return (
    <StatsSection
      stats={statsData.map(stat => ({
        ...stat,
        color: (stat.color as StatItem['color']) || 'primary'
      }))}
      variant="cards"
      columns={4}
      className={className}
    />
  );
}

export function ProductStats({ 
  title,
  stats,
  className = "" 
}: { 
  title?: string;
  stats?: Array<{
    value: string;
    label: string;
    suffix?: string;
    prefix?: string;
    color?: string;
  }>;
  className?: string;
}) {
  // Use default values as fallback if no data provided
  const defaultTitle = "Trusted by thousands";
  const defaultStats = [
    { value: "1M+", label: "Downloads", color: "primary" },
    { value: "4.9", suffix: "/5", label: "User Rating", color: "primary" },
    { value: "150+", label: "Countries", color: "primary" },
    { value: "24/7", label: "Support", color: "primary" },
    { value: "99%", label: "Uptime", color: "primary" }
  ];

  const titleData = title || defaultTitle;
  const statsData = stats || defaultStats;

  return (
    <StatsSection
      title={titleData}
      stats={statsData.map(stat => ({
        ...stat,
        color: (stat.color as StatItem['color']) || 'primary'
      }))}
      variant="highlight"
      columns={5}
      className={className}
    />
  );
} 