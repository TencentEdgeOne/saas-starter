'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { defaultLocale } from '@/lib/i18n'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('Auth callback page loaded')
        
        // 给 Supabase 一点时间来处理 URL 中的 session
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // 获取当前 session
        let { data: { session }, error: sessionError } = await supabase.auth.getSession()

        console.log('Session check result:', { 
          session: !!session, 
          error: sessionError,
          accessToken: session?.access_token ? 'present' : 'missing',
          refreshToken: session?.refresh_token ? 'present' : 'missing'
        })

        // 如果第一次没有获取到 session，再试一次
        if (!session && !sessionError) {
          console.log('Session not found, retrying...')
          await new Promise(resolve => setTimeout(resolve, 500))
          const retry = await supabase.auth.getSession()
          session = retry.data.session
          sessionError = retry.error
          console.log('Retry result:', { session: !!session, error: sessionError })
        }

        if (sessionError) {
          console.error('Auth callback error:', sessionError)
          router.push(`/${defaultLocale}/login?error=` + encodeURIComponent(sessionError.message))
          return
        }

        if (!session) {
          console.error('No session found after callback')
          router.push(`/${defaultLocale}/login?error=` + encodeURIComponent('No session found'))
          return
        }

        console.log('User authenticated successfully:', session.user.email)
        
        // 立即保存 session 到 cookies，不等待其他操作
        try {
          console.log('Saving session to cookies immediately...')
          const saveResponse = await fetch('/api/auth/session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              accessToken: session.access_token,
              refreshToken: session.refresh_token,
            }),
          })

          if (!saveResponse.ok) {
            const errorData = await saveResponse.json()
            console.warn('Failed to save session to cookies:', errorData)
          } else {
            console.log('Session saved to cookies successfully')
          }
        } catch (err) {
          console.warn('Error saving session:', err)
        }
        
        // 创建或更新客户记录
        try {
          console.log('Creating/checking customer record for user:', session.user.id)
          const { data: existingCustomer, error: queryError } = await supabase
            .from('customers')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle()

          if (queryError) {
            console.warn('Failed to query customer:', queryError)
          } else if (!existingCustomer) {
            // 创建新的客户记录
            console.log('Creating new customer record...')
            const { error: createError } = await supabase
              .from('customers')
              .insert([
                {
                  id: session.user.id,
                  stripe_customer_id: null,
                }
              ])

            if (createError) {
              console.warn('Failed to create customer record:', createError)
            } else {
              console.log('Customer record created successfully')
            }
          } else {
            console.log('Customer record already exists')
          }
        } catch (err) {
          console.warn('Customer record creation error:', err)
        }

        // 等待一下确保 cookies 已设置，然后重定向
        console.log('Waiting for cookies to be set...')
        await new Promise(resolve => setTimeout(resolve, 500))
        
        console.log('Redirecting to home page')
        router.push('/')
      } catch (error) {
        console.error('Callback processing error:', error)
        router.push('/login?error=' + encodeURIComponent('Authentication failed'))
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Processing authentication...</p>
      </div>
    </div>
  )
}
