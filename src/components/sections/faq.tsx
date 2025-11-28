"use client"

import { usePathname } from 'next/navigation'
import { SectionLayout } from "@/components/layout/section-layout"
import { FAQList } from "@/components/ui/faq-list"

interface FAQProps {
  dict?: {
    faq: {
      title?: string
      description?: string
      faqs: {
        question: string
        answer: string
      }[]
      stillHaveQuestions?: string
      contactSupport?: string
    }
  }
}

export function FAQ({ dict }: FAQProps) {
  const faqs = dict?.faq.faqs || []
  const pathname = usePathname()
  const currentLang = pathname.split('/')[1] || 'en'

  // Bottom CTA content
  const bottomContent = (
        dict?.faq?.stillHaveQuestions && dict?.faq?.contactSupport && <div className="text-center">
          <p className="text-muted-foreground mb-4">
            {dict?.faq?.stillHaveQuestions}
          </p>
          <a
            href="mailto:support@edgeone-saas-starter.com"
            className="text-primary hover:text-primary/80 font-medium"
          >
            {dict?.faq?.contactSupport}
          </a>
        </div>
  )

  return (
    <SectionLayout
      title={dict?.faq?.title}
      description={dict?.faq?.description}
      locale={currentLang}
      variant="narrow"
      bottomContent={bottomContent}
    >
      <FAQList faqs={faqs} />
    </SectionLayout>
  )
} 