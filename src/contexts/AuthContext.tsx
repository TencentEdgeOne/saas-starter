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
    // 如果没有初始用户，才去获取
    if (!initialUser) {
      getCurrentUser().then(({ user }) => {
        setUser(user)
        setLoading(false)
      })
    }
  }, [initialUser])



  const signOut = async () => {
    const { signOut: signOutUser } = await import('@/lib/auth')
    await signOutUser()
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
