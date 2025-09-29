import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createSupabaseAdminClient } from '@/lib/supabase'
import { createStripe, getRedirectUrl, parseQueryParams } from '@/lib/stripe'
import { withTokenRefresh } from '@/lib/auth-server'

// 强制动态渲染
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // 解析查询参数
    console.log('request.url', request.url,parseQueryParams(request.url))
    const { plan, price: priceId, lang } = parseQueryParams(request.url)
    
    if (!plan || !priceId) {
      return NextResponse.json(
        { error: 'Missing plan or price parameter' },
        { status: 400 }
      )
    }

    // 检查是否有 access token
    const accessToken = request.cookies.get('auth-token')?.value
    if (!accessToken) {
      // 未登录，重定向到登录页面
      const redirectUrl = getRedirectUrl(`/checkout?plan=${plan}&price=${priceId}`)
      const loginUrl = getRedirectUrl(`/${lang}/login?redirectUrl=${encodeURIComponent(redirectUrl)}`)
      return NextResponse.redirect(loginUrl, 302)
    }

    // 使用 withTokenRefresh 处理认证和自动刷新
    return withTokenRefresh(request, async (user) => {
      return await createCheckoutSession(user.id, plan, priceId, lang)
    })

  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function createCheckoutSession(userId: string, plan: string, priceId: string, lang: string) {
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
      success_url: getRedirectUrl(`/${lang}/profile?success=true`),
      cancel_url: getRedirectUrl(`/${lang}/pricing?canceled=true`),
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
