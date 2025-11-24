"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, getCurrentUser, onAuthStateChange } from '@/lib/auth'

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

  useEffect(() => {
    // 总是获取最新的用户信息，确保登录状态是最新的
    // 这对于注册后立即跳转的场景很重要
    const fetchUser = async () => {
      const { user: fetchedUser } = await getCurrentUser()
      setUser(fetchedUser)
      setLoading(false)
    }

    if (!initialUser) {
      // 没有初始用户，立即获取
      fetchUser()
    } else {
      // 有初始用户，也立即验证一下是否还有效
      setLoading(false)
      fetchUser()
    }
  }, [initialUser])



  const signOut = async () => {
    await fetch('/api/auth/signout', {
      method: 'POST',
    })
    setUser(null)
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
