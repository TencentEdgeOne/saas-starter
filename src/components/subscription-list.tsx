"use client"

import React, { useEffect, useState } from 'react'
import { getSubscriptions } from '@/lib/auth'
import { Subscription } from '@/types/subscription'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, CreditCard, Calendar, DollarSign } from 'lucide-react'
import { Dictionary } from '@/lib/dictionaries'

interface SubscriptionListProps {
  dict?: Dictionary
}

export function SubscriptionList({ dict }: SubscriptionListProps) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true)
        const { subscriptions, error } = await getSubscriptions()
        
        if (error) {
          setError(error)
        } else {
          setSubscriptions(subscriptions || [])
        }
      } catch (err) {
        setError('Failed to fetch subscriptions')
      } finally {
        setLoading(false)
      }
    }

    fetchSubscriptions()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">{dict?.subscriptions?.loading || 'Loading subscriptions...'}</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">{dict?.subscriptions?.error || 'Error'}: {error}</p>
        <Button onClick={() => window.location.reload()}>
          {dict?.subscriptions?.tryAgain || 'Try Again'}
        </Button>
      </div>
    )
  }

  if (subscriptions.length === 0) {
    return (
      <div className="p-8 text-center">
        <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold mb-2">{dict?.subscriptions?.noSubscriptions || 'No Active Subscriptions'}</h3>
        <p className="text-gray-600 mb-4">{dict?.subscriptions?.noSubscriptionsDescription || 'You don\'t have any active subscriptions yet.'}</p>
        <Button>{dict?.subscriptions?.browsePlans || 'Browse Plans'}</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Subscriptions</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subscriptions.map((subscription) => (
          <Card key={subscription.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {subscription.prices?.products?.name || 'Unknown Product'}
                </CardTitle>
                <Badge 
                  variant={
                    subscription.status === 'active' ? 'default' : 
                    subscription.status === 'trialing' ? 'secondary' : 
                    'destructive'
                  }
                >
                  {subscription.status}
                </Badge>
              </div>
              <CardDescription>
                {subscription.prices?.products?.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span className="text-2xl font-bold">
                  ${(subscription.prices?.unit_amount || 0) / 100}
                </span>
                <span className="text-gray-500">
                  /{subscription.prices?.interval || 'month'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {dict?.subscriptions?.nextBilling || 'Next billing'}: {new Date(subscription.current_period_end).toLocaleDateString()}
                </span>
              </div>
              
              {subscription.trial_end && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    {dict?.subscriptions?.trialEnds || 'Trial ends'}: {new Date(subscription.trial_end).toLocaleDateString()}
                  </p>
                </div>
              )}
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  {dict?.subscriptions?.manage || 'Manage'}
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  {dict?.subscriptions?.cancel || 'Cancel'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
