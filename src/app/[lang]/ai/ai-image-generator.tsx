"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import * as Select from '@radix-ui/react-select'
import {
  Check,
  ChevronDown,
  AlertCircle,
  Download,
  Image as ImageIcon
} from 'lucide-react'

interface ModelOption {
  value: string
  label: string
  description?: string
}

interface GeneratorConfig {
  title: string
  description: string
  modelLabel: string
  modelPlaceholder: string
  sizeLabel?: string
  sizePlaceholder?: string
  promptLabel: string
  promptPlaceholder: string
  generate: string
  generating: string
  resultTitle: string
  emptyStateTitle: string
  emptyStateDescription: string
  errorTitle: string
  errorDescription: string
  download: string
  retry: string
  safetyNote: string
  examplesTitle?: string
  examples?: Array<{ label: string; prompt: string }>
  sizes?: Array<{ value: string; label: string }>
  models: ModelOption[]
}

interface AIImageGeneratorProps {
  config: GeneratorConfig
}

const API_BASE =
  process.env.NEXT_PUBLIC_DEV === 'true' &&
  process.env.NEXT_PUBLIC_API_URL_DEV
    ? process.env.NEXT_PUBLIC_API_URL_DEV
    : ''

const buildApiUrl = (path: string) =>
  `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`

export function AIImageGenerator({ config }: AIImageGeneratorProps) {
  const [model, setModel] = useState(config.models[0]?.value ?? 'gpt-image-1')
  const [size, setSize] = useState(
    config.sizes?.[0]?.value ?? '1024x1024'
  )
  const [prompt, setPrompt] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!prompt.trim()) {
      setError(config.emptyStateDescription)
      return
    }

    setIsGenerating(true)
    setError(null)
    setImageUrl(null)

    try {
      const response = await fetch(buildApiUrl('/ai/generate-image'), {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          model,
          size
        })
      })

      if (!response.ok) {
        const errorJson = await response.json().catch(() => null)
        throw new Error(errorJson?.message || 'Request failed')
      }

      const data = await response.json()
      setImageUrl(data.imageUrl)
    } catch (err) {
      console.error('[AIImageGenerator] error', err)
      setError(config.errorDescription)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!imageUrl) return
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = 'ai-image.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const hasSizeOptions = (config.sizes?.length || 0) > 0

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
      {/* Main Container - 60vh height */}
      <div className="h-[60vh] grid grid-cols-2 gap-6">
        {/* Left: Parameters Section */}
        <div className="h-full overflow-y-auto p-6">
          <form className="space-y-6" onSubmit={handleGenerate}>
            <div>
              <div className="mb-4 flex items-center justify-between h-6">
                <label className="text-sm font-medium text-foreground leading-6">
                  {config.promptLabel}
                </label>
                <Button
                  type="submit"
                  size="sm"
                  variant="outline"
                  className="h-8 px-3 text-xs"
                  loading={isGenerating}
                  icon={ImageIcon}
                >
                  {isGenerating ? config.generating : 'Generate'}
                </Button>
              </div>
              <textarea
                className="h-32 w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={config.promptPlaceholder}
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
              />
            </div>

            {hasSizeOptions && (
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  {config.sizeLabel}
                </label>
                <Select.Root value={size} onValueChange={setSize}>
                  <Select.Trigger className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-4 py-2 text-left text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary data-[state=open]:[&>div>svg]:rotate-180">
                    <span className={size ? '' : 'text-muted-foreground'}>
                      {
                        config.sizes?.find(
                          (sizeOption) => sizeOption.value === size
                        )?.label || config.sizePlaceholder
                      }
                    </span>
                    <Select.Icon className="ml-2">
                      <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Content 
                    className="z-50 w-[var(--radix-select-trigger-width)] rounded-lg border border-border bg-background shadow-lg ring-1 ring-black/5 focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
                    position="popper"
                    sideOffset={2}
                  >
                    <Select.Viewport>
                      {config.sizes?.map((option, index) => {
                        const isFirst = index === 0
                        const isLast = index === (config.sizes?.length ?? 0) - 1
                        const roundedClass = isFirst ? 'rounded-t-lg' : isLast ? 'rounded-b-lg' : ''
                        return (
                          <Select.Item
                            key={option.value}
                            value={option.value}
                            className={`relative cursor-pointer select-none ${roundedClass} px-4 py-2 text-sm outline-none border-none data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary`}
                          >
                            <span className="font-medium">{option.label}</span>
                            <Select.ItemIndicator className="absolute inset-y-0 right-0 flex items-center pr-2 text-primary">
                              <Check className="h-4 w-4" />
                            </Select.ItemIndicator>
                          </Select.Item>
                        )
                      })}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Root>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                {config.modelLabel}
              </label>
              <Select.Root value={model} onValueChange={setModel}>
                <Select.Trigger className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-4 py-1.5 text-left text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary h-9 data-[state=open]:[&>div>svg]:rotate-180">
                  <span className={model ? '' : 'text-muted-foreground'}>
                    {
                      config.models.find(
                        (modelOption) => modelOption.value === model
                      )?.label || config.modelPlaceholder
                    }
                  </span>
                  <Select.Icon className="ml-2">
                    <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Content 
                  className="z-50 w-[var(--radix-select-trigger-width)] rounded-lg border border-border bg-background shadow-lg ring-1 ring-black/5 focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
                  position="popper"
                  sideOffset={2}
                >
                  <Select.Viewport>
                    {config.models.map((option, index) => {
                      const isFirst = index === 0
                      const isLast = index === config.models.length - 1
                      const roundedClass = isFirst ? 'rounded-t-lg' : isLast ? 'rounded-b-lg' : ''
                      return (
                        <Select.Item
                          key={option.value}
                          value={option.value}
                          className={`relative cursor-pointer select-none ${roundedClass} px-4 py-2 text-sm outline-none border-none data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary`}
                        >
                          <span className="font-medium">{option.label}</span>
                          <Select.ItemIndicator className="absolute inset-y-0 right-0 flex items-center pr-2 text-primary">
                            <Check className="h-4 w-4" />
                          </Select.ItemIndicator>
                        </Select.Item>
                      )
                    })}
                  </Select.Viewport>
                </Select.Content>
              </Select.Root>
            </div>

          </form>

          {error && (
            <div className="mt-4 flex items-center rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="mr-2 h-4 w-4" />
              {error}
            </div>
          )}
        </div>

        {/* Right: Result Section */}
        <div className="h-full flex flex-col p-6">
          <div className="mb-4 flex items-center justify-between h-6">
            <p className="text-sm font-medium text-foreground leading-6">
              {config.resultTitle}
            </p>
            {imageUrl && (
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => setImageUrl(null)}
              >
                {config.retry}
              </Button>
            )}
          </div>

          <div className="flex-1 flex items-center justify-center rounded-xl border border-dashed border-border/70 p-4 overflow-hidden">
            {imageUrl ? (
              <div className="w-full h-full flex flex-col space-y-4">
                <div className="flex-1 flex items-center justify-center overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={prompt}
                    className="max-w-full max-h-full rounded-lg object-contain"
                  />
                </div>
                <Button
                  className="w-full"
                  variant="outline"
                  type="button"
                  onClick={handleDownload}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {config.download}
                </Button>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <ImageIcon className="mx-auto mb-4 h-12 w-12" />
                <p className="text-sm">{config.emptyStateDescription}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

