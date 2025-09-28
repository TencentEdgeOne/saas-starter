import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/layout";
import { Pricing } from "@/components/ui/pricing";
import { PricingComparison } from "@/components/sections/pricing-comparison";
import { FAQ } from "@/components/sections/faq";
import { MinimalCTA } from "@/components/sections/cta-section";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/i18n";
import { SectionLayout } from "@/components/layout/section-layout";
import { getPricingData } from "@/lib/pricing-server";
import { getServerUser } from "@/lib/auth-server";

// 强制动态渲染，因为需要显示用户认证状态
export const dynamic = 'force-dynamic';

export default async function PricingPage({
  params,
}: {
  params: { lang: Locale };
}) {
  // 服务端获取用户状态
  const { user } = await getServerUser()
  
  const dict = await getDictionary(params.lang);
  const comparison = dict.pricing.comparison;
  
  // 从 Supabase 获取价格数据（带国际化）
  const pricingData = await getPricingData(params.lang);
  
  // Create adapted dictionary for FAQ component
  const faqDict = {
    ...dict,
    faq: {
      title: dict.faq.title,
      description: dict.faq.description,
      faqs: [...dict.pricing.faqs, ...dict.shared.commonFaqs],
      stillHaveQuestions: dict.faq.stillHaveQuestions,
      contactSupport: dict.faq.contactSupport
    }
  };
  return (
    <Layout dict={dict} initialUser={user}>
      {/* Header Section */}
      <section className="pt-32 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4">{dict.pricing.badge}</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {dict.pricing.title.split(' ').map((word, index) => 
              word === 'Business' || word === '业务' ? (
                <span key={index} className="text-primary">{word}</span>
              ) : (
                <span key={index}>{word} </span>
              )
            )}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {dict.pricing.pageSubtitle}
          </p>
        </div>
      </section>
     

      {/* Pricing Section */}
      <Pricing pricingData={pricingData} dict={dict} lang={params.lang} />

      {/* Feature Comparison Table */}
      <PricingComparison 
        comparison={comparison}
        mostPopularText={dict.pricing.mostPopular}
      />

      {/* FAQ Section */}
      <FAQ dict={faqDict} />

      {/* CTA Section */}
      <MinimalCTA
        title={dict.pricing.ctaTitle}
        description={dict.pricing.ctaDescription}
        buttonText={dict.common.buttons.getStartedNow}
        href={`/${params.lang}/signup`}
      />
    </Layout>
  );
} 