import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase'
import { getOAuthSignupReward, generateTransactionNo } from '@/lib/signup-rewards'

/**
 * POST /api/auth/oauth/signup-reward
 * Handle OAuth third-party login new user registration rewards
 * 
 * Request body:
 * {
 *   userId: string,      // User ID
 *   provider: string     // OAuth provider (google | github)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, provider } = body
    // Validate required parameters
    if (!userId || !provider) {
      return NextResponse.json(
        { error: 'Missing required parameters: userId, provider' },
        { status: 400 }
      )
    }

    // Validate provider
    if (!['google', 'github'].includes(provider)) {
      return NextResponse.json(
        { error: 'Invalid provider. Must be google or github' },
        { status: 400 }
      )
    }

    const supabase = createSupabaseAdminClient()
    
    // 1. Check if user has already received signup reward (signup_bonus record)
    const { data: existingReward, error: rewardError } = await supabase
      .from('credits')
      .select('id')
      .eq('user_id', userId)
      .eq('trans_type', 'signup_bonus')
      .maybeSingle()

    if (rewardError) {
      console.error('Failed to check existing reward:', rewardError)
      return NextResponse.json(
        { error: 'Failed to check existing reward' },
        { status: 500 }
      )
    }


    // If reward already received, user is not new, no additional reward
    if (existingReward) {
      console.log(`User ${userId} has already received signup reward`)
      return NextResponse.json(
        {
          isNewUser: false,
          alreadyRewarded: true,
          creditsAdded: 0,
          message: 'User has already received signup reward',
        },
        { status: 200 }
      )
    }

    // 2. Get reward credits amount
    const rewardCredits = getOAuthSignupReward(provider as 'google' | 'github')

    // 3. Generate transaction number
    const transNo = generateTransactionNo('signup_bonus')

    // 4. Add credits record
    const { error: insertError } = await supabase
      .from('credits')
      .insert({
        trans_no: transNo,
        user_id: userId,
        trans_type: 'signup_bonus',
        credits: rewardCredits,
        description: `${provider} OAuth signup reward`,
      })

    if (insertError) {
      console.error('Failed to add credits:', insertError)
      return NextResponse.json(
        { error: 'Failed to add credits' },
        { status: 500 }
      )
    }

    console.log(
      `Successfully added ${rewardCredits} credits for user ${userId} via ${provider} OAuth signup`
    )

    return NextResponse.json(
      {
        isNewUser: true,
        alreadyRewarded: false,
        creditsAdded: rewardCredits,
        provider: provider,
        message: `Successfully added ${rewardCredits} credits for OAuth signup`,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('OAuth signup reward error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
