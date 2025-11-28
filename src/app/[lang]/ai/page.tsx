import React from 'react'
import { Layout } from '@/components/layout/layout'
import { SectionLayout } from '@/components/layout/section-layout'
import { getDictionary } from '@/lib/dictionaries'
import { Locale, locales } from '@/lib/i18n'
import { Sparkles } from 'lucide-react'
import { AIImageGenerator } from './ai-image-generator'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return locales.map((locale) => ({
    lang: locale
  }));
}

export default async function AIPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const aiConfig = dict.ai;

  // Merge generator config with additional fields from dict
  const generatorConfig = {
    ...aiConfig.generator,
    checkingCredits: aiConfig.generator.checkingCredits,
    credits: aiConfig.generator.credits,
    cost: aiConfig.generator.cost,
    creditsUnavailable: aiConfig.generator.creditsUnavailable,
    notEnoughCredits: aiConfig.generator.notEnoughCredits,
    pleaseSignIn: aiConfig.generator.pleaseSignIn,
    unableToFetchCredits: aiConfig.generator.unableToFetchCredits,
    unableToFetchCost: aiConfig.generator.unableToFetchCost,
    failedToFetchCost: aiConfig.generator.failedToFetchCost,
    imageGenerationTimeout: aiConfig.generator.imageGenerationTimeout,
    modelNotConfigured: aiConfig.generator.modelNotConfigured,
  };

  return (
    <Layout dict={dict}>
      <div className="pt-8">
        {/* Hero Section */}
        <SectionLayout
          className="px-4"
          padding="small"
          title={aiConfig.generator.title}
          description={aiConfig.generator.description}
          titleClassName="text-3xl md:text-4xl"
          descriptionClassName="max-w-3xl"
          headerClassName="mb-16"
          locale={lang}
        >
          <AIImageGenerator config={generatorConfig} />
        </SectionLayout>
      </div>
    </Layout>
  )
}

