import { motion } from 'framer-motion'

/**
 * Full-screen atmospheric layer: vignette, noise, procrastination clutter, screen shake.
 * Purely presentational — driven by live stats.
 */
export default function VisualAtmosphere({ stress, procrastination, selfEfficacy }) {
  const vig = 0.25 + (stress / 100) * 0.55
  const clutterCount = Math.min(14, Math.floor(procrastination / 7))
  const notifPulse = procrastination >= 55
  const bright = selfEfficacy >= 62 ? 1.05 : 0.92 + (selfEfficacy / 100) * 0.1

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{
          boxShadow: `inset 0 0 ${40 + stress * 0.8}px rgba(0,0,0,${vig})`,
          opacity: bright,
        }}
        transition={{ duration: 0.8 }}
      />
      {/* Subtle film grain */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay',
        }}
      />
      {/* Fake notification stack — procrastination */}
      <div className="absolute right-3 top-20 flex flex-col items-end gap-1 sm:right-6 sm:top-24">
        {Array.from({ length: clutterCount }).map((_, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{
              opacity: 0.35 + (i % 3) * 0.12,
              x: notifPulse ? [0, -3, 2, 0] : 0,
            }}
            transition={{ duration: 2 + i * 0.1, repeat: notifPulse ? Infinity : 0 }}
            className="h-6 w-24 rounded-md bg-slate-800/80 ring-1 ring-amber-500/20 sm:h-7 sm:w-32"
          />
        ))}
      </div>
      {/* Screen shake on very high stress */}
      <motion.div
        className="absolute inset-0"
        animate={
          stress >= 78
            ? {
                x: [0, -2, 2, -1.5, 1.5, 0],
                y: [0, 1, -1, 0],
              }
            : stress >= 62
              ? {
                  x: [0, -0.8, 0.8, 0],
                }
              : { x: 0, y: 0 }
        }
        transition={{ duration: 0.35, repeat: stress >= 78 ? Infinity : 0, repeatDelay: 0.8 }}
      />
    </div>
  )
}
