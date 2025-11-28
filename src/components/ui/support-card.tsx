import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface SupportCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  variant?: 'default' | 'compact';
}

export function SupportCard({ 
  icon: Icon, 
  title, 
  description, 
  className = "",
  variant = 'default'
}: SupportCardProps) {
  const isCompact = variant === 'compact';

  return (
    <Card className={`text-center hover:shadow-lg transition-shadow ${className}`}>
      <CardContent className={`${isCompact ? 'p-6' : 'p-8'}`}>
        <Icon className={`${isCompact ? 'h-10 w-10' : 'h-12 w-12'} text-primary mx-auto mb-4`} />
        <h3 className={`${isCompact ? 'text-lg' : 'text-xl'} font-semibold mb-2`}>
          {title}
        </h3>
        <p className={`text-muted-foreground ${isCompact ? 'text-sm' : ''}`}>
          {description}
        </p>
      </CardContent>
    </Card>
  );
} 