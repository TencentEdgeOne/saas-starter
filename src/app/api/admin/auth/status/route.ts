import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseAdminClient } from '@/lib/supabase'

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
      return NextResponse.json({
        isAdmin: false,
        isLoggedIn: false,
        hasAccount: false
      })
    }

    const token = authHeader.substring(7) // Remove "Bearer " prefix

    // Verify user identity
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) {
      return NextResponse.json({
        isAdmin: false,
        isLoggedIn: false,
        hasAccount: false
      })
    }

    // Create admin client (bypass RLS)
    const supabaseAdmin = createSupabaseAdminClient()
    // Check if user has customer record
    const { data: customerData, error: customerError } = await supabaseAdmin
      .from('customers')
      .select('id, role')
      .eq('id', user.id)
      .single()

    if (customerError || !customerData) {
      return NextResponse.json({
        isAdmin: false,
        isLoggedIn: true,
        hasAccount: false
      })
    }

    // Check if user is admin
    if (customerData.role === 'admin') {
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