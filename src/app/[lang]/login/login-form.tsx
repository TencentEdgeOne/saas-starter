"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Toast } from '@/components/ui/toast'
import { Dictionary } from '@/lib/dictionaries'
import { Eye, EyeOff, Mail, Lock, Github } from 'lucide-react'

interface LoginFormProps {
  dict: Dictionary
  lang: string
}

export default function LoginForm({ dict, lang }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setError(decodeURIComponent(errorParam))
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setToast({ message: data.message || 'Signed in successfully!', type: 'success' })
        // 使用 window.location.href 刷新页面，确保 AuthContext 能正确初始化
        setTimeout(() => {
          window.location.href = `/${lang}?auth=success`
        }, 1000)
      } else {
        setError(data.error || 'An error occurred')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'github', forceReauth: boolean = false) => {
    setOauthLoading(provider)
    setError('')

    try {
      const response = await fetch(`/api/auth/oauth/thirdpartysignin`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider, forceReauth }),
      })
      const data = await response.json()

      if (response.ok && data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || `Failed to initiate ${provider} login`)
        setOauthLoading(null)
      }
    } catch (error) {
      setError(`Connection failed. Please try again.`)
      setOauthLoading(null)
    }
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{dict.auth?.login?.formTitle || 'Sign In'}</CardTitle>
          <CardDescription>
            {dict.auth?.login?.formDescription || 'Enter your credentials to access your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {dict.auth?.login?.emailLabel || 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={dict.auth?.login?.emailPlaceholder || 'Enter your email'}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {dict.auth?.login?.passwordLabel || 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={dict.auth?.login?.passwordPlaceholder || 'Enter your password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || oauthLoading !== null}
            >
              {loading ? (dict.auth?.login?.signingIn || 'Signing in...') : (dict.auth?.login?.signInButton || 'Sign In')}
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  { 'Or continue with'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOAuthLogin('google', true)}
              disabled={loading || oauthLoading !== null}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize="24" fontWeight="bold" fill="currentColor">
                  G
                </text>
              </svg>
              <span className="text-sm font-medium">
                {oauthLoading === 'google' ? ( 'Connecting...') : ('Google')}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleOAuthLogin('github', true)}
              disabled={loading || oauthLoading !== null}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="text-sm font-medium">
                {oauthLoading === 'github' ? ('Connecting...') : ( 'GitHub')}
              </span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {dict.auth?.login?.noAccount || "Don't have an account?"}{' '}
              <Link
                href={`/${lang}/signup`}
                className="font-medium text-primary hover:text-primary/80"
              >
                {dict.auth?.login?.signUpLink || 'Sign up here'}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          show={true}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}
