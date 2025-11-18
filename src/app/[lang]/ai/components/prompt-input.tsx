"use client"

import { Button } from '@/components/ui/button'
import { Image as ImageIcon } from 'lucide-react'

interface PromptInputProps {
  value: string
  onChange: (value: string) => void
  label: string
  placeholder: string
  generateText: string
  generatingText: string
  isGenerating: boolean
  hasError?: boolean
}

export function PromptInput({
  value,
  onChange,
  label,
  placeholder,
  generateText,
  generatingText,
  isGenerating,
  hasError = false
}: PromptInputProps) {
  return (
    <div className={`flex flex-col min-h-0 mb-6 transition-all duration-300 ease-out ${hasError ? 'flex-[0.9]' : 'flex-1'}`}>
      {label && (
        <div className="mb-4 flex items-center justify-between h-6 flex-shrink-0">
          <label className="text-sm font-medium text-foreground leading-6">
            {label}
          </label>
          <Button
            type="submit"
            size="sm"
            variant="outline"
            className="h-8 px-3 text-xs"
            loading={isGenerating}
            icon={ImageIcon}
          >
            {isGenerating ? generatingText : 'Generate'}
          </Button>
        </div>
      )}
      <textarea
        className="flex-1 w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground focus:outline-none focus:ring-1 focus:ring-primary min-h-0"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

