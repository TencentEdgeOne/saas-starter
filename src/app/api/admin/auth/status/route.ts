export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isAdminEmail } from '@/lib/admin-utils'

// Create client with anonymous key (for validating user sessions)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    
    // Get Authorization token from request headers
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid auth header found')
      return NextResponse.json({
        isAdmin: false,
        isLoggedIn: false,
        hasAccount: false,
      })
    }

    const token = authHeader.substring(7) // Remove "Bearer " prefix
    console.log('Token extracted, length:', token.length)
    
    // Verify user identity
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user || !user.email) {
      return NextResponse.json({
        isAdmin: false,
        isLoggedIn: false,
        hasAccount: false
      })
    }

    // Check if user email is in admin list
    if (isAdminEmail(user.email)) {
      return NextResponse.json({
        isAdmin: true,
        isLoggedIn: true,
        hasAccount: true,
        user: {
          id: user.id,
          email: user.email,
          role: 'admin'
        }
      })
    }

    // Logged in but not admin
    return NextResponse.json({
      isAdmin: false,
      isLoggedIn: true,
      hasAccount: true
    })

  } catch (error) {
    console.error('Admin status check error:', error)
    return NextResponse.json({
      isAdmin: false,
      isLoggedIn: false,
      hasAccount: false
    })
  }
}