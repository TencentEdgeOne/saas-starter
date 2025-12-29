import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createServerClient()
    
    // Call Supabase logout
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Logout error:', error)
      return NextResponse.json(
        { success: false, error: 'Logout failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Admin logout error:', error)
    return NextResponse.json(
      { success: false, error: 'Logout failed, please try again later' },
      { status: 500 }
    )
  }
}