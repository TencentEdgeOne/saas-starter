"use client"

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

import type { FAQ } from '@/types/faq'

interface FAQListProps {
  faqs: FAQ[]
  className?: string
  allowMultipleOpen?: boolean
}

export function FAQItem({ 
  faq, 
  isOpen, 
  onToggle 
}: { 
  faq: FAQ
  isOpen: boolean
  onToggle: () => void 
}) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        className="w-full px-6 py-4 text-left bg-card hover:bg-muted/50 transition-colors duration-200 flex items-center justify-between"
        onClick={onToggle}
      >
        <span className="font-medium text-foreground pr-8">
          {faq.question}
        </span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        )}
      </button>
      
      {isOpen && (
        <div className="px-6 py-4 bg-card">
          <p className="text-muted-foreground leading-relaxed">
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  )
}

export function FAQList({ 
  faqs, 
  className = '',
  allowMultipleOpen = false 
}: FAQListProps) {
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set())
  
  const toggleFAQ = (index: number) => {
    setOpenIndexes(prev => {
      const newSet = new Set(prev)
      
      if (allowMultipleOpen) {
        // Allow multiple FAQs to be open
        if (newSet.has(index)) {
          newSet.delete(index)
        } else {
          newSet.add(index)
        }
      } else {
        // Only allow one FAQ to be open
        if (newSet.has(index)) {
          newSet.clear()
        } else {
          newSet.clear()
          newSet.add(index)
        }
      }
      
      return newSet
    })
  }
  
  return (
    <div className={`space-y-4 ${className}`}>
      {faqs.map((faq, index) => (
        <FAQItem
          key={index}
          faq={faq}
          isOpen={openIndexes.has(index)}
          onToggle={() => toggleFAQ(index)}
        />
      ))}
    </div>
  )
} 