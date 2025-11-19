"use client"

import { AlertCircle } from 'lucide-react'

interface ErrorMessageProps {
  message: string
  inline?: boolean
}

export function ErrorMessage({ message, inline = false }: ErrorMessageProps) {
  if (!message) return null

  if (inline) {
    return (
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 text-destructive" />
        <span 
          className="text-xs text-destructive truncate" 
          title={message}
        >
          {message}
        </span>
      </div>
    )
  }

  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-destructive/30 bg-destructive/10">
      <div className="animate-slide-up flex items-center px-3 py-2 text-sm text-destructive">
        <AlertCircle className="mr-2 h-4 w-4 flex-shrink-0" />
        <span title={message}>{message}</span>
      </div>
    </div>
  )
}

