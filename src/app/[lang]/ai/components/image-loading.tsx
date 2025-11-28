"use client"

import { motion } from 'framer-motion'

// Stagger function for top-left direction (from左上角开始波动)
const topLeftStagger = (row: number, col: number) => row + col

export function ImageLoading() {
  const cols = 20
  const rows = 20
  const totalItems = cols * rows

  return (
    <div className="w-full h-full p-0">
      <motion.div
        className="grid w-full h-full gap-0"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
        initial="hidden"
        animate="show"
      >
        {Array.from({ length: totalItems }, (_, i) => {
          const row = Math.floor(i / cols)
          const col = i % cols
          const staggerIndex = topLeftStagger(row, col)
          const isFirstCol = col === 0
          const isLastCol = col === cols - 1
          const isFirstRow = row === 0
          const isLastRow = row === rows - 1

          return (
            <motion.div
              key={i}
              className="bg-gradient-to-br from-primary/30 via-primary/15 to-primary/5"
              style={{
                borderRadius: 
                  (isFirstRow && isFirstCol) ? '0.75rem 0 0 0' : // top-left
                  (isFirstRow && isLastCol) ? '0 0.75rem 0 0' : // top-right
                  (isLastRow && isFirstCol) ? '0 0 0 0.75rem' : // bottom-left
                  (isLastRow && isLastCol) ? '0 0 0.75rem 0' : // bottom-right
                  '0',
              }}
              variants={{
                hidden: {
                  opacity: 0,
                  scale: 0.6,
                },
                show: {
                  opacity: [0.3, 1, 0.3],
                  scale: 1,
                  transition: {
                    opacity: {
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: staggerIndex * 0.03,
                      repeatDelay: 0,
                    },
                    scale: {
                      duration: 0.4,
                      ease: [0.4, 0, 0.2, 1],
                      delay: staggerIndex * 0.03,
                    },
                  },
                },
              }}
            />
          )
        })}
      </motion.div>
    </div>
  )
}

