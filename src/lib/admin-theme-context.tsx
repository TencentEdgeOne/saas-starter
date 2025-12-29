"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// 定义3种颜色主题
export type ThemeName = 'purple' | 'blue' | 'green'

interface ThemeColors {
  primary: string
  primaryDark: string
  accent: string
  accentDark: string
  gradient: string
  gradientDark: string
}

// 3种主题配置
export const themes: Record<ThemeName, ThemeColors> = {
  purple: {
    primary: '260 51% 48%', // #673AB7
    primaryDark: '257 59% 60%', // #512DA8
    accent: '257 100% 65%', // #7C4DFF
    accentDark: '257 100% 65%',
    gradient: 'linear-gradient(135deg, #673AB7 0%, #512DA8 100%)',
    gradientDark: 'linear-gradient(135deg, #4527a0 0%, #311b92 100%)'
  },
  blue: {
    primary: '217 91% 60%', // #3B82F6
    primaryDark: '213 94% 68%', // #60A5FA
    accent: '212 100% 70%', // #4F46E5
    accentDark: '212 100% 70%',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
    gradientDark: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)'
  },
  green: {
    primary: '142 76% 36%', // #16A34A
    primaryDark: '142 71% 45%', // #22C55E
    accent: '160 84% 39%', // #059669
    accentDark: '160 84% 39%',
    gradient: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
    gradientDark: 'linear-gradient(135deg, #14532D 0%, #166534 100%)'
  }
}

interface AdminThemeContextType {
  theme: ThemeName
  changeTheme: (theme: ThemeName) => void
  applyTheme: (theme: ThemeName) => void
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined)

interface AdminThemeProviderProps {
  children: ReactNode
}

export function AdminThemeProvider({ children }: AdminThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeName>('purple')

  // 应用主题到CSS变量
  const applyTheme = (themeName: ThemeName) => {
    const themeColors = themes[themeName]
    const root = document.documentElement

    // 更新CSS变量
    root.style.setProperty('--primary', themeColors.primary)
    root.style.setProperty('--primary-dark', themeColors.primaryDark)
    root.style.setProperty('--accent', themeColors.accent)
    root.style.setProperty('--accent-dark', themeColors.accentDark)
    
    // 更新渐变背景
    const gradientElements = document.querySelectorAll('.gradient-bg')
    gradientElements.forEach(el => {
      ;(el as HTMLElement).style.background = themeColors.gradient
    })

    const gradientDarkElements = document.querySelectorAll('.gradient-bg-dark')
    gradientDarkElements.forEach(el => {
      ;(el as HTMLElement).style.background = themeColors.gradientDark
    })
  }

  useEffect(() => {
    // 从 localStorage 读取保存的主题设置
    const saved = localStorage.getItem('admin-theme')
    if (saved && (saved === 'purple' || saved === 'blue' || saved === 'green')) {
      setTheme(saved)
      applyTheme(saved)
    } else {
      // 默认应用紫色主题
      applyTheme('purple')
    }
  }, [])

  const changeTheme = (newTheme: ThemeName) => {
    setTheme(newTheme)
    localStorage.setItem('admin-theme', newTheme)
    applyTheme(newTheme)
    
    // 触发自定义事件，通知其他组件主题已更改
    window.dispatchEvent(new CustomEvent('admin-theme-changed', { detail: newTheme }))
  }

  return (
    <AdminThemeContext.Provider value={{ theme, changeTheme, applyTheme }}>
      {children}
    </AdminThemeContext.Provider>
  )
}

export function useAdminTheme() {
  const context = useContext(AdminThemeContext)
  if (context === undefined) {
    throw new Error('useAdminTheme must be used within an AdminThemeProvider')
  }
  return context
}

// 主题预览组件
export function ThemePreview({ theme, isSelected, onClick }: { 
  theme: ThemeName
  isSelected: boolean
  onClick: () => void 
}) {
  const themeColors = themes[theme]
  
  return (
    <div
      className={`relative cursor-pointer rounded-lg p-3 border-2 transition-all ${
        isSelected 
          ? 'border-primary shadow-md' 
          : 'border-border hover:border-muted-foreground'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div className="flex space-x-1">
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: `hsl(${themeColors.primary})` }}
          />
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: `hsl(${themeColors.accent})` }}
          />
        </div>
        <span className="text-sm font-medium capitalize">{theme}</span>
      </div>
    </div>
  )
}