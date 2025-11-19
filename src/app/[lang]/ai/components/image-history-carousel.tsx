"use client"

import { motion, useMotionValue, animate, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

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
  const wrapperRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const [needsCarousel, setNeedsCarousel] = useState(false)

  // Calculate width for one set of images
  // Each image is 80px (w-20) + 8px gap (gap-2) = 88px per image
  // Last image doesn't have gap after it, so: images.length * 88px - 8px
  const singleSetWidth = images.length >= 2 ? images.length * 88 - 8 : 0

  // Duplicate images for seamless loop (only if carousel is needed)
  const duplicatedImages = needsCarousel && images.length >= 2 
    ? [...images, ...images, ...images, ...images] 
    : images

  // Check if carousel is needed based on container width
  useEffect(() => {
    if (images.length < 2) return

    const checkWidth = () => {
      if (!wrapperRef.current) return

      const containerWidth = wrapperRef.current.offsetWidth
      const imagesWidth = singleSetWidth

      // If container is wide enough to show all images, don't use carousel
      if (containerWidth >= imagesWidth) {
        setNeedsCarousel(false)
      } else {
        setNeedsCarousel(true)
      }
    }

    // Check on mount and resize
    // Use setTimeout to ensure DOM is ready
    const timer = setTimeout(() => {
      checkWidth()
    }, 0)

    const resizeObserver = new ResizeObserver(checkWidth)
    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current)
    }

    return () => {
      clearTimeout(timer)
      resizeObserver.disconnect()
    }
  }, [images, singleSetWidth])

  // Animation effect (only if carousel is needed)
  useEffect(() => {
    if (!needsCarousel || images.length < 2 || singleSetWidth === 0) {
      x.set(0)
      return
    }

    let controls: ReturnType<typeof animate> | null = null
    let isRunning = true

    // Custom seamless loop function
    const startAnimation = () => {
      if (!isRunning) return

      x.set(0)
      
      let resetTriggered = false
      
      controls = animate(x, -singleSetWidth, {
        duration: 20,
        ease: "linear",
        onUpdate: (latest) => {
          if (!resetTriggered && latest <= -singleSetWidth + 1) {
            resetTriggered = true
            if (controls) {
              controls.stop()
            }
            x.set(0)
            requestAnimationFrame(() => {
              if (isRunning) {
                startAnimation()
              }
            })
          }
        },
        onComplete: () => {
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
  }, [images, x, singleSetWidth, needsCarousel])

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
        {/* Title */}
        <div className="mb-3">
          <h3 className="text-sm font-medium text-foreground">Generation History</h3>
        </div>

        {/* Content wrapper */}
        <div ref={wrapperRef} className="relative overflow-hidden">
          {needsCarousel ? (
            // Carousel mode
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
          ) : (
            // Static list mode
            <div className="flex gap-2 flex-wrap">
              {images.map((item, index) => (
                <div
                  key={`${index}-${item.imageUrl}`}
                  className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-border/70 cursor-pointer hover:border-primary/50 transition-colors group"
                  onClick={() => onImageClick?.(item.imageUrl)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.prompt}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

