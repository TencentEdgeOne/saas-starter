import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseAdminClient()
    const { id, role } = await request.json()
    
    // 验证必需参数
    if (!id || !role) {
      return NextResponse.json(
        { error: 'Missing required parameters: id and role' },
        { status: 400 }
      )
    }
    
    // 验证角色参数
    if (!['user', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be "user" or "admin"' },
        { status: 400 }
      )
    }
    
    // 首先检查用户是否存在
    const { data: authUser, error: userError } = await supabase.auth.admin.getUserById(id)
    
    if (userError) {
      console.error('Error fetching user:', userError)
      return NextResponse.json(
        { error: 'Failed to fetch user' },
        { status: 500 }
      )
    }
    
    if (!authUser.user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // 检查用户当前角色
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('role')
      .eq('id', id)
      .single()
    
    if (existingCustomer?.role === role) {
      return NextResponse.json(
        { error: `User is already a ${role}` },
        { status: 400 }
      )
    }
    
    // 更新用户角色
    const { error: updateError } = await supabase
      .from('customers')
      .upsert({
        id: id,
        role: role,
      })
    
    if (updateError) {
      console.error('Error updating user role:', updateError)
      return NextResponse.json(
        { error: 'Failed to update user role' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true,
      message: `User successfully set as ${role}`,
      role: role
    })
    
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}