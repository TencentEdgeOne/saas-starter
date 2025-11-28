import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { withTokenRefresh } from '@/lib/auth-server'

// 强制动态渲染，因为使用了 cookies
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/auth/user called')
    const supabase = createServerClient()

    // 从请求头中获取认证信息
    const authHeader = request.headers.get('authorization')
    if (authHeader) {
      console.log('Using Authorization header')
      // 如果客户端提供了 Authorization header，使用它
      const token = authHeader.replace('Bearer ', '')
      const { data: { user }, error } = await supabase.auth.getUser(token)
      
      if (error) {
        console.error('Auth header error:', error)
        return NextResponse.json(
          { error: error.message },
          { status: 401 }
        )
      }

      console.log('User from auth header:', user?.email)
      return NextResponse.json({ user })
    }

    // 使用 withTokenRefresh 处理 cookie 认证和自动刷新
    // 添加重试机制以处理 session 还未完全保存的情况
    const authTokenData = request.cookies.get('auth-token')?.value

    console.log('Auth token from cookies:', authTokenData ? 'present' : 'missing')

    if (!authTokenData) {
      console.warn('No auth token found in cookies, returning 202 to retry')
      // 返回 202 Accepted，告诉客户端稍后重试
      return NextResponse.json(
        { error: 'Session not yet available, please retry' },
        { status: 202 }
      )
    }

    console.log('Using token refresh')
    return withTokenRefresh(request, async (user) => {
      console.log('User from token refresh:', user?.email)
      return NextResponse.json({ user })
    })

  } catch (error) {
    console.error('User endpoint error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
