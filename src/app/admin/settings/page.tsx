"use client"

// Force dynamic rendering for admin pages
export const dynamic = 'force-dynamic'

import React, { useState, useEffect } from 'react'
import { Save, Globe, Palette, Shield, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAdminLanguage, adminTexts } from '@/lib/admin-language-context'
import { useAdminTheme, ThemePreview, type ThemeName } from '@/lib/admin-theme-context'

export default function SettingsPage() {
  const { language, changeLanguage } = useAdminLanguage()
  const { theme, changeTheme } = useAdminTheme()
  const t = adminTexts[language]
  
  const [selectedLanguage, setSelectedLanguage] = useState(language)
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>(theme)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  // Listen for language changes, sync selected state
  useEffect(() => {
    setSelectedLanguage(language)
  }, [language])

  // Listen for theme changes, sync selected state
  useEffect(() => {
    setSelectedTheme(theme)
  }, [theme])

  // Listen for language change events
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setSelectedLanguage(event.detail)
    }

    const handleThemeChange = (event: CustomEvent) => {
      setSelectedTheme(event.detail)
    }

    window.addEventListener('admin-language-changed', handleLanguageChange as EventListener)
    window.addEventListener('admin-theme-changed', handleThemeChange as EventListener)
    
    return () => {
      window.removeEventListener('admin-language-changed', handleLanguageChange as EventListener)
      window.removeEventListener('admin-theme-changed', handleThemeChange as EventListener)
    }
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSaveMessage('')
    
    // Simulate save process
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Save language settings and apply immediately
    if (selectedLanguage !== language) {
      changeLanguage(selectedLanguage)
    }
    
    // Save theme settings and apply immediately
    if (selectedTheme !== theme) {
      changeTheme(selectedTheme)
    }
    
    setSaving(false)
    setSaveMessage(t.saved)
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSaveMessage('')
    }, 3000)
  }

  const settingSections = [
    {
      title: t.language,
      description: t.languageDesc,
      icon: Globe,
      content: (
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="language"
              value="en"
              checked={selectedLanguage === 'en'}
              onChange={(e) => setSelectedLanguage(e.target.value as 'en' | 'zh')}
              className="w-4 h-4 text-primary border-border focus:ring-primary"
            />
            <span className="text-sm text-foreground">{t.english}</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="language"
              value="zh"
              checked={selectedLanguage === 'zh'}
              onChange={(e) => setSelectedLanguage(e.target.value as 'en' | 'zh')}
              className="w-4 h-4 text-primary border-border focus:ring-primary"
            />
            <span className="text-sm text-foreground">{t.chinese}</span>
          </label>
        </div>
      )
    },
    {
      title: t.theme,
      description: t.themeDesc,
      icon: Palette,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <ThemePreview
              theme="purple"
              isSelected={selectedTheme === 'purple'}
              onClick={() => setSelectedTheme('purple')}
            />
            <ThemePreview
              theme="blue"
              isSelected={selectedTheme === 'blue'}
              onClick={() => setSelectedTheme('blue')}
            />
            <ThemePreview
              theme="green"
              isSelected={selectedTheme === 'green'}
              onClick={() => setSelectedTheme('green')}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            {language === 'zh' 
              ? '选择您喜欢的颜色主题，更改将立即应用到整个管理面板。' 
              : 'Choose your preferred color theme. Changes will be applied immediately to the entire admin panel.'
            }
          </div>
        </div>
      )
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t.settings}</h1>
          <p className="text-muted-foreground mt-2">{t.systemSettings}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Success message */}
          {saveMessage && (
            <div className="bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md px-3 py-2">
              <p className="text-sm text-green-800 dark:text-green-400">{saveMessage}</p>
            </div>
          )}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save className={`h-4 w-4 ${saving ? 'animate-pulse' : ''}`} />
            {saving ? (language === 'zh' ? '保存中...' : 'Saving...') : t.save}
          </Button>
        </div>
      </div>

      {/* Settings sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingSections.map((section) => {
          const Icon = section.icon
          return (
            <div
              key={section.title}
              className="bg-card rounded-lg border border-border p-6 shadow-sm"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {section.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {section.description}
                  </p>
                  {section.content}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      
    </div>
  )
}