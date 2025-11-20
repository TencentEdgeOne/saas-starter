import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { getUserCreditsHistory } from '@/lib/credits'

export const dynamic = 'force-dynamic'

/**
 * GET /api/credits/history?limit=50&offset=0
 * 获取当前用户的积分交易历史
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    // 获取当前用户
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 获取查询参数
    const searchParams = request.nextUrl.searchParams
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')

    // 获取用户积分交易历史
    const { data, count } = await getUserCreditsHistory(user.id, limit, offset)

    return NextResponse.json({
      userId: user.id,
      transactions: data,
      total: count,
      limit: limit,
      offset: offset,
    })
  } catch (error) {
    console.error('Error getting credits history:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
