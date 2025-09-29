import { cookies } from 'next/headers'
import { createServerClient } from './supabase'
import { User } from './auth'
import { NextRequest, NextResponse } from 'next/server'

export async function getServerUser(): Promise<{ user: User | null; error: string | null }> {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient()

    const authTokenData = cookieStore.get('auth-token')?.value

    if (!authTokenData) {
      return { user: null, error: null }
    }

    const { access_token: accessToken, refresh_token: refreshToken } = JSON.parse(authTokenData)

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
  handler: (user: any) => Promise<NextResponse>
) {
  try {

    const authTokenData = request.cookies.get('auth-token')?.value

    if (!authTokenData) {
      return NextResponse.json(
        { error: 'No access token provided' },
        { status: 401 }
      )
    }

    const { access_token: accessToken, refresh_token: refreshToken } = JSON.parse(authTokenData)


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
        const response = await handler({...refreshData.session.user, access_token: refreshData.session.access_token})
       
        response.cookies.set('auth-token', JSON.stringify({access_token: refreshData.session.access_token, refresh_token: refreshData.session.refresh_token}),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7 // 7 days
        });
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
