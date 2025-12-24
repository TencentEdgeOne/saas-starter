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
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = body
    
    // Use Supabase Auth Admin API to get user list
    // Note: listUsers pagination parameters may have limitations, we need to get more data then manually paginate
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000 // Get more users, then manually handle pagination and search
    })
    
    if (authError) {
      console.error('Error fetching users from auth:', authError)
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      )
    }
    
    let users = authData.users || []
    
    // Apply search filter
    if (search) {
      users = users.filter(user => 
        user.email?.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    // Apply sorting
    const validSortFields = ['created_at', 'email', 'last_sign_in_at', 'updated_at']
    if (validSortFields.includes(sortBy)) {
      users.sort((a, b) => {
        let aValue: any, bValue: any
        
        switch (sortBy) {
          case 'email':
            aValue = a.email || ''
            bValue = b.email || ''
            break
          case 'created_at':
            aValue = new Date(a.created_at || 0)
            bValue = new Date(b.created_at || 0)
            break
          case 'last_sign_in_at':
            aValue = new Date(a.last_sign_in_at || 0)
            bValue = new Date(b.last_sign_in_at || 0)
            break
          case 'updated_at':
            aValue = new Date(a.updated_at || 0)
            bValue = new Date(b.updated_at || 0)
            break
          default:
            aValue = a.created_at
            bValue = b.created_at
        }
        
        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })
    }
    
    // Calculate total count
    const total = users.length
    
    // Manual pagination
    const offset = (page - 1) * limit
    const paginatedUsers = users.slice(offset, offset + limit)
    
    // Get user credits and role information
    const userIds = paginatedUsers.map(user => user.id)
    let creditsData: any[] = []
    let customersData: any[] = []
    
    if (userIds.length > 0) {
      // Get credits information
      const { data: credits, error: creditsError } = await supabase
        .from('user_credits_balance')
        .select('user_id, balance')
        .in('user_id', userIds)
      
      if (creditsError) {
        console.error('Error fetching credits:', creditsError)
        // Don't block user query, just log error
      } else {
        creditsData = credits || []
      }
      
      // Get user role information
      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select('id, role')
        .in('id', userIds)
      
      if (customersError) {
        console.error('Error fetching customers:', customersError)
        // Don't block user query, just log error
      } else {
        customersData = customers || []
      }
    }
    
    // Format data, merge user, credits and role information
    const formattedUsers = paginatedUsers.map(user => {
      const userCredits = creditsData.find(c => c.user_id === user.id)
      const userCustomer = customersData.find(c => c.id === user.id)
      return {
        id: user.id,
        email: user.email || '',
        created_at: user.created_at,
        updated_at: user.updated_at,
        last_sign_in_at: user.last_sign_in_at,
        email_confirmed_at: user.email_confirmed_at,
        role: userCustomer?.role || 'user', // Default to regular user
        credits: {
          balance: userCredits?.balance || 0,
          total_earned: 0, // This requires additional query calculation
          total_spent: 0   // This requires additional query calculation
        }
      }
    })
    
    return NextResponse.json({
      users: formattedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
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