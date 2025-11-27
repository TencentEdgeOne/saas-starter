"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Toast } from '@/components/ui/toast'
import { Dictionary } from '@/lib/dictionaries'
import { Eye, EyeOff, Mail, Lock, User, Github } from 'lucide-react'

interface SignupFormProps {
  dict: Dictionary
  lang?: string
}

export default function SignupForm({ dict, lang }: SignupFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setToast({ message: data.message || 'Account created successfully!', type: 'success' })
        if (data.session) {
          // 有 session，等待 Cookie 设置完成后刷新页面以重新初始化 AuthContext
          console.log('Registration successful with session, redirecting...')
          setTimeout(() => {
            window.location.href = `/${lang}?auth=success`
          }, 1500)
        } else {
          // 其他情况，跳转到登录页
          console.log('Registration successful but no session, redirecting to login...')
          setTimeout(() => {
            router.push(`/${lang}/login`)
          }, 2000)
        }
      } else {
        setError(data.error || 'An error occurred')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{dict.auth?.signup?.formTitle || 'Sign Up'}</CardTitle>
          <CardDescription>
            {dict.auth?.signup?.formDescription || 'Create your account to get started'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                {dict.auth?.signup?.fullNameLabel || 'Full Name'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={dict.auth?.signup?.fullNamePlaceholder || 'Enter your full name'}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {dict.auth?.signup?.emailLabel || 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={dict.auth?.signup?.emailPlaceholder || 'Enter your email'}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {dict.auth?.signup?.passwordLabel || 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={dict.auth?.signup?.passwordPlaceholder || 'Enter your password'}
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                {dict.auth?.signup?.confirmPasswordLabel || 'Confirm Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={dict.auth?.signup?.confirmPasswordPlaceholder || 'Confirm your password'}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
              disabled={loading}
            >
              {loading ? (dict.auth?.signup?.creating || 'Creating account...') : (dict.auth?.signup?.signUpButton || 'Sign Up')}
            </Button>

            
          
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
            
          </form>



          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {dict.auth?.signup?.hasAccount || 'Already have an account?'}{' '}
              <Link
                href={`/${lang}/login`}
                className="font-medium text-primary hover:text-primary/80"
              >
                {dict.auth?.signup?.signInLink || 'Sign in here'}
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
