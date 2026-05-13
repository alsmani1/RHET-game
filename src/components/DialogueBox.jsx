import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

const SPEAKER_STYLES = {
  narrator: {
    bg: 'rgba(15, 20, 35, 0.85)',
    border: 'rgba(251, 191, 36, 0.35)',
    text: '#e2e8f0',
    icon: '📖',
    label: 'Scene',
  },
  internal: {
    bg: 'rgba(30, 15, 50, 0.85)',
    border: 'rgba(167, 139, 250, 0.4)',
    text: '#ddd6fe',
    icon: '🧠',
    label: 'You think',
    italic: true,
  },
  parent: {
    bg: 'rgba(15, 30, 45, 0.85)',
    border: 'rgba(56, 189, 248, 0.35)',
    text: '#bae6fd',
    icon: '👤',
    label: 'Parent',
  },
  teacher: {
    bg: 'rgba(15, 35, 25, 0.85)',
    border: 'rgba(52, 211, 153, 0.35)',
    text: '#a7f3d0',
    icon: '🏫',
    label: 'School',
  },
  friend: {
    bg: 'rgba(40, 15, 30, 0.85)',
    border: 'rgba(244, 114, 182, 0.3)',
    text: '#fbb6ce',
    icon: '👫',
    label: 'Friend',
  },
  system: {
    bg: 'rgba(30, 25, 10, 0.85)',
    border: 'rgba(251, 191, 36, 0.25)',
    text: '#fef3c7',
    icon: '📱',
    label: 'Phone / Feed',
    mono: true,
  },
}

/**
 * Typewriter text component that reveals text character by character.
 */
function TypewriterText({ text, speed = 25, onComplete }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const indexRef = useRef(0)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    indexRef.current = 0

    const interval = setInterval(() => {
      indexRef.current++
      if (indexRef.current >= text.length) {
        setDisplayed(text)
        setDone(true)
        clearInterval(interval)
        onComplete?.()
      } else {
        setDisplayed(text.slice(0, indexRef.current))
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed])

  return (
    <span>
      {displayed}
      {!done && <span className="typewriter-cursor" />}
    </span>
  )
}

/**
 * Bottom-anchored cinematic dialogue panel with glassmorphism,
 * speaker badges, and typewriter text animation.
 * @param {{ beat: { speaker: string, text: string } | null, stress: number, selfEfficacy: number }} props
 */
export default function DialogueBox({ beat, stress, selfEfficacy }) {
  const style = beat ? (SPEAKER_STYLES[beat.speaker] || SPEAKER_STYLES.narrator) : SPEAKER_STYLES.narrator

  // Stress-reactive effects
  const stressShake = stress >= 78

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {beat ? (
          <motion.div
            key={beat.text.slice(0, 48)}
            className="dialogue-enter"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Speaker badge */}
            <div className="mb-2 flex items-center gap-2">
              <span className="text-base">{style.icon}</span>
              <span
                className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em]"
                style={{
                  background: style.bg,
                  border: `1px solid ${style.border}`,
                  color: style.text,
                }}
              >
                {style.label}
              </span>
            </div>

            {/* Dialogue card */}
            <motion.article
              className="glass-panel rounded-2xl p-4 sm:p-5"
              style={{
                borderLeft: `3px solid ${style.border}`,
                background: style.bg,
              }}
              animate={
                stressShake && beat.speaker === 'internal'
                  ? { x: [0, -1, 1, -0.5, 0.5, 0] }
                  : { x: 0 }
              }
              transition={
                stressShake ? { duration: 0.15, repeat: Infinity, repeatDelay: 0.3 } : {}
              }
            >
              <p
                className={`text-sm leading-relaxed sm:text-base ${
                  style.italic ? 'italic font-medium' : ''
                } ${style.mono ? 'font-mono text-xs sm:text-sm' : ''}`}
                style={{ color: style.text }}
              >
                <TypewriterText text={beat.text} speed={beat.speaker === 'system' ? 15 : 22} />
              </p>
            </motion.article>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            className="glass-panel flex h-24 items-center justify-center rounded-2xl text-slate-500 text-sm"
          >
            …
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
