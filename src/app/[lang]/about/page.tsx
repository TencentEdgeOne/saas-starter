import React from 'react'
import { Layout } from '@/components/layout/layout'
import { SectionLayout } from '@/components/layout/section-layout'
import { Users, Target, Lightbulb, Heart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AboutSection } from '@/components/sections/content-section'
import { CompanyStatsI18n } from '@/components/ui/company-stats'
import { Locale } from '@/lib/i18n'
import { getDictionary } from '@/lib/dictionaries'
import Image from 'next/image'

// 强制动态渲染，因为需要显示用户认证状态
export const dynamic = 'force-dynamic'

export default async function AboutPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const dict = await getDictionary(params.lang);

  // Use values data from dictionary
  const values = [
    {
      icon: Target,
      title: dict.about.values[0].title,
      description: dict.about.values[0].description
    },
    {
      icon: Users,
      title: dict.about.values[1].title,
      description: dict.about.values[1].description
    },
    {
      icon: Lightbulb,
      title: dict.about.values[2].title,
      description: dict.about.values[2].description
    },
    {
      icon: Heart,
      title: dict.about.values[3].title,
      description: dict.about.values[3].description
    }
  ]

  // Use team data from dictionary
  const team = dict.about.team;

  return (
    <Layout dict={dict}>
      <div className="pt-24">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-responsive-xl font-bold text-foreground mb-6">
              {dict.about.heroTitle}{' '}
              <span className="text-primary">{dict.about.heroHighlight}</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {dict.about.pageSubtitle}
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="section-padding bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <AboutSection title={dict.about.storyTitle}>
              {dict.about.storyContent.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </AboutSection>
          </div>
        </section>

        {/* Values Section */}
        <SectionLayout
          title={dict.about.valuesTitle}
          description={dict.about.valuesSubtitle}
          containerClassName="max-w-6xl"
          locale={params.lang}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center border-0 shadow-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </SectionLayout>

        {/* Team Section */}
        <SectionLayout
          title={dict.about.teamTitle}
          description={dict.about.teamSubtitle}
          background="muted"
          containerClassName="max-w-6xl"
          locale={params.lang}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center border-0 shadow-sm">
                <CardHeader>
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl overflow-hidden">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full rounded-full"
                      priority={index < 2}
                      loading={index < 2 ? undefined : 'lazy'}
                    />
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <p className="text-primary font-medium">{member.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </SectionLayout>

        {/* Stats Section */}
        <CompanyStatsI18n stats={dict.shared.companyStats} />
      </div>
    </Layout>
  )
} 