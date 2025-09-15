import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createSupabaseAdminClient } from '@/lib/supabase'
import { createStripe, getRedirectUrl, parseQueryParams } from '@/lib/stripe'

// 强制动态渲染
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // 解析查询参数
    const { plan, price: priceId } = parseQueryParams(request.url)
    
    if (!plan || !priceId) {
      return NextResponse.json(
        { error: 'Missing plan or price parameter' },
        { status: 400 }
      )
    }

    // 检查用户认证状态
    const cookieStore = request.cookies
    const accessToken = cookieStore.get('sb-access-token')?.value
    const refreshToken = cookieStore.get('sb-refresh-token')?.value

    if (!accessToken) {
      // 未登录，重定向到登录页面
      const redirectUrl = getRedirectUrl(`/checkout?plan=${plan}&price=${priceId}`)
      const loginUrl = getRedirectUrl(`/login?redirectUrl=${encodeURIComponent(redirectUrl)}`)
      return NextResponse.redirect(loginUrl, 302)
    }

    // 创建 Supabase 客户端
    const supabase = createServerClient()

    // 验证访问令牌并获取用户信息
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken)
    
    if (userError || !user) {
      // 如果访问令牌过期，尝试使用刷新令牌
      if (refreshToken) {
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
          refresh_token: refreshToken
        })

        if (refreshError || !refreshData.session) {
          const redirectUrl = getRedirectUrl(`/checkout?plan=${plan}&price=${priceId}`)
          const loginUrl = getRedirectUrl(`/login?redirectUrl=${encodeURIComponent(redirectUrl)}`)
          return NextResponse.redirect(loginUrl, 302)
        }

        // 使用刷新后的用户信息
        const refreshedUser = refreshData.session.user
        return await createCheckoutSession(refreshedUser.id, plan, priceId)
      }

      const redirectUrl = getRedirectUrl(`/checkout?plan=${plan}&price=${priceId}`)
      const loginUrl = getRedirectUrl(`/login?redirectUrl=${encodeURIComponent(redirectUrl)}`)
      return NextResponse.redirect(loginUrl, 302)
    }

    // 创建 checkout session
    return await createCheckoutSession(user.id, plan, priceId)

  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function createCheckoutSession(userId: string, plan: string, priceId: string) {
  try {
    const supabase = createSupabaseAdminClient()
    const stripe = createStripe()

    // 获取用户的 Stripe 客户 ID
    console.log('userId', userId)
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single()

    if (customerError || !customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    // 创建 Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.stripe_customer_id,
      success_url: getRedirectUrl('/profile?success=true'),
      cancel_url: getRedirectUrl('/pricing?canceled=true'),
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      metadata: {
        plan: plan,
        user_id: userId
      }
    })

    if (!session.url) {
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      )
    }

    // 重定向到 Stripe 支付页面
    return NextResponse.redirect(session.url, 302)

  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
