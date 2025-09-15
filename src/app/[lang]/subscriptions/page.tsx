import { Metadata } from 'next'
import { SubscriptionList } from '@/components/subscription-list'
import { getDictionary } from '@/lib/dictionaries'
import { Locale } from '@/lib/i18n'

interface SubscriptionsPageProps {
  params: {
    lang: Locale
  }
}

export async function generateMetadata({
  params,
}: SubscriptionsPageProps): Promise<Metadata> {
  const dict = await getDictionary(params.lang)
  
  return {
    title: dict?.subscriptions?.title || 'Subscriptions',
    description: dict?.subscriptions?.description || 'Manage your subscriptions',
  }
}

export default async function SubscriptionsPage({
  params,
}: SubscriptionsPageProps) {
  const dict = await getDictionary(params.lang)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {dict?.subscriptions?.title || 'Subscriptions'}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {dict?.subscriptions?.description || 'Manage your active subscriptions and billing information.'}
          </p>
        </div>
        
        <SubscriptionList dict={dict} />
      </div>
    </div>
  )
}
