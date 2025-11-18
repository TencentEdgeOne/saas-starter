import { supabase } from './supabase'
import { Subscription } from '@/types/subscription'
import { clearAllAuthCaches, resetSupabaseState, verifyLoggedOut } from './auth-utils'

export interface User {
  id: string
  email?: string
  created_at?: string
  updated_at?: string
}


// 客户端认证函数 - 调用 API 接口
export async function signOut(): Promise<{ error: string | null }> {
  try {
    console.log('Signing out user...')
    
    // 先在客户端登出 Supabase
    const { error: supabaseError } = await supabase.auth.signOut()
    if (supabaseError) {
      console.warn('Supabase signOut error:', supabaseError)
    }

    // 清除本地存储中的所有认证相关数据
    console.log('Clearing local storage...')
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
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(key)
        console.log(`Removed localStorage key: ${key}`)
      }
    })

    // 清除 sessionStorage
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.clear()
      console.log('Cleared sessionStorage')
    }

    // 然后调用服务器端登出 API 清除 cookies
    const response = await fetch('/api/auth/signout', {
      method: 'POST',
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Sign out API error:', data.error)
      return { error: data.error || 'Sign out failed' }
    }

    console.log('User signed out successfully')
    
    // 使用工具函数清除所有缓存
    await clearAllAuthCaches()
    resetSupabaseState()
    
    // 验证是否完全登出
    const isLoggedOut = await verifyLoggedOut()
    if (!isLoggedOut) {
      console.warn('Warning: User may not be fully logged out')
    }

    return { error: null }
  } catch (error) {
    console.error('Sign out error:', error)
    return { 
      error: error instanceof Error ? error.message : 'Network error' 
    }
  }
}

export async function getCurrentUser(retries = 5, delay = 800): Promise<{ user: User | null; error: string | null }> {
  try {
    for (let attempt = 1; attempt <= retries; attempt++) {
      console.log(`Getting current user (attempt ${attempt}/${retries})`)
      
      try {
        const response = await fetch('/api/auth/user', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          },
        })
        const data = await response.json()

        console.log(`Response status: ${response.status}`, data)

        // 202 表示 session 还未完全保存，需要重试
        if (response.status === 202 && attempt < retries) {
          console.log(`Session not yet available, retrying in ${delay}ms... (attempt ${attempt}/${retries})`)
          await new Promise(resolve => setTimeout(resolve, delay))
          continue
        }

        if (!response.ok) {
          console.error(`Failed to get user: ${data.error}`)
          return { user: null, error: data.error || 'Failed to get user' }
        }

        console.log('User retrieved successfully:', data.user?.email)
        return { user: data.user, error: null }
      } catch (fetchError) {
        console.error(`Fetch error on attempt ${attempt}:`, fetchError)
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, delay))
          continue
        }
        throw fetchError
      }
    }

    return { 
      user: null, 
      error: 'Failed to get user after multiple retries' 
    }
  } catch (error) {
    console.error('getCurrentUser error:', error)
    return { 
      user: null, 
      error: error instanceof Error ? error.message : 'Network error' 
    }
  }
}

// 监听认证状态变化 - 使用 Supabase 客户端
export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user as User || null)
  })
}

// 获取用户订阅信息
export async function getSubscriptions(): Promise<{ subscriptions: Subscription[] | null; error: string | null }> {
  try {
    const response = await fetch('/api/subscriptions')
    const data = await response.json()

    if (!response.ok) {
      return { subscriptions: null, error: data.error || 'Failed to fetch subscriptions' }
    }

    return { subscriptions: data.subscriptions, error: null }
  } catch (error) {
    return { 
      subscriptions: null, 
      error: error instanceof Error ? error.message : 'Network error' 
    }
  }
}
