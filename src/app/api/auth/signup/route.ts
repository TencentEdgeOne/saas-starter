import { NextRequest, NextResponse } from 'next/server'
import { createOrRetrieveCustomer, createServerClient, createSupabaseAdminClient } from '@/lib/supabase'
import { createStripe } from '@/lib/stripe'

// 强制动态渲染，因为使用了外部服务
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    let customer;
    try {
      customer = await createOrRetrieveCustomer({
        uuid: error ? "" : data.user?.id || "",
        email: email,
      }).catch((err: any) => {
        throw err;
      });
    } catch (err: any) {
      console.error(err);
      return new Response(err.message, { status: 500 });
    }

    return NextResponse.json({
      user: data.user,
      message: 'User created successfully. Please check your email to verify your account.'
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
