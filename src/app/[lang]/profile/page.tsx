import { Metadata } from 'next'
import { ProfileContent } from './profile-content'
import { Layout } from '@/components/layout/layout'
import { getDictionary } from '@/lib/dictionaries'
import { Locale } from '@/lib/i18n'

interface ProfilePageProps {
  params: Promise<{
    lang: Locale
  }>;
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang)
  
  return {
    title: dict?.profile?.title || 'Profile',
    description: dict?.profile?.description || 'Manage your profile and subscriptions',
  }
}

export default async function ProfilePage({
  params,
}: ProfilePageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang)

  return (
    <Layout dict={dict}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {dict?.profile?.title || 'Profile'}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {dict?.profile?.description || 'Manage your profile and subscription information.'}
          </p>
        </div>
        
        <ProfileContent dict={dict} lang={lang} />
      </div>
    </Layout>
  )
}
