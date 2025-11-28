"use client"

import { useState, useEffect } from 'react'
import * as Select from '@radix-ui/react-select'
import { Check, ChevronDown, AlertCircle } from 'lucide-react'
import { modelOptions } from '@/lib/ai-models'

interface ModelSelectorProps {
  value: string
  onChange: (value: string) => void
  label: string
  placeholder: string
  modelNotConfiguredText?: string
}

interface ModelStatus {
  value: string
  label: string
  configured: boolean
}

// Use Next.js API Route in development, or Node Functions in production
const buildApiUrl = (path: string) => {
  const apiPath = path.startsWith('/') ? path : `/${path}`
  const API_BASE = process.env.NEXT_PUBLIC_API_URL_DEV
  if (API_BASE && API_BASE.trim() !== '') {
    return `${API_BASE}${apiPath}`
  }
  return `/api${apiPath}`
}

export function ModelSelector({ value, onChange, label, placeholder, modelNotConfiguredText }: ModelSelectorProps) {
  const [open, setOpen] = useState(false)
  const [modelStatuses, setModelStatuses] = useState<ModelStatus[]>([])
  const [availableModels, setAvailableModels] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Fetch model configuration status
    fetch(buildApiUrl('/ai/models'))
      .then(res => res.json())
      .then(data => {
        if (data.models) {
          setModelStatuses(data.models)
          setAvailableModels(new Set(data.available || []))
        }
      })
      .catch(err => {
        console.error('[ModelSelector] Failed to fetch model statuses:', err)
        // Fallback: assume all models are available
        const allModels = modelOptions.map(opt => ({ value: opt.value, label: opt.label, configured: true }))
        setModelStatuses(allModels)
        setAvailableModels(new Set(modelOptions.map(opt => opt.value)))
      })
  }, [])

  // Create a map of model statuses for quick lookup
  const modelStatusMap = new Map(modelStatuses.map(m => [m.value, m]))
  
  // Use modelStatuses if available, otherwise fallback to modelOptions
  const modelsToDisplay = modelStatuses.length > 0 
    ? modelStatuses 
    : modelOptions.map(opt => ({ value: opt.value, label: opt.label, configured: true }))

  const handleValueChange = (newValue: string) => {
    const isConfigured = availableModels.has(newValue)
    if (isConfigured) {
      onChange(newValue)
    }
    // If not configured, don't allow selection
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-foreground">
        {label}
      </label>
      <Select.Root value={value} onValueChange={handleValueChange} open={open} onOpenChange={setOpen}>
        <Select.Trigger className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-4 py-1.5 text-left text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary h-9">
          <Select.Value placeholder={placeholder} />
          <Select.Icon className="ml-2">
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
          </Select.Icon>
        </Select.Trigger>
        <Select.Content 
          className="z-50 w-[var(--radix-select-trigger-width)] rounded-lg border border-border bg-background shadow-lg ring-1 ring-black/5 focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
          position="popper"
          sideOffset={2}
        >
          <Select.Viewport>
            {modelsToDisplay.map((model, index) => {
              const isFirst = index === 0
              const isLast = index === modelsToDisplay.length - 1
              const roundedClass = isFirst ? 'rounded-t-lg' : isLast ? 'rounded-b-lg' : ''
              const isConfigured = availableModels.has(model.value) || model.configured
              const isDisabled = !isConfigured
              
              return (
                <Select.Item
                  key={model.value}
                  value={model.value}
                  disabled={isDisabled}
                  className={`relative select-none ${roundedClass} px-4 py-2 text-sm outline-none border-none ${
                    isDisabled 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'cursor-pointer data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary'
                  }`}
                >
                  <Select.ItemText>
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${isDisabled ? 'text-muted-foreground' : ''}`}>
                        {model.label}
                      </span>
                      {isDisabled && (
                        <span className="ml-2 text-xs text-muted-foreground flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {modelNotConfiguredText || 'Not configured'}
                        </span>
                      )}
                    </div>
                  </Select.ItemText>
                  {isConfigured && (
                    <Select.ItemIndicator className="absolute inset-y-0 right-0 flex items-center pr-2 text-primary">
                      <Check className="h-4 w-4" />
                    </Select.ItemIndicator>
                  )}
                </Select.Item>
              )
            })}
          </Select.Viewport>
        </Select.Content>
      </Select.Root>
    </div>
  )
}

