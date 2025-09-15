import { NextRequest, NextResponse } from 'next/server'
import { createAuthenticatedClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // 从 Cookie 中获取访问令牌
    const accessToken = request.cookies.get('sb-access-token')?.value

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // 创建带认证的 Supabase 客户端
    const supabase = createAuthenticatedClient(accessToken)

    // 获取当前用户信息
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken)
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // 查询订阅数据，包含关联的价格和产品信息
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .eq('user_id', user.id)
      .in('status', ['trialing', 'active'])

    if (error) {
      // 处理特定的错误代码
      if (error.code === 'PGRST301') {
        return NextResponse.json(
          { error: 'Session expired' },
          { status: 403 }
        )
      }
      
      return NextResponse.json(
        { error: error.message || 'Failed to fetch subscriptions' },
        { status: 500 }
      )
    }

    return NextResponse.json({ subscriptions })

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
