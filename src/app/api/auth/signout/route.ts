import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// 强制动态渲染，因为使用了 cookies
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('Signing out user...')
    const supabase = createServerClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Supabase signOut error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    console.log('User signed out successfully')

    // 创建响应并清除所有认证相关的 Cookie
    const response = NextResponse.json({
      message: 'Signed out successfully'
    })

    // 清除所有认证相关的 cookies
    const cookiesToClear = [
      'auth-token',           // 主要的认证 cookie
      'sb-user-id',          // 用户 ID
      'sb-access-token',     // 访问令牌
      'sb-refresh-token',    // 刷新令牌
      'supabase-auth',       // Supabase 认证
      'supabase-session',    // Supabase session
      'github-state',        // GitHub OAuth state
      'oauth-state',         // OAuth state
    ]

    cookiesToClear.forEach(cookieName => {
      response.cookies.set(cookieName, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0, // 立即过期
        path: '/',
      })
      console.log(`Cleared cookie: ${cookieName}`)
    })

    // 添加 Cache-Control 头，防止浏览器缓存
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')

    return response

  } catch (error) {
    console.error('Signout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
