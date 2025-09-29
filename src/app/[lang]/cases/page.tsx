import React from 'react'
import { Layout } from '@/components/layout/layout'
import { CaseShowcaseGrid } from '@/components/ui/case-showcase-grid'
import { CTASection } from '@/components/sections/cta-section'

import { getAllCases } from '@/lib/cases'
import { Locale } from '@/lib/i18n'
import { getDictionary } from '@/lib/dictionaries'
import { ExternalLink, Plus } from 'lucide-react'

// export const dynamic = 'force-dynamic'

export default async function CasesPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const cases = getAllCases(lang)
  const dict = await getDictionary(lang);

  return (
    <Layout dict={dict}>
      <div className="pt-24">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-responsive-xl font-bold text-foreground mb-6">
              {dict.cases.heroTitle}{' '}
              <span className="text-primary">{dict.cases.heroHighlight}</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {dict.cases.pageSubtitle}
            </p>
          </div>
        </section>

        {/* Showcase Grid */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CaseShowcaseGrid cases={cases} lang={lang} dict={dict} />
          </div>
        </section>

        {/* Submit Your Project Section */}
        <section className="section-padding border-t">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-primary/5 rounded-lg p-8 border border-primary/10">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 rounded-full p-3">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {dict.cases.shareYourStory}
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                {dict.cases.shareSubtitle}
              </p>
              <a
                href="mailto:hello@edgeone-saas-starter.com?subject=Submit My Success Story"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                {dict.cases.submitYourCase}
              </a>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CTASection
          title={dict.cases.ctaTitle}
          description={dict.cases.ctaSubtitle}
          variant="minimal"
          buttons={[
            {
              text: dict.common.buttons.getStartedToday,
              href: "#pricing",
              variant: "default",
              size: "lg"
            },
            {
              text: dict.cases.discussYourProject,
              href: "/contact",
              variant: "outline",
              size: "lg"
            }
          ]}
        />
      </div>
    </Layout>
  )
} 