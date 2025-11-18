"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Image as ImageIcon } from 'lucide-react'
import { modelOptions, getSupportedSizes, getDefaultSize } from '@/lib/ai-models'
import { ModelSelector } from './components/model-selector'
import { SizeSelector } from './components/size-selector'
import { PromptInput } from './components/prompt-input'
import { ImageResult } from './components/image-result'
import { ErrorMessage } from './components/error-message'

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
  const [model, setModel] = useState(modelOptions[0]?.value ?? 'dall-e-3')
  const [size, setSize] = useState(getDefaultSize(modelOptions[0]?.value ?? 'dall-e-3'))
  const [availableSizes, setAvailableSizes] = useState<string[]>(getSupportedSizes(modelOptions[0]?.value ?? 'dall-e-3'))
  const [prompt, setPrompt] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Update available sizes when model changes
  useEffect(() => {
    const sizes = getSupportedSizes(model)
    setAvailableSizes(sizes)
    // Update size to default for new model if current size is not supported
    const currentSize = size
    if (!sizes.includes(currentSize)) {
      setSize(getDefaultSize(model))
    }
  }, [model]) // eslint-disable-line react-hooks/exhaustive-deps

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


  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
      {/* Main Container - 60vh height */}
      <div className="h-[60vh] grid grid-cols-2 gap-6">
        {/* Left: Parameters Section */}
        <div className="h-full flex flex-col p-6">
          <form className="flex-1 flex flex-col min-h-0" onSubmit={handleGenerate}>
            <div className="mb-4 flex items-center justify-between h-6 flex-shrink-0">
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
            
            <PromptInput
              value={prompt}
              onChange={setPrompt}
              label=""
              placeholder={config.promptPlaceholder}
              generateText={config.generate}
              generatingText={config.generating}
              isGenerating={isGenerating}
            />

            <div className="mt-auto space-y-6 flex-shrink-0">
              <ModelSelector
                value={model}
                onChange={setModel}
                label={config.modelLabel}
                placeholder={config.modelPlaceholder}
              />

              <SizeSelector
                value={size}
                onChange={setSize}
                availableSizes={availableSizes}
                label={config.sizeLabel || 'Image Size'}
                placeholder={config.sizePlaceholder || 'Select image size'}
              />
            </div>
          </form>

          <ErrorMessage message={error || ''} />
        </div>

        {/* Right: Result Section */}
        <ImageResult
          imageUrl={imageUrl}
          prompt={prompt}
          resultTitle={config.resultTitle}
          emptyStateDescription={config.emptyStateDescription}
          downloadText={config.download}
          retryText={config.retry}
          onDownload={handleDownload}
          onRetry={() => setImageUrl(null)}
        />
      </div>
    </div>
  )
}

