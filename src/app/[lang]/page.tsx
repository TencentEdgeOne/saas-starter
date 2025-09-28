import { Layout } from "@/components/layout/layout";
import { SectionLayout } from "@/components/layout/section-layout";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { Pricing } from "@/components/ui/pricing";
import { Testimonials } from "@/components/sections/testimonials";
import { FAQ } from "@/components/sections/faq";
// import { ArrowRight, Sparkles } from "lucide-react";
import { CTASection } from "@/components/sections/cta-section";
import { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { getPricingData } from "@/lib/pricing-server";

// 强制动态渲染，因为需要显示用户认证状态
export const dynamic = 'force-dynamic';

export default async function HomePage({
  params,
}: {
  params: { lang: Locale };
}) {
  const dict = await getDictionary(params.lang);
  
  // 从 Supabase 获取价格数据（带国际化）
  const pricingData = await getPricingData(params.lang);

  return (
    <Layout dict={dict}>
      <Hero dict={dict} params={params} />
      <Features dict={dict} />
      {/*Pricing Section*/}
      <SectionLayout
        id="pricing"
        title={dict?.pricing?.title || "Simple, Transparent Pricing"}
        description={dict?.pricing?.description}
        locale={params.lang}
      >
        <Pricing pricingData={pricingData} dict={dict} lang={params.lang} />
      </SectionLayout>
      <Testimonials dict={dict} params={params} />
      <FAQ dict={dict} />
      <CTASection
        variant="gradient"
        title={dict.home.bottomCta.title}
        description={dict.home.bottomCta.description}
        buttons={[
          {
            text: dict.common.buttons.getStartedNow,
            variant: "secondary",
            href: `/${params.lang}/signup`,
          },
          {
            text: dict.common.buttons.viewDocumentation,
            variant: "secondary",
            href: dict.common.buttons.documentationUrl,
          },
        ]}
        trustIndicators={dict.home.bottomCta.trustIndicators?.map(text => ({ text }))}
        maxWidth="4xl"
      />
    </Layout>
  );
} 