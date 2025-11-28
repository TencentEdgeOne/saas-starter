"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { locales, defaultLocale } from '@/lib/i18n';
import { getDictionary } from '@/lib/dictionaries';

export default function RootPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Detect browser language
  const detectLanguage = async () => {
    // Try to get user's previously selected language from localStorage
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && locales.includes(savedLanguage as any)) {
      return savedLanguage;
    }

    // Get browser language settings
    const browserLanguage = navigator.language;
    
    // Handle 'zh-CN', 'zh-TW' variants, unify to 'zh'
    const normalizedLanguage = browserLanguage.startsWith('zh') ? 'zh' : browserLanguage.split('-')[0];
    
    // Check if this language is supported
    if (locales.includes(normalizedLanguage as any)) {
      return normalizedLanguage;
    }

    // If no matching language, return default language
    return defaultLocale;
  };

  // Async load corresponding language dictionary text
  const loadLanguage = async () => {
    try {
      const detectedLang = await detectLanguage();
      
      // Preload dictionary to ensure smooth transition
      await getDictionary(detectedLang as any);
      
      // Save detected language to localStorage
      localStorage.setItem('preferred-language', detectedLang);
      
      // Jump to detected language page
      router.replace(`/${detectedLang}`);
    } catch (error) {
      console.error('Language detection failed:', error);
      router.replace(`/${defaultLocale}`);
    }
  };

  useEffect(() => {
    loadLanguage();
  }, []);

  // Show loading state
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
} 