import { Layout } from '@/components/layout/layout';
import { ContactForm } from '@/components/ui/contact-form';
import { MinimalCTA } from '@/components/sections/cta-section';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare
} from 'lucide-react';
import { getDictionary } from '@/lib/dictionaries';
import { Locale, locales } from '@/lib/i18n';

// 完全静态生成，内容在构建时预渲染
export const dynamic = 'force-static';

export async function generateStaticParams() {
  return locales.map((locale) => ({
    lang: locale
  }));
}

interface ContactPageProps {
  params: {
    lang: Locale;
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const dict = await getDictionary(params.lang);

  const contactInfo = [
    {
      icon: Mail,
      title: dict.contact.info.email.title,
      description: dict.contact.info.email.description,
      value: 'hello@edgeone-saas-starter.com',
      action: 'mailto:hello@edgeone-saas-starter.com'
    },
    {
      icon: Phone,
      title: dict.contact.info.phone.title,
      description: dict.contact.info.phone.description,
      value: '+1 (555) 123-4567',
      action: 'tel:+15551234567'
    },
    {
      icon: MapPin,
      title: dict.contact.info.address.title,
      description: dict.contact.info.address.description,
      value: '123 Business St, San Francisco, CA 94105',
      action: 'https://maps.google.com'
    },
    {
      icon: Clock,
      title: dict.contact.info.hours.title,
      description: dict.contact.info.hours.description,
      value: 'Mon-Fri: 8am-6pm PST',
      action: null
    }
  ];

  return (
    <Layout dict={dict}>
      <div className="pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center rounded-full px-4 py-2 text-sm bg-primary/10 text-primary border border-primary/20 mb-8">
              <MessageSquare className="w-4 h-4 mr-2" />
              💬 {dict.contact.getInTouch}
            </div>
            <h1 className="text-responsive-xl font-bold text-foreground mb-6">
              {dict.contact.pageTitle}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {dict.contact.pageSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <ContactForm 
                variant="minimal"
                subjects={dict.shared.formSubjects}
                dict={dict}
              />
            </div>

            {/* Contact Information */}
            <div>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-6">{dict.contact.getInTouch}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {dict.contact.description}
                  </p>
                </div>

                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <info.icon className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">{info.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{info.description}</p>
                        {info.action ? (
                          <a 
                            href={info.action}
                            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-sm font-medium text-foreground">{info.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                
               
              </div>
            </div>
          </div>

          
        </div>
      </div>
      {/* Bottom CTA */}
      <MinimalCTA
        title={dict.contact.bottomCta.title}
        description={dict.contact.bottomCta.description}
        buttonText={dict.common.buttons.getStarted}
        className="mt-24"
        dict={dict}
      />
    </Layout>
  );
} 