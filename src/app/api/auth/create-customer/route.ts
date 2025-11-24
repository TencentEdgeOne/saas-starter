import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient, upsertCustomer } from '@/lib/supabase'
import { createStripeCustomer } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { userId, email } = await request.json()

    if (!userId || !email) {
      return NextResponse.json(
        { error: 'Missing userId or email' },
        { status: 400 }
      )
    }

    const adminClient = createSupabaseAdminClient()

    // 检查客户记录是否已存在
    const { data: existingCustomer, error: queryError } = await adminClient
      .from('customers')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (queryError) {
      console.error('Failed to query customer:', queryError)
      return NextResponse.json(
        { error: 'Failed to query customer', details: queryError },
        { status: 500 }
      )
    }

    if (existingCustomer) {
      console.log('Customer record already exists for user:', userId)
      return NextResponse.json({
        success: true,
        message: 'Customer record already exists',
        created: false,
      })
    }

    // 创建 Stripe customer
    console.log('Creating Stripe customer for user:', userId)
    let stripeCustomerId
    try {
      stripeCustomerId = await createStripeCustomer(email, userId)
      console.log('Stripe customer created:', stripeCustomerId)
    } catch (stripeError) {
      console.error('Failed to create Stripe customer:', stripeError)
      return NextResponse.json(
        { error: 'Failed to create Stripe customer', details: String(stripeError) },
        { status: 500 }
      )
    }

    // 在 Supabase 中创建客户记录
    console.log('Creating customer record in Supabase for user:', userId)
    try {
      await upsertCustomer(userId, stripeCustomerId)
      console.log('Customer record created successfully for user:', userId)
    } catch (upsertError) {
      console.error('Failed to upsert customer record:', upsertError)
      return NextResponse.json(
        { error: 'Failed to create customer record', details: String(upsertError) },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Customer record created successfully',
      created: true,
      stripeCustomerId: stripeCustomerId,
    })
  } catch (error) {
    console.error('Error in create-customer API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
