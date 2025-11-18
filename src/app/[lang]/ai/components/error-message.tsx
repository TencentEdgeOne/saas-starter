"use client"

import { AlertCircle } from 'lucide-react'

interface ErrorMessageProps {
  message: string
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null

  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-destructive/30 bg-destructive/10">
      <div className="animate-slide-up flex items-center px-3 py-2 text-sm text-destructive">
        <AlertCircle className="mr-2 h-4 w-4 flex-shrink-0" />
        <span>{message}</span>
      </div>
    </div>
  )
}

