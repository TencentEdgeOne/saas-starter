import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// 强制动态渲染，因为使用了 cookies
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            )
        }

        const supabase = createServerClient()

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            )
        }

        // 创建响应并设置 Supabase 会话 Cookie
        const response = NextResponse.json({
            user: data.user,
            message: 'Signed in successfully'
        })

        // 设置 Supabase 会话 Cookie
        if (data.session) {
            response.cookies.set('auth-token', JSON.stringify({ access_token: data.session.access_token, refresh_token: data.session.refresh_token }),
                {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 24 * 7 // 7 days
                });
        }
        return response

    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
