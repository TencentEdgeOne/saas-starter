import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/layout";
import { Pricing } from "@/components/ui/pricing";
import { PricingComparison } from "@/components/sections/pricing-comparison";
import { FAQ } from "@/components/sections/faq";
import { MinimalCTA } from "@/components/sections/cta-section";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/i18n";
import { getPricingData } from "@/lib/pricing-server";

export const dynamic = 'force-static';

export default async function PricingPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {

  const { lang } = await params;
  const dict = await getDictionary(lang);
  const comparison = dict.pricing.comparison;
  
  const pricingData = await getPricingData(lang);
  
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
    <Layout dict={dict}>
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
      <Pricing pricingData={pricingData} dict={dict} lang={lang} />

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
        href={`/${lang}/signup`}
      />
    </Layout>
  );
} 