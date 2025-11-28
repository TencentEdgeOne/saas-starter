import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCardDetailedProps {
  icon: LucideIcon;
  title: string;
  description: string;
  benefits: string[];
  className?: string;
  variant?: 'default' | 'compact';
}

export function FeatureCardDetailed({ 
  icon: Icon, 
  title, 
  description, 
  benefits,
  className = "",
  variant = 'default'
}: FeatureCardDetailedProps) {
  const isCompact = variant === 'compact';

  return (
    <Card className={`hover:shadow-lg transition-shadow ${className}`}>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className={`${isCompact ? 'h-5 w-5' : 'h-6 w-6'} text-primary`} />
          </div>
          <div>
            <CardTitle className={`${isCompact ? 'text-lg' : 'text-xl'}`}>
              {title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className={`${isCompact ? 'text-sm' : 'text-base'} mb-4`}>
          {description}
        </CardDescription>
        <div className="space-y-2">
          {benefits.map((benefit, index) => (
            <div key={index} className={`flex items-center ${isCompact ? 'text-xs' : 'text-sm'}`}>
              <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0"></div>
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 