"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const line1 = ["Pasti", "Bisa"]
const line2 = ["Digital"]

export default function IntroScreen() {
  const [visibleWords, setVisibleWords] = useState(0)
  const allWords = [...line1, ...line2]

  useEffect(() => {
    const timers = allWords.map((_, i) =>
      setTimeout(() => {
        setVisibleWords((prev) => prev + 1)
      }, 600 + i * 500)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex items-center justify-center px-6 font-inter">
      <div className="flex items-center gap-6">
        {/* Logo */}
        <motion.img
          src="/logo.png"
          alt="Logo"
          className="w-20 h-20 object-contain"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Text block: two lines */}
        <div className="text-left text-6xl font-bold leading-tight space-y-1">
          {/* LINE 1: Pasti & Bisa (with offset on Bisa) */}
          <div className="flex gap-4">
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

            <div className="w-[120px] ml-4"> {/* ← offset "Bisa" to the right */}
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

          {/* LINE 2: Digital */}
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
    </div>
  )
}
