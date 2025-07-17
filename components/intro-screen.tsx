"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

const line1 = ["Pasti", "Bisa"]
const line2 = ["Digital"]

interface IntroScreenProps {
  onFinish: () => void
}

export default function IntroScreen({ onFinish }: IntroScreenProps) {
  const [visibleWords, setVisibleWords] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const allWords = [...line1, ...line2]

  useEffect(() => {
    const timers = allWords.map((_, i) =>
      setTimeout(
        () => {
          setVisibleWords((prev) => prev + 1)
        },
        600 + i * 500,
      ),
    )

    const totalDuration = 600 + allWords.length * 500 + 500 // buffer
    const exitTimer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(onFinish, 800) // match fade-out duration
    }, totalDuration)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(exitTimer)
    }
  }, [onFinish, allWords.length])

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          // Removed font-inter class here
          className="fixed inset-0 z-50 bg-black text-white flex items-center justify-center px-6"
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-12">
            {/* Big Logo */}
            <motion.img
              src="/pbdlogo.png?height=200&width=200" // Using placeholder for logo.png
              alt="Logo"
              className="w-[200px] h-[200px] object-contain"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />
            {/* Text block */}
            <div className="text-left text-6xl font-bold leading-tight">
              <div className="flex gap-4 mb-2">
                <div className="w-[120px]">
                  {visibleWords > 0 ? (
                    <motion.span
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      {line1[0]}
                    </motion.span>
                  ) : (
                    <span className="opacity-0 select-none">{line1[0]}</span>
                  )}
                </div>
                <div className="w-[120px] ml-4">
                  {visibleWords > 1 ? (
                    <motion.span
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      {line1[1]}
                    </motion.span>
                  ) : (
                    <span className="opacity-0 select-none">{line1[1]}</span>
                  )}
                </div>
              </div>
              <div className="flex gap-4 -mt-3">
                <div className="w-[120px]">
                  {visibleWords > 2 ? (
                    <motion.span
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      {line2[0]}
                    </motion.span>
                  ) : (
                    <span className="opacity-0 select-none">{line2[0]}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
