import { getDictionary } from '@/lib/dictionaries'
import { Locale } from '@/lib/i18n'
import { Layout } from '@/components/layout/layout'
import LoginForm from './login-form'
import { getServerUser } from '@/lib/auth-server'
import { redirect } from 'next/navigation'

interface LoginPageProps {
  params: { lang: Locale }
}

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale }
}) {
  const dict = await getDictionary(params.lang)
  return {
    title: dict.auth?.login?.title || 'Sign In',
    description: dict.auth?.login?.subtitle || 'Sign in to your account',
  }
}

export default async function LoginPage({ params }: LoginPageProps) {
  const dict = await getDictionary(params.lang)

  // Check if the user is already logged in
  const { user } = await getServerUser()
  if (user) {
    // If already logged in, redirect to the profile page
    redirect(`/${params.lang}/profile`)
  }

  return (
    <Layout dict={dict}>
      <div className="flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {dict.auth?.login?.title || 'Sign in to your account'}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {dict.auth?.login?.subtitle || 'Welcome back! Please sign in to continue.'}
            </p>
          </div>
          <LoginForm dict={dict} />
        </div>
      </div>
    </Layout>
  )
}
