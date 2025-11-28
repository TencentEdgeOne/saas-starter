"use client"

import { usePathname } from "next/navigation"
import { SectionLayout } from "@/components/layout/section-layout"
import { FeaturesGrid } from "@/components/ui/features-grid"

interface FeaturesProps {
  dict?: {
    features: {
      title?: string
      description?: string
      andMoreText?: string
      componentsLinkText?: string
      main: {
        icon: string
        title: string
        description: string
      }[]
    }
  }
}

export function Features({ dict }: FeaturesProps) {
  const features = dict?.features.main || []
  const pathname = usePathname()
  const currentLang = pathname.split("/")[1] || "en"

  // Bottom CTA content
  const bottomContent = dict?.features?.componentsLinkText ? (
    <div className="text-center">
      <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground">
        <span>{dict?.features?.andMoreText || "And much more..."}</span>
        <span className="text-primary">→</span>
        <a
          href={`/${currentLang}/blocks`}
          className="font-medium text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
        >
          {dict?.features?.componentsLinkText ||
            "30+ Components Ready to Use"}
        </a>
      </div>
    </div>
  ) : undefined

  return (
    <SectionLayout
      id="features"
      title={dict?.features?.title}
      description={dict?.features?.description}
      locale={currentLang}
      background="muted"
      bottomContent={bottomContent}
    >
      <FeaturesGrid features={features} />
    </SectionLayout>
  )
}
