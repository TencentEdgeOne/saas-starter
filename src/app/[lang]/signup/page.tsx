import { getDictionary } from '@/lib/dictionaries'
import { Locale } from '@/lib/i18n'
import { Layout } from '@/components/layout/layout'
import SignupForm from './signup-form'
import { getServerUser } from '@/lib/auth-server'
import { redirect } from 'next/navigation'

interface SignupPageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang)
  return {
    title: dict.auth?.signup?.title || 'Sign Up',
    description: dict.auth?.signup?.subtitle || 'Create your account',
  }
}

export default async function SignupPage({ params }: SignupPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang)

  // Check if the user is already logged in
  const { user } = await getServerUser()
  if (user) {
    // If already logged in, redirect to the profile page
    redirect(`/${lang}/profile`)
  }

  return (
    <Layout dict={dict}>
      <div className="flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {dict.auth?.signup?.title || 'Create your account'}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {dict.auth?.signup?.subtitle || 'Join us today and get started with your journey.'}
            </p>
          </div>
          <SignupForm dict={dict} lang={lang} />
        </div>
      </div>
    </Layout>
  )
}
