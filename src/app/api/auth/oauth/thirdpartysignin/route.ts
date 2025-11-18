import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'


export async function POST(request: NextRequest) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const redirectUri = `${appUrl}/auth/callback`
    try {
        const { provider, forceReauth } = await request.json()

        if (!provider || !['google', 'github'].includes(provider) ){
            return NextResponse.json(
                { error: 'Invalid provider' },
                { status: 400 }
            )
        }

        const supabase = createServerClient()

        // 构建 OAuth 选项
        const oauthOptions: any = {
            redirectTo: redirectUri,
        }

        // 如果需要强制重新授权，添加相应参数
        if (forceReauth) {
            if (provider === 'github') {
                // GitHub: 使用 login 参数强制显示登录界面
                // 这会让 GitHub 显示登录/授权界面，即使用户已授权过
                oauthOptions.scopes = 'user:email'
                oauthOptions.queryParams = {
                    login: 'true',
                }
            } else if (provider === 'google') {
                // Google: 使用 prompt=consent 强制重新授权
                oauthOptions.queryParams = {
                    prompt: 'consent',
                }
            }
        }

        console.log(`OAuth login for ${provider}:`, { forceReauth, options: oauthOptions })

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: oauthOptions
          })
        
        if (error) {
            console.error(`OAuth error for ${provider}:`, error)
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            )
        }

        if (!data?.url) {
            console.error(`No URL returned from OAuth for ${provider}`)
            return NextResponse.json(
                { error: 'Failed to generate OAuth URL' },
                { status: 500 }
            )
        }

        return  NextResponse.json({
            url: data.url,
            message: 'Signed in successfully'
          })

    } catch (error) {
        console.error('OAuth thirdpartysignin error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
