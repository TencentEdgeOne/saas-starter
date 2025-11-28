"use client";

import Link from "next/link";
import Image from "next/image";
import { ExternalLink, ArrowRight } from "lucide-react";

import type { CaseShowcaseItem } from '@/types/cases'
export type { CaseShowcaseItem }

interface CaseShowcaseGridProps {
  cases: CaseShowcaseItem[];
  lang?: string;
  dict?: any;
}

export function CaseShowcaseGrid({ cases, lang = "en", dict }: CaseShowcaseGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {cases.map((caseItem) => (
        <a
          key={caseItem.slug}
          href={caseItem.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group block bg-card rounded-lg border hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 overflow-hidden"
        >
          {/* Image Section */}
          <div className="relative aspect-[4/3] bg-muted">
            {caseItem.image ? (
              <Image
                src={caseItem.image}
                alt={caseItem.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20">
                <div className="text-primary/60 text-2xl font-bold">
                  {caseItem.title.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
            
            {/* External Link Icon */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-1.5">
                <ExternalLink className="w-3 h-3 text-gray-600" />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-3">
            {/* Title */}
            <h3 className="font-medium text-foreground mb-1 line-clamp-2 text-sm group-hover:text-primary transition-colors">
              {caseItem.title}
            </h3>

            {/* Description */}
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {caseItem.description}
            </p>

            {/* Tags */}
            {caseItem.tags && caseItem.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {caseItem.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded"
                  >
                    {tag}
                  </span>
                ))}
                {caseItem.tags.length > 2 && (
                  <span className="px-1.5 py-0.5 text-xs bg-muted text-muted-foreground rounded">
                    +{caseItem.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </a>
      ))}
    </div>
  );
}

// Add submit case CTA card
export function SubmitCaseCTA({ lang = "en", dict }: { lang?: string; dict?: any }) {
  return (
    <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border-2 border-dashed border-primary/30 p-8 text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <ExternalLink className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {dict?.cases?.shareYourStory || "Share Your Success Story"}
      </h3>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
        {dict?.cases?.shareSubtitle || "Have a project you'd like to showcase? We'd love to feature your success story."}
      </p>
      <Link
        href={`/${lang}/contact`}
        className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
      >
        {dict?.cases?.submitYourCase || "Submit Your Case"}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Link>
    </div>
  );
} 