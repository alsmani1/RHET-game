import { motion, AnimatePresence } from 'framer-motion'

const SPEAKER_STYLES = {
  narrator: 'text-slate-200 border-l-amber-500/70 bg-slate-900/40',
  internal: 'text-violet-200/90 border-l-violet-500/70 bg-violet-950/25 italic',
  parent: 'text-sky-200 border-l-sky-500/70 bg-sky-950/20',
  teacher: 'text-emerald-200/90 border-l-emerald-500/70 bg-emerald-950/20',
  friend: 'text-pink-200/90 border-l-pink-500/60 bg-pink-950/15',
  system: 'text-amber-100/80 border-l-amber-400/50 bg-amber-950/20 font-mono text-sm',
}

const SPEAKER_LABEL = {
  narrator: 'Scene',
  internal: 'You think',
  parent: 'Parent',
  teacher: 'School',
  friend: 'Friend',
  system: 'Phone / feed',
}

/**
 * Animated dialogue card with speaker styling and stress-reactive blur.
 * @param {{ beat: { speaker: string, text: string } | null, stress: number, selfEfficacy: number }} props
 */
export default function DialogueBox({ beat, stress, selfEfficacy }) {
  const blurPx = stress >= 85 ? 1.2 : stress >= 65 ? 0.6 : 0
  const effScale = 0.92 + (selfEfficacy / 100) * 0.08

  return (
    <div
      className="relative min-h-[180px] sm:min-h-[220px]"
      style={{
        filter: `blur(${blurPx}px)`,
        transform: `scale(${effScale})`,
        transition: 'filter 0.6s ease, transform 0.6s ease',
      }}
    >
      <AnimatePresence mode="wait">
        {beat ? (
          <motion.article
            key={beat.text.slice(0, 48)}
            initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={`rounded-2xl border-l-4 p-5 shadow-xl ring-1 ring-white/5 sm:p-7 ${
              SPEAKER_STYLES[beat.speaker] || SPEAKER_STYLES.narrator
            }`}
          >
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              {SPEAKER_LABEL[beat.speaker] || beat.speaker}
            </p>
            <p
              className={`text-base leading-relaxed sm:text-lg ${
                beat.speaker === 'internal' ? 'font-medium' : ''
              }`}
            >
              {beat.speaker === 'internal' && stress >= 78 ? (
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, -1, 1, -0.5, 0.5, 0], rotate: [0, -0.3, 0.3, 0] }}
                  transition={{ duration: 0.12, repeat: Infinity, repeatDelay: 0.05 }}
                >
                  {beat.text}
                </motion.span>
              ) : (
                beat.text
              )}
            </p>
          </motion.article>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-slate-700 text-slate-500"
          >
            …
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
