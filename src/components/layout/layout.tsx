"use client"

import React from 'react'
import { Header } from './header'
import { Footer } from './footer'
import { Dictionary } from '@/lib/dictionaries'
import { User } from '@/lib/auth'

interface LayoutProps {
  children: React.ReactNode
  className?: string
  dict?: Dictionary
  initialUser?: User | null
}

export function Layout({ children, className = '', dict, initialUser }: LayoutProps) {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      <Header dict={dict} initialUser={initialUser} />
      <main>
        {children}
      </main>
      <Footer dict={dict} />
    </div>
  )
} 