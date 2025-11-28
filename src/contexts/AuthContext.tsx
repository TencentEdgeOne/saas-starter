"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, getCurrentUser } from '@/lib/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
  initialUser?: User | null
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser || null)
  const [loading, setLoading] = useState(!initialUser) // 如果有初始用户，不需要加载状态
  const [lastFetchTime, setLastFetchTime] = useState<number>(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // 缓存配置
  const CACHE_DURATION = 30 * 1000 // 30秒缓存
  const MIN_REFRESH_INTERVAL = 1000 // 最小刷新间隔1秒，防止重复请求

  // 缓存的用户获取函数
  const fetchUserWithCache = async (forceRefresh = false) => {
    const now = Date.now()
    
    // 检查缓存是否有效
    if (!forceRefresh && user && (now - lastFetchTime) < CACHE_DURATION) {
      console.log('Using cached user data')
      return user
    }
    
    // 防止并发请求
    if (isRefreshing && !forceRefresh) {
      console.log('User fetch already in progress, skipping...')
      return user
    }
    
    // 防止过于频繁的请求
    if (!forceRefresh && (now - lastFetchTime) < MIN_REFRESH_INTERVAL) {
      console.log('Too frequent requests, using cached data')
      return user
    }

    setIsRefreshing(true)
    
    try {
      console.log('Fetching user data from API...')
      const { user: fetchedUser } = await getCurrentUser()
      setUser(fetchedUser)
      setLastFetchTime(now)
      setLoading(false)
      return fetchedUser
    } catch (error) {
      console.error('Failed to fetch user in AuthContext:', error)
      setLoading(false)
      return null
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    const initializeAuth = async () => {
      // 监听 URL 参数变化，如果有 auth=success，强制刷新用户状态
      const urlParams = new URLSearchParams(window.location.search)
      const forceRefresh = urlParams.get('auth') === 'success'
      
      if (forceRefresh) {
        console.log('Detected auth=success, forcing user state refresh...')
      }

      if (!initialUser) {
        // 没有初始用户，立即获取
        await fetchUserWithCache(forceRefresh)
      } else if (forceRefresh) {
        // 有初始用户但需要强制刷新
        setTimeout(() => {
          fetchUserWithCache(true)
        }, 500)
      } else {
        // 有初始用户，延迟验证最新状态
        setTimeout(() => {
          fetchUserWithCache(false)
        }, 100)
      }
    }

    initializeAuth()
  }, [initialUser])



  const signOut = async () => {
    await fetch('/api/auth/signout', {
      method: 'POST',
    })
    setUser(null)
    setLastFetchTime(0) // 清除缓存时间
  }

  

  const value = {
    user,
    loading,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
