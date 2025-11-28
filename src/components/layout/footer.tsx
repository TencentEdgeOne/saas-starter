"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'
import { Dictionary } from '@/lib/dictionaries'

interface FooterProps {
  dict?: Dictionary
}

export function Footer({ dict }: FooterProps) {
  const [currentYear, setCurrentYear] = useState(2024) // Default year to avoid hydration errors
  const pathname = usePathname()
  
  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])
  
  // Extract current language from path
  const currentLang = pathname.split('/')[1] || 'en'
  
  // Use default values if dict is not provided
  const siteInfo = dict?.site || {
    name: "EdgeOne Saas Starter",
    description: "A modern SaaS starter template",
    copyright: "EdgeOne Saas Starter. All rights reserved.",
    tagline: "Made with ❤️ for developers worldwide"
  }
  const socialLinks = dict?.social || []
  const footerConfig = dict?.footer || { sections: [] }
  
  // Add language prefix to navigation links
  const getLocalizedHref = (href: string) => {
    if (href === '/') {
      return `/${currentLang}`
    }
    return `/${currentLang}${href}`
  }
  
  // Icon mapping
  const iconMap = {
    Github,
    Twitter,
    Linkedin,
    Mail
  } as const

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href={getLocalizedHref('/')} className="text-2xl font-bold text-primary mb-4 block">
              {siteInfo.name}
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              {siteInfo.description}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const IconComponent = iconMap[social.icon as keyof typeof iconMap]
                return (
                  <a
                    key={index}
                    href={social.url}
                    target={social.url.startsWith('mailto:') ? undefined : '_blank'}
                    rel={social.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={social.name}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Footer Sections */}
          {footerConfig.sections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-foreground mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href={getLocalizedHref(link.href)} className="text-muted-foreground hover:text-primary transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} {siteInfo.copyright}
          </p>
          <p className="text-muted-foreground text-sm mt-2 sm:mt-0">
            {siteInfo.tagline}
          </p>
        </div>
      </div>
    </footer>
  )
} 