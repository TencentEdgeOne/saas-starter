import { Badge } from "@/components/ui/badge";
import { GradientCTA } from "@/components/sections/cta-section";
import { StatsSection } from "@/components/ui/stats-section";
import { Layout } from "@/components/layout/layout";
import { SectionLayout } from "@/components/layout/section-layout";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/i18n";
import { FeaturesClient, HeroFeatures, SupportFeatures } from "./features-client";

// 强制动态渲染，因为需要显示用户认证状态
export const dynamic = 'force-dynamic';

export default async function FeaturesPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const dict = await getDictionary(params.lang);
  
  // Get data from dictionary
  const heroFeatures = dict.shared.heroFeatures;
  const featureCategories = dict.features.page.featureCategories;
  const supportFeatures = dict.features.page.supportFeatures;

  return (
    <Layout  dict={dict}>
      {/* Header Section */}
      <SectionLayout
        variant="narrow"
        padding="large"
        className="px-4"
        badge={dict.features.page.badge}
        title={dict.features.page.title}
        description={dict.features.page.subtitle}
        titleClassName="text-4xl md:text-6xl"
        descriptionClassName="mb-12"
        locale={params.lang}
      >
        {/* Hero Features Grid */}
        <HeroFeatures 
          heroFeatures={heroFeatures}
        />
      </SectionLayout>

      {/* Feature Categories */}
      {featureCategories.map((category, categoryIndex) => (
        <SectionLayout
          key={categoryIndex}
          className="px-4"
          background={categoryIndex % 2 === 1 ? 'muted' : 'default'}
          padding="large"
          badge={category.category}
          title={category.category}
          description={category.description}
          titleClassName="text-3xl md:text-4xl"
          descriptionClassName="max-w-2xl"
          locale={params.lang}
        >
          <FeaturesClient 
            featureCategories={[category]}
          />
        </SectionLayout>
      ))}

      {/* Support Section */}
      <SectionLayout
        className="px-4"
        background="muted"
        padding="large"
        badge={dict.features.page.supportBadge}
        title={dict.features.page.supportTitle}
        description={dict.features.page.supportSubtitle}
        titleClassName="text-3xl md:text-4xl"
        locale={params.lang}
      >
        <SupportFeatures 
          supportFeatures={supportFeatures}
        />
      </SectionLayout>

      {/* Stats Section */}
      <StatsSection
        title={dict.features.page.statsTitle}
        description={dict.features.page.statsDescription}
        variant="default"
        columns={4}
        stats={dict.features.page.stats}
      />

      {/* CTA Section */}
      <GradientCTA
        title={dict.features.page.ctaTitle}
        description={dict.features.page.ctaDescription}
        primaryText={dict.common.buttons.startFreeTrial}
        secondaryText={dict.common.buttons.scheduleDemo}
        className="bg-primary text-white"
      />
    </Layout>
  );
} 