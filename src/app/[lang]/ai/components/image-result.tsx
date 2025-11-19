"use client"

import { Button } from '@/components/ui/button'
import { Download, Image as ImageIcon } from 'lucide-react'
import { ImageLoading } from './image-loading'

interface ImageResultProps {
  imageUrl: string | null
  prompt: string
  resultTitle: string
  emptyStateDescription: string
  downloadText: string
  onDownload: () => void
  isGenerating?: boolean
  hasError?: boolean
}

export function ImageResult({
  imageUrl,
  prompt,
  resultTitle,
  emptyStateDescription,
  downloadText,
  onDownload,
  isGenerating = false,
  hasError = false
}: ImageResultProps) {
  return (
    <div className="h-full flex flex-col p-6 min-h-0">
      <div className="mb-4 flex items-center justify-between h-6 flex-shrink-0">
        <p className="text-sm font-medium text-foreground leading-6">
          {resultTitle}
        </p>
        {imageUrl && (
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={onDownload}
          >
            <Download className="mr-2 h-4 w-4" />
            {downloadText}
          </Button>
        )}
      </div>

      <div className="rounded-xl border border-border/70 overflow-hidden min-h-0 flex-1">
        {isGenerating ? (
          <ImageLoading />
        ) : imageUrl ? (
          <div className="w-full h-full overflow-hidden">
            <img
              src={imageUrl}
              alt={prompt}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className={`w-full h-full flex items-center justify-center text-center p-4 ${hasError ? 'text-destructive' : 'text-muted-foreground'}`}>
            <div>
              <ImageIcon className="mx-auto mb-4 h-12 w-12" />
              {!hasError && <p className="text-sm">{emptyStateDescription}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

