import { NextRequest, NextResponse } from 'next/server'
import { createAuthenticatedClient } from '@/lib/supabase'
import { withTokenRefresh } from '@/lib/auth-server'

// 强制动态渲染，因为使用了 cookies
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  return withTokenRefresh(request, async (user) => {
    try {
      // 创建带认证的 Supabase 客户端
      const supabase = createAuthenticatedClient(user.access_token)

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
  })
}
