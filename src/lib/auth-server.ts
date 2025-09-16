import { cookies } from 'next/headers'
import { createServerClient } from './supabase'
import { User } from './auth'
import { NextRequest, NextResponse } from 'next/server'

export async function getServerUser(): Promise<{ user: User | null; error: string | null }> {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient()

    const accessToken = cookieStore.get('sb-access-token')?.value
    const refreshToken = cookieStore.get('sb-refresh-token')?.value

    if (!accessToken) {
      return { user: null, error: null }
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (error) {
      if (refreshToken) {
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
          refresh_token: refreshToken
        })

        if (refreshError || !refreshData.session) {
          return { user: null, error: 'Session expired' }
        }

        return { user: refreshData.session.user as User, error: null }
      }
      return { user: null, error: 'Invalid token' }
    }

    return { user: user as User, error: null }
  } catch (error) {
    return { user: null, error: error instanceof Error ? error.message : 'An unexpected error occurred' }
  }
}

/**
 * 处理 API 请求中的 token 验证和自动刷新
 * @param request - NextRequest 对象
 * @param handler - 实际的 API 处理函数
 * @returns NextResponse
 */
export async function withTokenRefresh(
  request: NextRequest,
  handler: (user: any, response?: NextResponse) => Promise<NextResponse>
) {
  try {
    const accessToken = request.cookies.get('sb-access-token')?.value
    const refreshToken = request.cookies.get('sb-refresh-token')?.value

    if (!accessToken) {
      return NextResponse.json(
        { error: 'No access token provided' },
        { status: 401 }
      )
    }

    const supabase = createServerClient()
    
    // 尝试使用 access token 获取用户信息
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken)
    if (userError) {
      // 如果 access token 无效，尝试使用 refresh token
      if (refreshToken) {
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
          refresh_token: refreshToken
        })
        
        if (refreshError || !refreshData.session) {
          return NextResponse.json(
            { error: 'Invalid or expired token' },
            { status: 401 }
          )
        }
        
        // 刷新成功，创建包含新 token 的响应
        const response = await handler(refreshData.session.user)
        
        // 设置新的 cookies
        response.cookies.set('sb-access-token', refreshData.session.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7 // 7 days
        })
        
        response.cookies.set('sb-refresh-token', refreshData.session.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30 // 30 days
        })
        
        return response
      }
      
      // 没有 refresh token
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }
    
    // access token 有效，直接处理请求
    return await handler({...user, access_token: accessToken})
    
  } catch (error) {
    console.error('Error in withTokenRefresh:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
