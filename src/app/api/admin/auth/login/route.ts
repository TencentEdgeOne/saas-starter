import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { isAdminEmail } from '@/lib/admin-utils'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // 1. Check if email is in admin list first
    if (!isAdminEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to access the admin panel' },
        { status: 401 }
      )
    }

    // 2. Try to login to validate password
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError || !authData.user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // 3. Return success response and user information
    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: 'admin'
      },
      session: authData.session
    })

  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { success: false, error: 'Login failed, please try again later' },
      { status: 500 }
    )
  }
}