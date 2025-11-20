/**
 * 清除所有与认证相关的缓存和状态
 * 用于登出后确保完全清理
 */
export async function clearAllAuthCaches() {
  console.log('Clearing all auth caches...')

  // 清除 localStorage
  if (typeof window !== 'undefined' && window.localStorage) {
    const keysToRemove = [
      'supabase.auth.token',
      'supabase.auth.refresh_token',
      'supabase.auth.expires_at',
      'supabase.auth.expires_in',
      'supabase.auth.user',
      'supabase.auth.session',
      'github-oauth-state',
      'oauth-state',
      'auth-user',
      'user-session',
    ]

    keysToRemove.forEach(key => {
      localStorage.removeItem(key)
    })
    console.log('Cleared localStorage')
  }

  // 清除 sessionStorage
  if (typeof window !== 'undefined' && window.sessionStorage) {
    sessionStorage.clear()
    console.log('Cleared sessionStorage')
  }


  // 清除浏览器缓存
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      )
      console.log('Cleared browser cache')
    } catch (err) {
      console.warn('Error clearing browser cache:', err)
    }
  }

  // 清除所有 cookies（客户端可访问的）
  if (typeof document !== 'undefined') {
    document.cookie.split(';').forEach(c => {
      const eqPos = c.indexOf('=')
      const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim()
      if (name && !name.startsWith('__')) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
      }
    })
    console.log('Cleared accessible cookies')
  }
}

/**
 * 重置 Supabase 客户端状态
 */
export function resetSupabaseState() {
  console.log('Resetting Supabase state...')
  
  // 这会在 signOut 时自动调用，但我们可以确保它被调用
  if (typeof window !== 'undefined') {
    // 清除任何 Supabase 相关的全局状态
    if ((window as any).supabaseState) {
      delete (window as any).supabaseState
    }
  }
}

/**
 * 验证是否完全登出
 */
export async function verifyLoggedOut(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/user')
    
    // 如果返回 401 或 202，说明已登出
    if (response.status === 401 || response.status === 202) {
      console.log('Verified: User is logged out')
      return true
    }

    console.warn('Verification failed: User may still be logged in')
    return false
  } catch (error) {
    console.error('Error verifying logout:', error)
    return false
  }
}
