/**
 * OAuth Signup Rewards Configuration and Utilities
 */

// OAuth signup reward credits by provider
const OAUTH_SIGNUP_REWARDS: Record<'google' | 'github', number> = {
  google: 50,
  github: 50,
}

/**
 * Get OAuth signup reward credits for a specific provider
 * @param provider - OAuth provider (google | github)
 * @returns Number of credits to reward
 */
export function getOAuthSignupReward(provider: 'google' | 'github'): number {
  return OAUTH_SIGNUP_REWARDS[provider] || 50
}

/**
 * Generate a unique transaction number
 * @param type - Transaction type prefix
 * @returns Unique transaction number
 */
export function generateTransactionNo(type: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `${type.toUpperCase()}_${timestamp}_${random}`
}
