"use client";

import React, { useEffect, useRef } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminLanguage } from '@/lib/admin-language-context';

const languageNames = {
  en: 'English',
  zh: '中文'
} as const;

const languages = ['en', 'zh'] as const;

export default function AdminLanguageSwitcher() {
  const { language, changeLanguage } = useAdminLanguage();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to close dropdown menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageChange = (lang: 'en' | 'zh') => {
    changeLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-muted/50 hover:text-primary"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Switch language"
      >
        <span className="hidden sm:inline">{languageNames[language]}</span>
        <span className="sm:hidden">{language.toUpperCase()}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-background border border-border rounded-md shadow-lg min-w-[140px] z-50 overflow-hidden">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-muted hover:text-primary transition-colors border-b border-border last:border-b-0 ${
                lang === language ? 'bg-muted/50 text-primary' : 'text-foreground'
              }`}
              role="menuitem"
            >
              <span className="font-medium">{languageNames[lang]}</span>
              {lang === language && (
                <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}