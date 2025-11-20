import { NextRequest, NextResponse } from 'next/server'
import { spendCredits } from '@/lib/credits'
import { withTokenRefresh } from '@/lib/auth-server'

export const dynamic = 'force-dynamic'

/**
 * POST /api/credits/spend
 * 花费用户的积分
 * 
 * 请求体:
 * {
 *   amount: number,           // 花费的积分数量（必需）
 *   description?: string      // 描述（可选）
 * }
 * 
 * 响应:
 * {
 *   success: boolean,
 *   message: string,
 *   userId: string,
 *   amount: number,
 * }
 */
export async function POST(request: NextRequest) {
  return withTokenRefresh(request, async (user) => {
    try {
      if (!user) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }

      const body = await request.json()
      const { amount, orderId, description } = body

      if (!amount || typeof amount !== 'number' || amount <= 0) {
        return NextResponse.json(
          { error: 'Invalid amount. Must be a positive number.' },
          { status: 400 }
        )
      }

      const success = await spendCredits(
        user.id,
        amount,
        description
      )

      if (!success) {
        return NextResponse.json(
          { error: 'Failed to spend credits' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: `Successfully spent ${amount} credits`,
        userId: user.id,
        amount: amount,
        orderId: orderId || null,
      })
    } catch (error) {
      console.error('Error spending credits:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })
}
