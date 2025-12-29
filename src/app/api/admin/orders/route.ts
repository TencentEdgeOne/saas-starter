export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseAdminClient()
    
    // Get parameters from request body
    const body = await request.json()
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'created',
      sortOrder = 'desc',
      statusFilter = ''
    } = body
    
    
    // Handle search filter first
    let matchingUserIds: string[] = []
    if (search) {
      // First search user IDs by email
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1000
      })
      
      if (!authError && authUsers.users) {
        matchingUserIds = authUsers.users
          .filter(user => user.email?.toLowerCase().includes(search.toLowerCase()))
          .map(user => user.id)
        
        if (matchingUserIds.length === 0) {
          // If no matching users, return empty result
          return NextResponse.json({
            orders: [],
            pagination: {
              page,
              limit,
              total: 0,
              totalPages: 0
            }
          })
        }
      }
    }

   
    
    
    // Build data query
    let dataQuery = supabase
      .from('subscriptions')
      .select(`
        id,
        user_id,
        status,
        created,
        ended_at,
        price_id,
        quantity,
        cancel_at_period_end,
        current_period_start,
        current_period_end,
        prices!inner(
          id,
          product_id,
          unit_amount,
          currency,
          interval,
          products!inner(
            id,
            name,
            description
          )
        )
      `)
    
    // Apply same filters to data query
    if (statusFilter) {
      dataQuery = dataQuery.eq('status', statusFilter)
    }
    if (search && matchingUserIds.length > 0) {
      dataQuery = dataQuery.in('user_id', matchingUserIds)
    }
    
    // Apply sorting
    const validSortFields = ['created', 'status', 'ended_at']
    if (validSortFields.includes(sortBy)) {
      dataQuery = dataQuery.order(sortBy, { ascending: sortOrder === 'asc' })
    } else {
      dataQuery = dataQuery.order('created', { ascending: false })
    }
    

    dataQuery = dataQuery.range(0, 1000)
    const { data: allSubscriptions}  =await dataQuery
    const count = allSubscriptions?.length || 0;

    // Apply pagination
    const offset = (page - 1) * limit
    dataQuery = dataQuery.range(offset, offset + limit - 1)
    
    const { data: subscriptions, error: subscriptionsError } = await dataQuery
    

    if (subscriptionsError) {
      console.error('Error fetching subscriptions:', subscriptionsError)
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      )
    }
    
    // Get user email information
    const userIds = subscriptions?.map((sub: any) => sub.user_id) || []
    let userEmailMap = new Map<string, string>()
    
    if (userIds.length > 0) {
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1000
      })
      
      if (!authError && authUsers.users) {
        authUsers.users.forEach(user => {
          if (userIds.includes(user.id)) {
            userEmailMap.set(user.id, user.email || 'Unknown')
          }
        })
      }
    }
    
    // Format order data
    const formattedOrders = (subscriptions || []).map((subscription: any) => ({
      id: subscription.id,
      user_id: subscription.user_id,
      user_email: userEmailMap.get(subscription.user_id) || 'Unknown',
      status: subscription.status,
      created_at: subscription.created,
      ended_at: subscription.ended_at,
      product_name: subscription.prices?.products?.name || 'Unknown Product',
      price_amount: subscription.prices?.unit_amount || 0,
      currency: subscription.prices?.currency || 'usd',
      interval: subscription.prices?.interval || null,
      quantity: subscription.quantity || 1,
      cancel_at_period_end: subscription.cancel_at_period_end || false,
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end
    }))
    
    console.log('Orders API Response:', {
      ordersCount: formattedOrders.length,
      totalCount: count,
      page,
      limit,
      hasSearch: !!search,
      hasStatusFilter: !!statusFilter
    })
    
    return NextResponse.json({
      orders: formattedOrders,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
    
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}