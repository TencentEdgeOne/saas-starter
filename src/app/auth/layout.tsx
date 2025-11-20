'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // 监听 auth 状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', { event, session: !!session })
        
        if (event === 'SIGNED_IN' && session) {
          console.log('User signed in:', session.user.email)
          // 保存 session 到 cookies
          try {
            await fetch('/api/auth/session', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                accessToken: session.access_token,
                refreshToken: session.refresh_token,
              }),
            })
          } catch (err) {
            console.warn('Error saving session:', err)
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing all caches...')
          
          // 清除本地存储
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.clear()
            console.log('Cleared localStorage')
          }
          
          // 清除 sessionStorage
          if (typeof window !== 'undefined' && window.sessionStorage) {
            sessionStorage.clear()
            console.log('Cleared sessionStorage')
          }
          
          
          // 清除 session cookies
          try {
            await fetch('/api/auth/logout', {
              method: 'POST',
            })
          } catch (err) {
            console.warn('Error clearing session:', err)
          }
        }
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  return <>{children}</>
}
