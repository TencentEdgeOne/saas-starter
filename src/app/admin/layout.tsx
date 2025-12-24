"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Users, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Globe,
  Eye,
  EyeOff,
  Mail,
  Lock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { checkAdminStatus, adminSignOut, authenticateAdmin, type AdminUser } from '@/lib/admin-auth'
import { AdminLanguageProvider, useAdminLanguage, adminTexts } from '@/lib/admin-language-context'
import { AdminThemeProvider } from '@/lib/admin-theme-context'


interface AdminLayoutProps {
  children: React.ReactNode
}

// Internal layout component, using Context
function AdminLayoutContent({ children }: AdminLayoutProps) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [authStatus, setAuthStatus] = useState<{
    isLoggedIn: boolean;
    hasAccount: boolean;
    isAdmin: boolean;
  }>({ isLoggedIn: false, hasAccount: false, isAdmin: false })
  
  // Login form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  
  const { language, changeLanguage } = useAdminLanguage()
  const pathname = usePathname()
  const router = useRouter()
  const t = adminTexts[language]

  // Check admin permissions
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { isAdmin, user, isLoggedIn, hasAccount } = await checkAdminStatus()
        
        setAuthStatus({ isLoggedIn, hasAccount, isAdmin })
        
        if (isAdmin && user) {
          setAdminUser(user)
        } else {
          setAdminUser(null)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setAuthStatus({ isLoggedIn: false, hasAccount: false, isAdmin: false })
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Listen to Supabase auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        // User has signed out, reset state
        setAuthStatus({ isLoggedIn: false, hasAccount: false, isAdmin: false })
        setAdminUser(null)
      } else if (event === 'SIGNED_IN' && session) {
        // User has signed in, recheck admin status
        checkAuth()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const navigation = [
    { name: t.dashboard, href: '/admin', icon: BarChart3 },
    { name: t.users, href: '/admin/users', icon: Users },
    { name: t.orders, href: '/admin/orders', icon: ShoppingCart },
    { name: t.settings, href: '/admin/settings', icon: Settings },
  ]

  const handleLogout = async () => {
    try {
      await adminSignOut()
      setAuthStatus({ isLoggedIn: false, hasAccount: false, isAdmin: false })
      setAdminUser(null)
    } catch (error) {
      console.error('Logout error:', error)
      setAuthStatus({ isLoggedIn: false, hasAccount: false, isAdmin: false })
      setAdminUser(null)
    }
  }

  // Handle login form submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')

    try {
      const result = await authenticateAdmin(email, password)
      
      if (result.success) {
        // Login successful, recheck auth status
        const { isAdmin, user } = await checkAdminStatus()
        if (isAdmin && user) {
          setAdminUser(user)
          setAuthStatus({ isLoggedIn: true, hasAccount: true, isAdmin: true })
        }
      } else {
        setLoginError(result.error || t.invalidCredentials)
      }
    } catch (error) {
      console.error('Login error:', error)
      setLoginError(t.loginFailedRetry)
    } finally {
      setLoginLoading(false)
    }
  }

  // If still loading, show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t.loading}</p>
        </div>
      </div>
    )
  }

  // If not logged in, show login page
  if (!authStatus.isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col relative overflow-hidden">
        <header className="relative z-20 bg-background/80 backdrop-blur-sm border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <h1 className="text-xl font-semibold text-foreground">
                  {t.saasStarterAdmin}
                </h1>
              </div>
              
              <div className="flex items-center">
                <button
                  onClick={() => changeLanguage(language === 'en' ? 'zh' : 'en')}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200"
                >
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{language === 'en' ? 'English': '中文'}</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-radial"></div>
          
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float-slow"></div>
          
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-float" ></div>
          <div className="absolute top-3/4 left-1/3 w-24 h-24 bg-accent/15 rounded-full blur-xl animate-float"></div>
          
          <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-primary/25 rounded-full blur-lg animate-float-fast" ></div>
          <div className="absolute bottom-1/3 left-2/3 w-20 h-20 bg-accent/20 rounded-full blur-lg animate-float-fast" ></div>
          
          <div className="absolute top-1/6 right-1/4 w-8 h-8 bg-primary/30 rounded-full blur-sm animate-pulse-gentle"></div>
          <div className="absolute bottom-1/6 left-1/4 w-12 h-12 bg-accent/25 rounded-full blur-sm animate-pulse-gentle"></div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
          <div className="w-full max-w-6xl flex items-center justify-center lg:justify-start">
            
            <div className="hidden lg:flex lg:w-1/2 lg:pr-16">
              <div className="w-full max-w-md">
                <div className="text-center space-y-8">
                 
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {t.modernPlatform}
                    </p>
                    
                    <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse-gentle"></div>
                        <span>{t.secure}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse-gentle" style={{ animationDelay: '0.5s' }}></div>
                        <span>{t.efficient}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse-gentle" style={{ animationDelay: '1s' }}></div>
                        <span>{t.smart}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full max-w-md lg:w-1/2 lg:max-w-lg">
              <div className="text-center lg:hidden mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-primary/20 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-sm"></div>
                  </div>
                </div>
                <h1 className="text-xl font-semibold text-foreground mb-1">
                  {t.adminManagementSystem}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {t.loginWithAdminMobile}
                </p>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl"></div>
                
                <div className="relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-md">
                      <Lock className="h-5 w-5 text-white" />
                    </div>
                  </div>

                  <div className="pt-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-foreground mb-2">{t.adminLogin}</h2>
                      <p className="text-sm text-muted-foreground">
                        {t.loginWithAdmin}
                      </p>
                    </div>

                    <form onSubmit={handleLoginSubmit} className="space-y-6">
                      {/* 邮箱字段 */}
                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-foreground">
                          {t.emailAddress}
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur opacity-0 group-focus-within:opacity-30 transition-opacity duration-300"></div>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-primary z-[3]" />
                            <input
                              id="email"
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full pl-12 pr-4 py-3 border border-border rounded-lg bg-background/50 backdrop-blur-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                              placeholder={t.enterEmail}
                            />
                          </div>
                        </div>
                      </div>

                      {/* 密码字段 */}
                      <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-foreground">
                          {t.password}
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur opacity-0 group-focus-within:opacity-30 transition-opacity duration-300"></div>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-primary z-[3]" />
                            <input
                              id="password"
                              type={showPassword ? 'text' : 'password'}
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full pl-12 pr-12 py-3 border border-border rounded-lg bg-background/50 backdrop-blur-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                              placeholder={t.enterPassword}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200"
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* 错误消息 */}
                      {loginError && (
                        <div className="relative">
                          <div className="relative bg-destructive/10 border border-destructive/30 rounded-lg p-4 ">
                            <p className="text-sm text-destructive font-medium">{loginError}</p>
                          </div>
                        </div>
                      )}

                      {/* 提交按钮 */}
                      <div className="relative">
                        <Button
                          type="submit"
                          disabled={loginLoading}
                          className="w-full relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {/* 按钮光效 */}
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                          
                          <div className="relative flex items-center justify-center">
                            {loginLoading ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-3"></div>
                                <span>{t.signingIn}</span>
                              </>
                            ) : (
                              <>
                                <span>{t.signIn}</span>
                              </>
                            )}
                          </div>
                        </Button>
                      </div>
                    </form>

                    {/* 底部装饰 */}
                    <div className="mt-6 text-center">
                      <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                        <div className="w-8 h-px bg-gradient-to-r from-transparent to-border"></div>
                        <span>{t.secureLogin}</span>
                        <div className="w-8 h-px bg-gradient-to-l from-transparent to-border"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If logged in but not admin, show unauthorized page
  if (authStatus.isLoggedIn && !authStatus.isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-8">
            <div className="mx-auto w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">{t.unauthorized}</h1>
            <p className="text-muted-foreground mb-6">
              {t.noAdminPrivileges}
              <br />
              {t.contactAdmin}
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={handleLogout}
              className="w-full"
              variant="outline"
            >
              {t.signOutCurrent}
            </Button>
            <Button 
              onClick={() => router.push('/')}
              className="w-full"
              variant="ghost"
            >
              {t.backToHome}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <h1 className="text-xl font-bold text-primary">{t.adminPanel}</h1>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="mt-6 px-3">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 mt-2 text-sm rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className='w-full'>
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Language switcher */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => changeLanguage(language === 'en' ? 'zh' : 'en')}
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">{language === 'en' ? 'EN' : '中文'}</span>
                </Button>
              </div>

             

              {/* User menu */}
              <div className="flex items-center gap-x-2">
                <span className="text-sm text-muted-foreground">
                  {adminUser?.email}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  title={t.logout}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

// Main layout component, providing Context
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminLanguageProvider>
      <AdminThemeProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </AdminThemeProvider>
    </AdminLanguageProvider>
  )
}