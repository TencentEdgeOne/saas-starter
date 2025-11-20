import { createSupabaseAdminClient } from './supabase'

/**
 * 积分系统配置
 */
export const CREDITS_CONFIG = {
  // 注册奖励
  SIGNUP_BONUS: 50,
  // 购买套餐奖励
  PURCHASE_BONUS: {
    pro: 500,
    standard: 200,
    lite: 100,
  },
}

/**
 * 生成唯一的交易编号
 */
export function generateTransNo(type: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `${type.toUpperCase()}_${timestamp}_${random}`
}

/**
 * 添加注册奖励积分
 */
export async function addSignupBonus(userId: string): Promise<boolean> {
  try {
    const supabase = createSupabaseAdminClient()
    const trans_no = generateTransNo('signup')

    const { error } = await supabase
      .from('credits')
      .insert({
        trans_no: trans_no,
        user_id: userId,
        trans_type: 'signup_bonus',
        credits: CREDITS_CONFIG.SIGNUP_BONUS,
        description: '新用户注册奖励积分',
      })

    if (error) {
      console.error('Failed to add signup bonus:', error)
      return false
    }

    console.log(`✅ Signup bonus added for user ${userId}: +${CREDITS_CONFIG.SIGNUP_BONUS}`)
    return true
  } catch (err) {
    console.error('Error adding signup bonus:', err)
    return false
  }
}

/**
 * 添加购买套餐奖励积分
 */
export async function addPurchaseBonus(
  userId: string,
  planName: 'pro' | 'standard' | 'lite',
  orderId?: string
): Promise<boolean> {
  try {
    const supabase = createSupabaseAdminClient()
    const bonusAmount = CREDITS_CONFIG.PURCHASE_BONUS[planName]
    const trans_no = generateTransNo('purchase')

    const { error } = await supabase
      .from('credits')
      .insert({
        trans_no: trans_no,
        user_id: userId,
        trans_type: 'purchase_bonus',
        credits: bonusAmount,
        plan_name: planName,
        description: `购买${planName}套餐赠送积分`,
      })

    if (error) {
      console.error('Failed to add purchase bonus:', error)
      return false
    }

    console.log(`✅ Purchase bonus added for user ${userId} (${planName}): +${bonusAmount}`)
    return true
  } catch (err) {
    console.error('Error adding purchase bonus:', err)
    return false
  }
}

/**
 * 花费积分
 */
export async function spendCredits(
  userId: string,
  amount: number,
  description?: string
): Promise<boolean> {
  try {
    if (amount <= 0) {
      console.error('Spend amount must be positive')
      return false
    }

    const supabase = createSupabaseAdminClient()
    const trans_no = generateTransNo('spend')

    const { error } = await supabase
      .from('credits')
      .insert({
        trans_no: trans_no,
        user_id: userId,
        trans_type: 'spend',
        credits: -amount,
        description: description || '花费积分',
      })

    if (error) {
      console.error('Failed to spend credits:', error)
      return false
    }

    console.log(`✅ Credits spent for user ${userId}: -${amount}`)
    return true
  } catch (err) {
    console.error('Error spending credits:', err)
    return false
  }
}

/**
 * 获取用户的积分余额
 */
export async function getUserCreditsBalance(userId: string): Promise<number> {
  try {
    const supabase = createSupabaseAdminClient()

    const { data, error } = await supabase
      .from('user_credits_balance')
      .select('balance')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Failed to get user credits balance:', error)
      return 0
    }

    return data?.balance || 0
  } catch (err) {
    console.error('Error getting user credits balance:', err)
    return 0
  }
}

/**
 * 获取用户的积分交易历史
 */
export async function getUserCreditsHistory(
  userId: string,
  limit: number = 50,
  offset: number = 0
) {
  try {
    const supabase = createSupabaseAdminClient()

    const { data, error, count } = await supabase
      .from('credits')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Failed to get user credits history:', error)
      return { data: [], count: 0 }
    }

    return { data: data || [], count: count || 0 }
  } catch (err) {
    console.error('Error getting user credits history:', err)
    return { data: [], count: 0 }
  }
}

/**
 * 检查用户是否有足够的积分
 */
export async function hasEnoughCredits(userId: string, requiredAmount: number): Promise<boolean> {
  try {
    const balance = await getUserCreditsBalance(userId)
    return balance >= requiredAmount
  } catch (err) {
    console.error('Error checking user credits:', err)
    return false
  }
}
