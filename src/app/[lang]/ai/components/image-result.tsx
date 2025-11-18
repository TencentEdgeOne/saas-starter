"use client"

import { Button } from '@/components/ui/button'
import { Download, Image as ImageIcon } from 'lucide-react'

interface ImageResultProps {
  imageUrl: string | null
  prompt: string
  resultTitle: string
  emptyStateDescription: string
  downloadText: string
  onDownload: () => void
}

export function ImageResult({
  imageUrl,
  prompt,
  resultTitle,
  emptyStateDescription,
  downloadText,
  onDownload
}: ImageResultProps) {
  return (
    <div className="h-full flex flex-col p-6 min-h-0">
      <div className="mb-4 flex items-center justify-between h-6">
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

      <div className="flex-1 rounded-xl border border-border/70 overflow-hidden min-h-0">
        {imageUrl ? (
          <div className="w-full h-full overflow-hidden">
            <img
              src={imageUrl}
              alt={prompt}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-center text-muted-foreground p-4">
            <div>
              <ImageIcon className="mx-auto mb-4 h-12 w-12" />
              <p className="text-sm">{emptyStateDescription}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

