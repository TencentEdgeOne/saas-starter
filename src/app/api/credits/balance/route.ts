import { NextRequest, NextResponse } from 'next/server'
import { getUserCreditsBalance } from '@/lib/credits'
import { withTokenRefresh } from '@/lib/auth-server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/credits/balance
 * 获取当前用户的积分余额
 */
export async function GET(request: NextRequest) {
  return withTokenRefresh(request, async (user) => {
    try {
      if (!user) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }

      // 获取用户积分余额
      const balance = await getUserCreditsBalance(user.id)

      return NextResponse.json({
        userId: user.id,
        balance: balance,
        email: user.email,
      })
    } catch (error) {
      console.error('Error getting credits balance:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })
}
