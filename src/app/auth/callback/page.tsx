'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { defaultLocale } from '@/lib/i18n'

export default function AuthCallbackPage() {
  const router = useRouter()
  const hasExecuted = useRef(false)

  useEffect(() => {
    if (hasExecuted.current) return
    hasExecuted.current = true

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

        // 检查是否是通过 OAuth 登录，如果是则尝试添加新用户注册奖励
        try {
          const provider = session.user.identities?.[0]?.provider
          if (provider && ['google', 'github'].includes(provider)) {
            console.log(`User logged in via ${provider}, checking for signup reward...`)
            const rewardResponse = await fetch('/api/auth/oauth/signup-reward', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId: session.user.id,
                provider: provider,
              }),
            })

            if (rewardResponse.ok) {
              const rewardData = await rewardResponse.json()
              if (rewardData.isNewUser && !rewardData.alreadyRewarded) {
                console.log(
                  `Signup reward applied: ${rewardData.creditsAdded} credits added`
                )
              } else if (rewardData.alreadyRewarded) {
                console.log('User has already received signup reward')
              } else {
                console.log('User is not new, no signup reward applied')
              }
            } else {
              console.warn('Failed to process signup reward:', await rewardResponse.json())
            }
          }
        } catch (err) {
          console.warn('Error processing signup reward:', err)
        }
        
        // 创建或更新客户记录
        try {
          console.log('Creating/checking customer record for user:', session.user.id,session.user.email)
          const customerResponse = await fetch('/api/auth/create-customer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: session.user.id,
              email: session.user.email,
            }),
          })

          if (customerResponse.ok) {
            const customerData = await customerResponse.json()
            if (customerData.created) {
              console.log('Customer record created successfully with Stripe ID:', customerData.stripeCustomerId)
            } else {
              console.log('Customer record already exists')
            }
          } else {
            const errorData = await customerResponse.json()
            console.warn('Failed to create customer record:', errorData)
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
      hasExecuted.current = false

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
