"use client";

import Link from "next/link";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

import type { BlogPost } from '@/types/blog'
export type { BlogPost }

interface BlogCardProps {
  post: BlogPost;
  variant?: "default" | "wide";
  className?: string;
  lang?: string;
}

export function BlogCard({ post, variant = "default", className = "", lang = "en" }: BlogCardProps) {
  const isWide = variant === "wide";
  const [showAllTags, setShowAllTags] = useState(false);

  if (isWide) {
    return (
      <Card className={`group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-0 bg-gradient-to-br from-background via-background to-muted/20 overflow-hidden ${className}`}>
        {/* Image Section - Top */}
        <div className="relative aspect-[16/9]">
          {post.image ? (
            <Link href={`/${lang}/blog/${post.slug}`}>
              <Image
                src={post.image}
                alt={post.imageAlt || post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300 bg-gray-200"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </Link>
          ) : (
            <div className="w-full h-full bg-muted/30 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Content Section - Bottom */}
        <div className="p-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4 relative">
            {post.tags.slice(0, 5).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs px-2 py-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                {tag}
              </Badge>
            ))}
            {post.tags.length > 5 && (
              <div className="relative">
                <Badge 
                  variant="outline" 
                  className="text-xs px-2 py-1 cursor-pointer  transition-colors"
                  onMouseEnter={() => setShowAllTags(true)}
                  onMouseLeave={() => setShowAllTags(false)}
                >
                  +{post.tags.length - 5}
                </Badge>
                {showAllTags && (
                  <div 
                    className="absolute top-full left-0 mt-2 p-3 bg-popover border rounded-lg shadow-lg z-50 min-w-48"
                    onMouseEnter={() => setShowAllTags(true)}
                    onMouseLeave={() => setShowAllTags(false)}
                  >
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.slice(5, ).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs px-2 py-1 bg-primary/10 text-primary border-primary/20">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Title */}
          <CardTitle className="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
            <Link href={`/${lang}/blog/${post.slug}`} className="hover:underline">
              {post.title}
            </Link>
          </CardTitle>

          {/* Excerpt */}
          <p className="text-muted-foreground mb-6 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border-0 bg-card overflow-hidden ${className}`}>
      {/* Image Section - Top */}
      <div className="relative aspect-[16/9]">
        {post.image ? (
          <Link href={`/${lang}/blog/${post.slug}`}>
            <Image
              src={post.image}
              alt={post.imageAlt || post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300 bg-gray-200"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </Link>
        ) : (
          <div className="w-full h-full bg-muted/30 flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Content Section - Bottom */}
      <CardHeader className="pb-3">
        <div className="flex flex-wrap gap-1.5 mb-3 relative">
          {post.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/20">
              {tag}
            </Badge>
          ))}
          {post.tags.length > 2 && (
            <div className="relative">
              <Badge 
                variant="outline" 
                className="text-xs px-2 py-0.5 cursor-pointer transition-colors"
                onMouseEnter={() => setShowAllTags(true)}
                onMouseLeave={() => setShowAllTags(false)}
              >
                +{post.tags.length - 2}
              </Badge>
              {showAllTags && (
                <div 
                  className="absolute top-full left-0 mt-2 p-3 bg-popover border rounded-lg shadow-lg z-50 min-w-48"
                  onMouseEnter={() => setShowAllTags(true)}
                  onMouseLeave={() => setShowAllTags(false)}
                >
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/20">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors leading-tight">
          <Link href={`/${lang}/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-muted-foreground mb-4 line-clamp-3 text-sm leading-relaxed">
          {post.excerpt}
        </p>
      </CardContent>
    </Card>
  );
} 