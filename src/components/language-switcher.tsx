"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { Locale, locales, localeNames } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Dictionary } from '@/lib/dictionaries';

interface LanguageSwitcherProps {
  currentLang: Locale;
  dict?: Dictionary;
}

export default function LanguageSwitcher({ currentLang, dict }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Remove current language prefix to get path
  const getPathWithoutLang = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0 && locales.includes(segments[0] as Locale)) {
      return '/' + segments.slice(1).join('/');
    }
    return pathname;
  };

  const basePath = getPathWithoutLang();

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

      // Save language preference to localStorage
  const handleLanguageChange = (locale: Locale) => {
    localStorage.setItem('preferred-language', locale);
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
        aria-label={dict?.common?.common?.switchLanguage || "Switch language"}
      >
        <span className="hidden sm:inline">{localeNames[currentLang]}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-background border border-border rounded-md shadow-lg min-w-[140px] z-50 overflow-hidden">
          {locales.map((locale) => (
            <Link
              key={locale}
              href={`/${locale}${basePath}`}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-muted hover:text-primary transition-colors border-b border-border last:border-b-0 ${
                locale === currentLang ? 'bg-muted/50 text-primary' : 'text-foreground'
              }`}
              onClick={() => handleLanguageChange(locale)}
              role="menuitem"
            >
              <span className="font-medium">{localeNames[locale]}</span>
              {locale === currentLang && (
                <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 