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
import { getServerUser } from "@/lib/auth-server";


export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  // 服务端获取用户状态
  const { user } = await getServerUser() 

  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  // 从 Supabase 获取价格数据（带国际化）
  const pricingData = await getPricingData(lang);

  return (
    <Layout dict={dict} initialUser={user}>
      <Hero dict={dict} lang={lang} />
      <Features dict={dict} />
      {/*Pricing Section*/}
      <SectionLayout
        id="pricing"
        title={dict?.pricing?.title || "Simple, Transparent Pricing"}
        description={dict?.pricing?.description}
        locale={lang}
      >
        <Pricing pricingData={pricingData} dict={dict} lang={lang} />
      </SectionLayout>
      <Testimonials dict={dict} lang={lang} />
      <FAQ dict={dict} />
      <CTASection
        variant="gradient"
        title={dict.home.bottomCta.title}
        description={dict.home.bottomCta.description}
        buttons={[
          {
            text: dict.common.buttons.getStartedNow,
            variant: "secondary",
            href: `/${lang}/signup`,
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