"use client";

import Image from "next/image";
import { ReactNode } from "react";

export interface ContentSectionProps {
  title: string;
  children: ReactNode;
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  layout?: "text-left" | "text-right";
  titleLevel?: "h1" | "h2" | "h3" | "h4";
  className?: string;
  imageClassName?: string;
  contentClassName?: string;
}

export function ContentSection({
  title,
  children,
  image,
  layout = "text-left",
  titleLevel = "h2",
  className = "",
  imageClassName = "",
  contentClassName = ""
}: ContentSectionProps) {
  const TitleTag = titleLevel;
  const isTextLeft = layout === "text-left";

  // If no image, only display text content
  if (!image) {
    return (
      <div className={`${className}`}>
        <TitleTag className="text-responsive-lg font-bold text-foreground mb-6">
          {title}
        </TitleTag>
        <div className={`space-y-4 text-muted-foreground leading-relaxed ${contentClassName}`}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${className}`}>
                {/* Text content */}
      <div className={`${isTextLeft ? "lg:order-1" : "lg:order-2"} space-y-6`}>
        <TitleTag className="text-responsive-lg font-bold text-foreground">
          {title}
        </TitleTag>
        <div className={`space-y-4 text-muted-foreground leading-relaxed ${contentClassName}`}>
          {children}
        </div>
      </div>

                {/* Image content */}
      <div className={`${isTextLeft ? "lg:order-2" : "lg:order-1"} relative`}>
        <div className={`relative rounded-2xl overflow-hidden shadow-xl ${imageClassName}`}>
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width || 600}
            height={image.height || 400}
            className="w-full h-auto object-cover"
            priority={false}
          />
                      {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        </div>
        
                    {/* Decorative elements */}
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-secondary/10 rounded-full blur-2xl" />
      </div>
    </div>
  );
}

// Preset content section variants
export function StorySection({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <ContentSection
      title={title}
      className={className}
    >
      {children}
    </ContentSection>
  );
}

export function FeatureSection({ 
  title, 
  children, 
  image, 
  layout = "text-left",
  className = "" 
}: { 
  title: string; 
  children: ReactNode; 
  image: ContentSectionProps['image'];
  layout?: "text-left" | "text-right";
  className?: string;
}) {
  return (
    <ContentSection
      title={title}
      image={image}
      layout={layout}
      className={className}
      imageClassName="bg-gradient-to-br from-background to-muted/20"
    >
      {children}
    </ContentSection>
  );
}

export function AboutSection({ 
  title, 
  children, 
  className = "" 
}: { 
  title: string; 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <ContentSection
      title={title}
      titleLevel="h2"
      className={className}
      contentClassName="text-base"
    >
      {children}
    </ContentSection>
  );
} 