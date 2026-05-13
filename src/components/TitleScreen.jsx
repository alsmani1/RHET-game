import { motion } from 'framer-motion'

/**
 * Cinematic title / splash screen shown before the game starts.
 * @param {{ onStart: () => void }} props
 */
export default function TitleScreen({ onStart }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/80 to-slate-950" />

      {/* Floating orbs */}
      <motion.div
        className="absolute left-1/4 top-1/4 h-48 w-48 rounded-full opacity-20 sm:h-72 sm:w-72"
        style={{
          background: 'radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 70%)',
        }}
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 15, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 h-56 w-56 rounded-full opacity-15 sm:h-80 sm:w-80"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
        }}
        animate={{
          x: [0, -25, 15, 0],
          y: [0, 20, -25, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Film grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Small tag */}
        <motion.p
          className="mb-4 text-[10px] font-semibold uppercase tracking-[0.4em] text-amber-200/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Interactive Narrative Simulator
        </motion.p>

        {/* Title */}
        <motion.h1
          className="mb-3 text-4xl font-bold tracking-tight text-white sm:text-6xl"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="bg-gradient-to-r from-amber-200 via-amber-100 to-orange-200 bg-clip-text text-transparent">
            Pressure
          </span>
          <br />
          <span className="text-slate-200">Valve</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mb-8 max-w-xs text-sm leading-relaxed text-slate-400 sm:max-w-sm sm:text-base"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          A week of exams, messages, and kitchen-table conversations — where avoidance and support both leave marks.
        </motion.p>

        {/* Decorative line */}
        <motion.div
          className="mb-8 h-px w-32 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        />

        {/* Content note */}
        <motion.p
          className="mb-8 max-w-xs text-[11px] leading-relaxed text-slate-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          This story explores academic stress, procrastination, and family dynamics. Your choices shape the outcome. There are no wrong answers — only human ones.
        </motion.p>

        {/* Start button */}
        <motion.button
          type="button"
          onClick={onStart}
          className="animate-pulse-glow rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-10 py-4 text-base font-bold tracking-wide text-slate-950 transition-all hover:from-amber-400 hover:to-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 sm:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          Begin the Week
        </motion.button>

        {/* Scroll hint */}
        <motion.div
          className="mt-12 animate-float"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <svg width="20" height="28" viewBox="0 0 20 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="18" height="26" rx="9" stroke="currentColor" strokeWidth="1.5" className="text-slate-500" />
            <motion.circle
              cx="10" cy="8" r="2"
              fill="currentColor"
              className="text-slate-400"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  )
}
