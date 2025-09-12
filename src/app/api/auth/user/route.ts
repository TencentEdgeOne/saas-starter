import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

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

    // 从 Cookie 中获取访问令牌
    const accessToken = request.cookies.get('sb-access-token')?.value
    const refreshToken = request.cookies.get('sb-refresh-token')?.value

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // 使用访问令牌获取用户信息
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)

    if (error) {
      // 如果访问令牌过期，尝试使用刷新令牌
      if (refreshToken) {
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
          refresh_token: refreshToken
        })

        if (refreshError || !refreshData.session) {
          return NextResponse.json(
            { error: 'Session expired' },
            { status: 401 }
          )
        }

        // 返回新用户信息
        return NextResponse.json({ user: refreshData.session.user })
      }

      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    return NextResponse.json({ user })

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
