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
import { ImageHistoryCarousel } from './components/image-history-carousel'

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

// Use Next.js API Route in development, or Node Functions in production
const buildApiUrl = (path: string) => {
  // Always use /api prefix for Next.js API routes
  const apiPath = path.startsWith('/') ? path : `/${path}`
  
  // Check if we have a production API base URL
  const API_BASE = process.env.NEXT_PUBLIC_API_URL_DEV
  
  // If API_BASE is set, use it (production with EdgeOne Node Functions)
  if (API_BASE && API_BASE.trim() !== '') {
    return `${API_BASE}${apiPath}`
  }
  
  // Otherwise, use Next.js API routes (development or standard Next.js deployment)
  return `/api${apiPath}`
}

const GENERATION_TIMEOUT_MS = 30_000;

export function AIImageGenerator({ config }: AIImageGeneratorProps) {
  // Default to FAL/FLUX Schnell (first option)
  const defaultModel = modelOptions[0]?.value ?? 'fal-ai/flux/schnell'
  const [model, setModel] = useState(defaultModel)
  const [size, setSize] = useState(getDefaultSize(defaultModel))
  const [availableSizes, setAvailableSizes] = useState<string[]>(getSupportedSizes(defaultModel))
  const [prompt, setPrompt] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageHistory, setImageHistory] = useState<Array<{ imageUrl: string; prompt: string }>>([])

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

    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null
    const timeoutId = controller
      ? window.setTimeout(() => {
          controller.abort()
        }, GENERATION_TIMEOUT_MS)
      : null

    try {
      const response = await fetch(buildApiUrl('/ai'), {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        signal: controller?.signal,
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
      
      // Add to history
      setImageHistory(prev => [
        { imageUrl: data.imageUrl, prompt: prompt },
        ...prev
      ])
    } catch (err) {
      console.error('[AIImageGenerator] error', err)
      if ((err as DOMException)?.name === 'AbortError') {
        setError(config.errorDescription || 'Image generation timed out. Please try again.')
      } else {
        setError(config.errorDescription)
      }
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
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

  const handleHistoryImageClick = (imageUrl: string) => {
    // Find the corresponding prompt for this image
    const historyItem = imageHistory.find(item => item.imageUrl === imageUrl)
    if (historyItem) {
      setImageUrl(imageUrl)
      setPrompt(historyItem.prompt)
      setError(null)
    } else {
      setImageUrl(imageUrl)
      setError(null)
    }
  }


  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
      {/* Main Container - increased height for better image display */}
      <div className="h-[70vh] grid grid-cols-2 gap-6">
        {/* Left: Parameters Section */}
        <div className="h-full flex flex-col p-6">
          <form className="flex-1 flex flex-col min-h-0" onSubmit={handleGenerate}>
            <div className="mb-4 flex items-center justify-between h-6 flex-shrink-0 gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <label className="text-sm font-medium text-foreground leading-6 flex-shrink-0">
                  {config.promptLabel}
                </label>
                <ErrorMessage message={error || ''} inline />
              </div>
              <Button
                type="submit"
                size="sm"
                variant="outline"
                className="h-8 px-3 text-xs flex-shrink-0"
                loading={isGenerating}
                icon={ImageIcon}
                disabled={!prompt.trim() || isGenerating}
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
              hasError={!!error}
            />

            <div className={`space-y-8 flex-shrink-0 ${error ? '' : 'mt-auto'}`}>
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

          {/* Carousel at the bottom of left div */}
          {imageHistory.length >= 2 && (
            <div className="flex-shrink-0 mt-auto pt-4">
              <ImageHistoryCarousel
                images={imageHistory}
                onImageClick={handleHistoryImageClick}
              />
            </div>
          )}
        </div>

        {/* Right: Result Section */}
        <ImageResult
          imageUrl={imageUrl}
          prompt={prompt}
          resultTitle={config.resultTitle}
          emptyStateDescription={config.emptyStateDescription}
          downloadText={config.download}
          onDownload={handleDownload}
          isGenerating={isGenerating}
          hasError={!!error}
        />
      </div>
    </div>
  )
}

