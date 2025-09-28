"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Sun, Moon, User, LogOut } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Dictionary } from '@/lib/dictionaries'
import { Locale } from '@/lib/i18n'
import LanguageSwitcher from '@/components/language-switcher'
import { useAuth } from '@/contexts/AuthContext'
import { User as UserType } from '@/lib/auth'

interface HeaderProps {
  dict?: Dictionary
  initialUser?: UserType | null
}

export function Header({ dict, initialUser }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<UserType | null>(initialUser || null)
  const [loading, setLoading] = useState(!initialUser)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  
  // Extract current language from path
  const currentLang = (pathname.split('/')[1] || 'en') as Locale
  
  // 获取认证状态 - 只有在没有初始用户时才获取
  const { user: authUser, loading: authLoading, signOut } = useAuth()
  
  // 同步认证状态
  useEffect(() => {
    if (initialUser !== undefined) {
      // 如果有初始用户状态（来自服务端），直接使用
      setUser(initialUser)
      setLoading(false)
    } else {
      // 如果没有初始用户状态（静态页面），使用客户端认证状态
      setUser(authUser)
      setLoading(authLoading)
    }
  }, [initialUser, authUser, authLoading])
  
  // Use default values if dict is not provided
  const siteInfo = dict?.site || {
    name: "EdgeOne Saas Starter"
  }
  const headerConfig = dict?.header || {
    navigation: [],
    cta: { text: "Get Started", href: "/pricing" }
  }

  // Add language prefix to navigation links
  const getLocalizedHref = (href: string) => {
    if (href === '/') {
      return `/${currentLang}`
    }
    return `/${currentLang}${href}`
  }

  // Check if link is current page
  const isActive = (href: string) => {
    const localizedHref = getLocalizedHref(href)
    if (href === '/') {
      // For homepage, need exact match to avoid false positives with other pages
      return pathname === localizedHref || pathname === `${localizedHref}/`
    }
    // For other pages, use startsWith matching
    return pathname.startsWith(localizedHref) && pathname !== `/${currentLang}` && pathname !== `/${currentLang}/`
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href={getLocalizedHref('/')} className="text-2xl font-bold text-primary">
              {siteInfo.name}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {headerConfig.navigation.map((item) => (
              <Link
                key={item.name}
                href={getLocalizedHref(item.href)}
                 className={`transition-colors duration-200 whitespace-nowrap ${
                  isActive(item.href)
                    ? 'text-primary font-semibold border-b-2 border-primary'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <LanguageSwitcher currentLang={currentLang} dict={dict} />
            
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={dict?.common?.common?.toggleTheme || "Toggle theme"}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Auth Buttons */}
            {loading ? (
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : user ? (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  href={getLocalizedHref('/profile')}
                  className="text-sm text-gray-600 hover:text-primary transition-colors cursor-pointer"
                >
                  {dict?.auth?.user?.welcome || 'Welcome back'}, {user.email}
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={signOut}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{dict?.auth?.user?.signOut || 'Sign Out'}</span>
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  href={getLocalizedHref('/login')}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {dict?.auth?.login?.signInButton || 'Sign In'}
                </Link>
                <Link
                  href={getLocalizedHref('/signup')}
                  className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
                >
                  {dict?.auth?.signup?.signUpButton || 'Sign Up'}
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              {headerConfig.navigation.map((item) => (
                <Link
                  key={item.name}
                  href={getLocalizedHref(item.href)}
                  className={`transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-primary font-semibold bg-primary/10 px-3 py-2 rounded-md'
                      : 'text-foreground hover:text-primary px-3 py-2'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Language Switcher */}
              <div className="px-3 py-2">
                <LanguageSwitcher currentLang={currentLang} dict={dict} />
              </div>
              
              {/* Mobile Auth Buttons */}
              {loading ? (
                <div className="px-3 py-2">
                  <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ) : user ? (
                <div className="px-3 py-2 space-y-2">
                  <Link
                    href={getLocalizedHref('/profile')}
                    className="block text-sm text-gray-600 text-center hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {dict?.auth?.user?.welcome || 'Welcome back'}, {user.email}
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      signOut()
                      setIsMenuOpen(false)
                    }}
                    className="w-full flex items-center justify-center space-x-1"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{dict?.auth?.user?.signOut || 'Sign Out'}</span>
                  </Button>
                </div>
              ) : (
                <div className="px-3 py-2 space-y-2">
                  <Link
                    href={getLocalizedHref('/login')}
                    className="block text-center text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {dict?.auth?.login?.signInButton || 'Sign In'}
                  </Link>
                  <Link
                    href={getLocalizedHref('/signup')}
                    className="block bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors text-center whitespace-nowrap"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {dict?.auth?.signup?.signUpButton || 'Sign Up'}
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
} 