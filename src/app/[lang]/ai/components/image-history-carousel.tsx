"use client"

import { motion, useMotionValue, animate, AnimatePresence } from 'framer-motion'
import { useEffect, useRef } from 'react'

interface ImageHistoryItem {
  imageUrl: string
  prompt: string
}

interface ImageHistoryCarouselProps {
  images: ImageHistoryItem[]
  onImageClick?: (imageUrl: string) => void
}

export function ImageHistoryCarousel({ images, onImageClick }: ImageHistoryCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)

  // Duplicate images for seamless loop (need at least 2 sets for smooth infinite scroll)
  // For 2 images, we need more duplicates to ensure smooth scrolling
  const duplicatedImages = images.length >= 2 ? [...images, ...images, ...images, ...images] : []

  // Calculate width for one set of images
  // Each image is 80px (w-20) + 8px gap (gap-2) = 88px per image
  // Last image doesn't have gap after it, so: images.length * 88px - 8px
  const singleSetWidth = images.length >= 2 ? images.length * 88 - 8 : 0

  useEffect(() => {
    // Only animate if we have at least 2 images
    if (images.length < 2 || singleSetWidth === 0) return

    let controls: ReturnType<typeof animate> | null = null
    let isRunning = true

    // Custom seamless loop function
    const startAnimation = () => {
      if (!isRunning) return

      // Start from 0
      x.set(0)

      // Animate to -singleSetWidth
      // We have 4 sets of duplicated images: [A, B, A, B, A, B, A, B]
      // When x = 0, we see set 1: [A, B]
      // When x = -singleSetWidth, we see set 2: [A, B] (same content)
      // So resetting from -singleSetWidth to 0 should be visually seamless
      
      let resetTriggered = false
      
      controls = animate(x, -singleSetWidth, {
        duration: 20,
        ease: "linear",
        onUpdate: (latest) => {
          // When we're very close to the end (within 1px), reset early
          // This prevents the visible jump that happens at exact completion
          if (!resetTriggered && latest <= -singleSetWidth + 1) {
            resetTriggered = true
            // Stop the current animation
            if (controls) {
              controls.stop()
            }
            // Reset to 0 immediately (same visual content due to duplicated images)
            x.set(0)
            // Start next cycle in the next frame
            requestAnimationFrame(() => {
              if (isRunning) {
                startAnimation()
              }
            })
          }
        },
        onComplete: () => {
          // Fallback: if onUpdate didn't catch it
          if (!resetTriggered && isRunning) {
            resetTriggered = true
            x.set(0)
            requestAnimationFrame(() => {
              if (isRunning) {
                startAnimation()
              }
            })
          }
        }
      })
    }

    // Wait for layout to be ready
    const timer = setTimeout(() => {
      startAnimation()
    }, 100)

    return () => {
      isRunning = false
      clearTimeout(timer)
      if (controls) {
        controls.stop()
      }
    }
  }, [images, x, singleSetWidth])

  // Early return after all hooks
  if (images.length < 2) {
    return null
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={images.length}
        className="relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex justify-center">
          <div 
            className="relative overflow-hidden"
            style={{ width: `${singleSetWidth}px` }}
          >
            <motion.div
              ref={containerRef}
              className="flex gap-2"
              style={{ x, width: 'max-content' }}
            >
              {duplicatedImages.map((item, index) => (
                <motion.div
                  key={`${index}-${item.imageUrl}`}
                  className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-border/70 cursor-pointer hover:border-primary/50 transition-colors group"
                  onClick={() => onImageClick?.(item.imageUrl)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.prompt}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Gradient fade on edges */}
            <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
            <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

