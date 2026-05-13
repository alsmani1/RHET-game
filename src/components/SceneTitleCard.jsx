import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

/**
 * Brief animated title card overlay shown when entering a new scene.
 * Shows scene number + title + tagline, then auto-dismisses.
 * @param {{ sceneIndex: number, title: string, tagline: string }} props
 */
export default function SceneTitleCard({ sceneIndex, title, tagline }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setVisible(true)
    const timer = setTimeout(() => setVisible(false), 3000)
    return () => clearTimeout(timer)
  }, [sceneIndex])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={`title-${sceneIndex}`}
          className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Dim backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Title content */}
          <div className="relative z-10 flex flex-col items-center px-6 text-center">
            {/* Scene number */}
            <motion.p
              className="mb-3 text-[10px] font-bold uppercase tracking-[0.4em] text-amber-400/70"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              Scene {sceneIndex + 1}
            </motion.p>

            {/* Title */}
            <motion.h2
              className="mb-2 text-3xl font-bold tracking-tight text-white sm:text-5xl"
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {title}
            </motion.h2>

            {/* Decorative line */}
            <motion.div
              className="mb-3 h-px w-24 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            />

            {/* Tagline */}
            <motion.p
              className="max-w-xs text-sm text-slate-300/80 sm:text-base"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {tagline}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
