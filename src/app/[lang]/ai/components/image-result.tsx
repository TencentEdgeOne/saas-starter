"use client"

import { Button } from '@/components/ui/button'
import { Download, Image as ImageIcon } from 'lucide-react'

interface ImageResultProps {
  imageUrl: string | null
  prompt: string
  resultTitle: string
  emptyStateDescription: string
  downloadText: string
  retryText: string
  onDownload: () => void
  onRetry: () => void
}

export function ImageResult({
  imageUrl,
  prompt,
  resultTitle,
  emptyStateDescription,
  downloadText,
  retryText,
  onDownload,
  onRetry
}: ImageResultProps) {
  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-4 flex items-center justify-between h-6">
        <p className="text-sm font-medium text-foreground leading-6">
          {resultTitle}
        </p>
        {imageUrl && (
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={onRetry}
          >
            {retryText}
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
              onClick={onDownload}
            >
              <Download className="mr-2 h-4 w-4" />
              {downloadText}
            </Button>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            <ImageIcon className="mx-auto mb-4 h-12 w-12" />
            <p className="text-sm">{emptyStateDescription}</p>
          </div>
        )}
      </div>
    </div>
  )
}

