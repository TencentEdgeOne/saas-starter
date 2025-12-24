"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Users, ShoppingCart, TrendingUp, DollarSign } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAdminLanguage, adminTexts } from '@/lib/admin-language-context'

interface DashboardStats {
  totalUsers: number
  totalOrders: number
  revenue: number
  growth: number
}

interface RecentUser {
  id: string
  email: string
  created_at: string
}

interface RecentOrder {
  id: string
  user_email: string
  amount: number
  created_at: string
}

export default function AdminDashboard() {
  const { language } = useAdminLanguage()
  const t = adminTexts[language]
  
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrders: 0,
    revenue: 0,
    growth: 0
  })
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
       

        // Get user statistics
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('id, email, created_at')
          .order('created_at', { ascending: false })

        if (usersError) throw usersError

        // Get subscription statistics (as orders)
        const { data: subscriptionsData, error: subscriptionsError } = await supabase
          .from('subscriptions')
          .select(`
            id,
            created_at,
            profiles!inner(email)
          `)
          .order('created_at', { ascending: false })

        if (subscriptionsError) throw subscriptionsError

        // Calculate statistics
        const totalUsers = usersData?.length || 0
        const totalOrders = subscriptionsData?.length || 0
        const revenue = totalOrders * 29.99 // Assume each subscription is $29.99
        const growth = 12.5 // Assume growth rate

        setStats({
          totalUsers,
          totalOrders,
          revenue,
          growth
        })

        // Set recent users (first 5)
        setRecentUsers(
          usersData?.slice(0, 5).map(user => ({
            id: user.id,
            email: user.email,
            created_at: user.created_at
          })) || []
        )

        // Set recent orders (first 5)
        setRecentOrders(
          subscriptionsData?.slice(0, 5).map(sub => ({
            id: sub.id,
            user_email: sub?.profiles[0].email || '',
            amount: 29.99,
            created_at: sub.created_at
          })) || []
        )

      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError(t.error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [t.error])



  const statCards = [
    {
      title: t.totalUsers,
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: t.totalOrders,
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: t.totalRevenue,
      value: `$${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      title: t.growth,
      value: `+${stats.growth}%`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t.dashboard}</h1>
      </div>

     

      {/* Recent data */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Users */}
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">{t.recentUsers}</h2>
            <Link
              href="/admin/users"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              {t.viewAll}
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">{t.recentOrders}</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              {t.viewAll}
            </Link>
          </div>
         
        </div>
      </div>
    </div>
  )
}