import { supabase } from './supabase'
import { Subscription } from '@/types/subscription'

export interface User {
  id: string
  email?: string
  created_at?: string
  updated_at?: string
}


// 客户端认证函数 - 调用 API 接口
export async function signOut(): Promise<{ error: string | null }> {
  try {
    const response = await fetch('/api/auth/signout', {
      method: 'POST',
    })

    const data = await response.json()

    if (!response.ok) {
      return { error: data.error || 'Sign out failed' }
    }

    return { error: null }
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'Network error' 
    }
  }
}

export async function getCurrentUser(): Promise<{ user: User | null; error: string | null }> {
  try {
    const response = await fetch('/api/auth/user')
    const data = await response.json()

    if (!response.ok) {
      return { user: null, error: data.error || 'Failed to get user' }
    }

    return { user: data.user, error: null }
  } catch (error) {
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
