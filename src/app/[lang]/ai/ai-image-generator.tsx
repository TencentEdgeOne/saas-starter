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
  const [creditsBalance, setCreditsBalance] = useState<number | null>(null)
  const [isCheckingCredits, setIsCheckingCredits] = useState(false)
  const [hasEnoughCredits, setHasEnoughCredits] = useState<boolean | null>(null)
  const [balanceError, setBalanceError] = useState<string | null>(null)
  const [creditCost, setCreditCost] = useState<number>(1)
  const [isFetchingCost, setIsFetchingCost] = useState<boolean>(true)

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

  useEffect(() => {
    fetchCreditCost()
    fetchCreditsBalance()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    updateCreditAvailability(creditsBalance, creditCost)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creditCost])

  const updateCreditAvailability = (balance: number | null, cost: number) => {
    if (balance === null) {
      setHasEnoughCredits(null)
      return
    }

    const enough = balance >= cost
    setHasEnoughCredits(enough)

    if (!enough) {
      const message = 'Not enough credits to generate images. Please top up.'
      setBalanceError(message)
      setError(message)
    } else {
      setBalanceError(null)
    }
  }

  const fetchCreditCost = async () => {
    setIsFetchingCost(true)
    try {
      const response = await fetch(buildApiUrl('/ai/image-cost'))
      if (!response.ok) {
        throw new Error('Failed to fetch image cost.')
      }
      const data = await response.json()
      const cost = typeof data.cost === 'number' && data.cost > 0 ? data.cost : 1
      setCreditCost(cost)
      updateCreditAvailability(creditsBalance, cost)
    } catch (error) {
      console.error('[AIImageGenerator] fetch cost error', error)
      setBalanceError('Unable to load credit cost. Assuming default value.')
    } finally {
      setIsFetchingCost(false)
    }
  }

  const fetchCreditsBalance = async () => {
    setIsCheckingCredits(true)
    try {
      const response = await fetch(buildApiUrl('/credits/balance'), {
        credentials: 'include',
      })
      if (!response.ok) {
        const errorJson = await response.json().catch(() => null)
        const message =
          response.status === 401
            ? 'Please sign in to use the AI generator.'
            : errorJson?.error || 'Unable to fetch credits. Please try again.'
        setBalanceError(message)
        setHasEnoughCredits(false)
        return
      }
      const data = await response.json()
      const balance = typeof data.balance === 'number' ? data.balance : 0
      setCreditsBalance(balance)
      updateCreditAvailability(balance, creditCost)
    } catch (fetchError) {
      console.error('[AIImageGenerator] fetch credits error', fetchError)
      setBalanceError('Unable to fetch credits. Please try again later.')
      setHasEnoughCredits(false)
    } finally {
      setIsCheckingCredits(false)
    }
  }

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
      const response = await fetch(buildApiUrl('/ai/generate'), {
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
        const errorMessage = errorJson?.message || errorJson?.error || `Request failed with status ${response.status}`
        throw new Error(errorMessage)
      }

      const data = await response.json()
      setImageUrl(data.imageUrl)

      if (typeof data?.credits?.balance === 'number') {
        setCreditsBalance(data.credits.balance)
        updateCreditAvailability(data.credits.balance, creditCost)
      } else {
        fetchCreditsBalance()
      }
      
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
        // Extract specific error message from the error object
        const errorMessage = (err as Error)?.message || (err as any)?.toString() || config.errorDescription
        setError(errorMessage)
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
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <label className="text-sm font-medium text-foreground leading-6 flex-shrink-0">
                  {config.promptLabel}
                </label>
                {(() => {
                  if (error) {
                    return null
                  }

                  const insufficientBalance =
                    typeof creditsBalance === 'number' && creditsBalance < creditCost
                  const shouldHighlightDestructive =
                    hasEnoughCredits === false ||
                    insufficientBalance ||
                    (balanceError && balanceError.toLowerCase().includes('not enough'))

                  if (isCheckingCredits || isFetchingCost) {
                    return (
                      <span className="text-xs text-muted-foreground truncate">
                        Checking credits...
                      </span>
                    )
                  }

                  if (shouldHighlightDestructive) {
                    return (
                      <span className="text-xs text-destructive truncate">
                        {balanceError || 'Not enough credits to generate images.'}
                      </span>
                    )
                  }

                  if (creditsBalance !== null) {
                    return (
                      <span className="text-xs text-muted-foreground truncate">
                        Credits:{' '}
                        <span
                          className="text-foreground"
                        >
                          {creditsBalance}
                        </span>{' '}
                        (Cost {creditCost})
                      </span>
                    )
                  }

                  return (
                    <span className="text-xs text-muted-foreground truncate">
                      {balanceError || 'Credits unavailable'}
                    </span>
                  )
                })()}
                <ErrorMessage message={error || ''} inline />
              </div>
              <Button
                type="submit"
                size="sm"
                variant="outline"
                className="h-8 px-3 text-xs flex-shrink-0"
                loading={isGenerating || isCheckingCredits || isFetchingCost}
                icon={ImageIcon}
                disabled={
                  !prompt.trim() ||
                  isGenerating ||
                  isCheckingCredits ||
                  isFetchingCost ||
                  hasEnoughCredits === false
                }
              >
                {isGenerating
                  ? config.generating
                  : isCheckingCredits || isFetchingCost
                  ? 'Checking credits...'
                  : 'Generate'}
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

            <div className={`space-y-5 flex-shrink-0 ${error ? '' : 'mt-auto'}`}>
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

