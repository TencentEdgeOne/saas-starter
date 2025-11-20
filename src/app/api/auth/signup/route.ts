import { NextRequest, NextResponse } from 'next/server'
import { createOrRetrieveCustomer, createServerClient, createSupabaseAdminClient } from '@/lib/supabase'

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

    // 添加注册奖励积分
    if (data.user?.id) {
      try {
        const timestamp = Date.now()
        const userId = data.user.id
        const trans_no = `SIGNUP_BONUS_${timestamp}_${userId.substring(0, 8)}`
        
        const adminClient = createSupabaseAdminClient()
        const { error: creditError } = await adminClient
          .from('credits')
          .insert({
            trans_no: trans_no,
            user_id: userId,
            trans_type: 'signup_bonus',
            credits: 50,
            description: '新用户注册奖励积分'
          })

        if (creditError) {
          console.error('Failed to add signup bonus credits:', creditError)
          // 积分添加失败不影响注册流程
        } else {
          console.log('✅ Signup bonus credits added for user:', userId)
        }
      } catch (creditErr) {
        console.error('Error adding signup bonus:', creditErr)
        // 积分添加异常不影响注册流程
      }
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
