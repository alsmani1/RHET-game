import { motion } from 'framer-motion'

/**
 * Full-screen atmospheric overlay: vignette, film grain, stress distortion.
 * Layered on top of scene backgrounds — purely presentational.
 */
export default function VisualAtmosphere({ stress, procrastination, selfEfficacy }) {
  const vig = 0.2 + (stress / 100) * 0.5
  const notifPulse = procrastination >= 55
  const clutterCount = Math.min(8, Math.floor(procrastination / 10))

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      {/* Vignette */}
      <motion.div
        className="absolute inset-0"
        animate={{
          boxShadow: `inset 0 0 ${50 + stress * 1.2}px rgba(0,0,0,${vig})`,
        }}
        transition={{ duration: 1 }}
      />

      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Stress color shift — red tint at high stress */}
      {stress >= 65 && (
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundColor: `rgba(180, 30, 30, ${(stress - 65) * 0.002})`,
          }}
          transition={{ duration: 1.5 }}
        />
      )}

      {/* Notification clutter (top-right, subtle) */}
      <div className="absolute right-2 top-20 flex flex-col items-end gap-0.5 sm:right-4">
        {Array.from({ length: clutterCount }).map((_, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{
              opacity: 0.15 + (i % 3) * 0.06,
              x: notifPulse ? [0, -2, 1.5, 0] : 0,
            }}
            transition={{ duration: 2 + i * 0.15, repeat: notifPulse ? Infinity : 0 }}
            className="h-4 w-16 rounded bg-slate-700/50 ring-1 ring-amber-500/10 sm:h-5 sm:w-20"
          />
        ))}
      </div>

      {/* Screen shake on very high stress */}
      {stress >= 75 && (
        <motion.div
          className="absolute inset-0"
          animate={{
            x: [0, -1.5, 1.5, -1, 1, 0],
            y: [0, 0.8, -0.8, 0],
          }}
          transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 1.2 }}
        />
      )}

      {/* Self-efficacy glow — subtle warm glow when self-efficacy is high */}
      {selfEfficacy >= 60 && (
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            background: 'radial-gradient(ellipse at center 80%, rgba(52,211,153,0.2) 0%, transparent 60%)',
          }}
        />
      )}
    </div>
  )
}
