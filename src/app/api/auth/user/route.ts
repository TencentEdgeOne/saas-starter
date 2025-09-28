import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { withTokenRefresh } from '@/lib/auth-server'

// 强制动态渲染，因为使用了 cookies
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // 从请求头中获取认证信息
    const authHeader = request.headers.get('authorization')
    if (authHeader) {
      // 如果客户端提供了 Authorization header，使用它
      const token = authHeader.replace('Bearer ', '')
      const { data: { user }, error } = await supabase.auth.getUser(token)
      
      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 401 }
        )
      }

      return NextResponse.json({ user })
    }

    // 使用 withTokenRefresh 处理 cookie 认证和自动刷新
    return withTokenRefresh(request, async (user) => {
      return NextResponse.json({ user })
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
