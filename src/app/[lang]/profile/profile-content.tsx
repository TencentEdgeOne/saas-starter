"use client"

import React, {  useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { getSubscriptions } from '@/lib/auth'
import { Subscription } from '@/types/subscription'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, User, Mail, Calendar, CreditCard, DollarSign, Settings, LogOut, Coins } from 'lucide-react'
import { Dictionary } from '@/lib/dictionaries'
import { formatDate } from '@/lib/utils'
import { CREDITS_CONFIG } from '@/lib/credits'

interface ProfileContentProps {
  dict?: Dictionary
  lang?: string
}

export function ProfileContent({ dict, lang }: ProfileContentProps) {
  const { user, loading: authLoading, signOut } = useAuth()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(true)
  const [subscriptionsError, setSubscriptionsError] = useState<string | null>(null)
  const [creditsBalance, setCreditsBalance] = useState<number>(0)
  const [creditsLoading, setCreditsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      const fetchSubscriptions = async () => {
        try {
          setSubscriptionsLoading(true)
          const { subscriptions, error } = await getSubscriptions()
          
          if (error) {
            setSubscriptionsError(error)
          } else {
            setSubscriptions(subscriptions || [])
          }
        } catch (err) {
          setSubscriptionsError('Failed to fetch subscriptions')
        } finally {
          setSubscriptionsLoading(false)
        }
      }

      const fetchCreditsBalance = async () => {
        try {
          setCreditsLoading(true)
          const response = await fetch('/api/credits/balance')
          
          if (response.ok) {
            const data = await response.json()
            setCreditsBalance(data.balance || 0)
          } else {
            setCreditsBalance(0)
          }
        } catch (err) {
          console.error('Failed to fetch credits balance:', err)
          setCreditsBalance(0)
        } finally {
          setCreditsLoading(false)
        }
      }
      fetchSubscriptions()
      fetchCreditsBalance()
    }
  }, [user])

  if (authLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">{dict?.profile?.loading || 'Loading profile...'}</span>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold mb-2">{dict?.profile?.notLoggedIn || 'Not Logged In'}</h3>
        <p className="text-gray-600 mb-4">{dict?.profile?.pleaseSignIn || 'Please sign in to view your profile.'}</p>
        <Link 
          href={`/${lang}/login`}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          {dict?.auth?.login?.signInButton || 'Sign In'}
        </Link>
      </div>
    )
  }

  const getSubscriptionCredits = (subscription: Subscription) => {
    const curPlan = subscription.prices?.products?.name?.toLowerCase() || ''
    const creditsCount = CREDITS_CONFIG.PURCHASE_BONUS[curPlan as keyof typeof CREDITS_CONFIG.PURCHASE_BONUS] || 0

    return `${dict?.profile?.subscriptionSuccess || 'Subscription successful, earned'} ${creditsCount} ${dict?.profile?.creditsReward || 'credits'}`
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* User Profile Information Section */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>{dict?.profile?.personalInfo || 'Personal Information'}</span>
            </CardTitle>
            <CardDescription>
              {dict?.profile?.personalInfoDescription || 'Your account details and preferences'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">{dict?.profile?.email || 'Email'}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">{dict?.profile?.memberSince || 'Member Since'}</p>
                <p className="text-sm text-gray-600">
                  {formatDate(user.created_at)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Coins className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">{dict?.profile?.creditsBalance ||'Credits Balance'}</p>
                <p className="text-sm text-gray-600">
                  {creditsLoading ? (
                    <Loader2 className="h-4 w-4 inline animate-spin" />
                  ) : (
                    creditsBalance
                  )}
                </p>
              </div>
            </div>

            {/* Edit Profile Button - Disabled for now */}
            {/* <div className="pt-4 border-t">
              <Button variant="outline" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                {dict?.profile?.editProfile || 'Edit Profile'}
              </Button>
            </div> */}
          </CardContent>
        </Card>
      </div>

      {/* User Subscriptions Management Section */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>{dict?.profile?.subscriptions || 'Subscriptions'}</span>
            </CardTitle>
            <CardDescription>
              {dict?.profile?.subscriptionsDescription || 'Manage your active subscriptions and billing'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {subscriptionsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">{dict?.profile?.loadingSubscriptions || 'Loading subscriptions...'}</span>
              </div>
            ) : subscriptionsError ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">{dict?.profile?.subscriptionsError || 'Error'}: {subscriptionsError}</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  {dict?.profile?.tryAgain || 'Try Again'}
                </Button>
              </div>
            ) : subscriptions.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">{dict?.profile?.noSubscriptions || 'No Active Subscriptions'}</h3>
                <p className="text-gray-600 mb-4">{dict?.profile?.noSubscriptionsDescription || 'You don\'t have any active subscriptions yet.'}</p>
                <Link 
                  href={`/${lang}/pricing`}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  {dict?.profile?.browsePlans || 'Browse Plans'}
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {subscriptions.map((subscription) => (
                  <div key={subscription.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">
                        {subscription.prices?.products?.name || 'Unknown Product'}
                      </h4>
                      <Badge 
                        variant={
                          subscription.status === 'active' ? 'default' : 
                          subscription.status === 'trialing' ? 'secondary' : 
                          'destructive'
                        }
                      >
                        {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                    {getSubscriptionCredits(subscription)}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="text-lg font-semibold">
                          {(subscription.prices?.unit_amount || 0) / 100}
                        </span>
                        <span className="text-gray-500">
                          /{subscription.prices?.interval || 'month'}
                        </span>
                      </div>
                    
                    </div>
                    
                    {subscription.trial_end && (
                      <div className="mt-3 bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800">
                          {dict?.profile?.trialEnds || 'Trial ends'}: {formatDate(subscription.trial_end)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
