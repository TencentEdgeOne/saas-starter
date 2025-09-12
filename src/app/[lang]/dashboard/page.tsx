import { getDictionary } from '@/lib/dictionaries'
import { Locale } from '@/lib/i18n'
import ProtectedRoute from '@/components/auth/protected-route'
import DashboardContent from './dashboard-content'

interface DashboardPageProps {
  params: { lang: Locale }
}

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale }
}) {
  const dict = await getDictionary(params.lang)
  return {
    title: dict.auth?.user?.dashboard || 'Dashboard',
    description: 'User dashboard and account management',
  }
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const dict = await getDictionary(params.lang)

  return (
    <ProtectedRoute>
      <DashboardContent dict={dict} />
    </ProtectedRoute>
  )
}
