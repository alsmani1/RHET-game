import { motion } from 'framer-motion'

/** Maps internal ending ids to presentation data */
const ENDING_META = {
  healthy_regulation: {
    title: 'Quiet Momentum',
    subtitle: 'Healthy Self-Regulation',
    emoji: '🌱',
    gradient: 'from-emerald-500/40 via-teal-500/20 to-emerald-900/30',
    bgGlow: 'rgba(52, 211, 153, 0.15)',
    message: 'You found a way to hear the pressure without letting it drive.',
  },
  severe_procrastination: {
    title: 'Borrowed Time',
    subtitle: 'Severe Procrastination Spiral',
    emoji: '🕳️',
    gradient: 'from-rose-600/40 via-amber-900/20 to-rose-950/30',
    bgGlow: 'rgba(244, 63, 94, 0.15)',
    message: 'The relief was always temporary. The cost compounds quietly.',
  },
  burnout: {
    title: 'Hollow Bell',
    subtitle: 'Emotional Burnout',
    emoji: '🔕',
    gradient: 'from-violet-600/40 via-slate-800/30 to-violet-950/30',
    bgGlow: 'rgba(139, 92, 246, 0.15)',
    message: 'You survived. The word feels heavier than it should.',
  },
  high_achievement_exhausted: {
    title: 'Polished Surface',
    subtitle: 'High Marks, Depleted Drive',
    emoji: '🪞',
    gradient: 'from-amber-500/40 via-slate-800/25 to-amber-950/30',
    bgGlow: 'rgba(245, 158, 11, 0.15)',
    message: 'The numbers look right. Inside, something else is counting.',
  },
  balanced_growth: {
    title: 'Uneven but Honest',
    subtitle: 'Balanced Growth',
    emoji: '🌤️',
    gradient: 'from-cyan-500/35 via-emerald-900/20 to-cyan-950/25',
    bgGlow: 'rgba(34, 211, 238, 0.12)',
    message: 'It wasn\'t clean. It was real.',
  },
  survived_pressure: {
    title: 'Survived the Noise',
    subtitle: 'Pressure Without Repair',
    emoji: '🛡️',
    gradient: 'from-orange-600/40 via-slate-900/30 to-orange-950/30',
    bgGlow: 'rgba(234, 88, 12, 0.15)',
    message: 'You learned how to endure. Not yet how to breathe.',
  },
  mixed_reflection: {
    title: 'Split Difference',
    subtitle: 'Mixed Outcomes',
    emoji: '🪢',
    gradient: 'from-slate-500/35 via-slate-800/25 to-slate-900/30',
    bgGlow: 'rgba(148, 163, 184, 0.1)',
    message: 'Some choices helped. Some didn\'t. The pattern is still forming.',
  },
}

/**
 * Cinematic ending card with dramatic reveal.
 * @param {{ endingId: string | null, stats: object }} props
 */
export default function EndingSystem({ endingId, stats }) {
  const meta = ENDING_META[endingId] || ENDING_META.mixed_reflection

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="mb-6"
    >
      {/* Glow backdrop */}
      <div
        className="absolute inset-0 rounded-3xl opacity-40 blur-3xl"
        style={{ background: meta.bgGlow }}
      />

      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${meta.gradient} p-px`}>
        <div className="rounded-3xl bg-slate-950/80 px-5 py-6 backdrop-blur-md sm:px-8 sm:py-8">
          {/* Emoji */}
          <motion.div
            className="mb-4 text-4xl sm:text-5xl"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
          >
            {meta.emoji}
          </motion.div>

          {/* Tag */}
          <motion.p
            className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            How this week settled
          </motion.p>

          {/* Title */}
          <motion.h2
            className="mb-1 text-2xl font-bold text-white sm:text-3xl"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {meta.title}
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="mb-4 text-sm text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {meta.subtitle}
          </motion.p>

          {/* Divider */}
          <motion.div
            className="mb-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          />

          {/* Closing message */}
          <motion.p
            className="text-sm italic leading-relaxed text-slate-300/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {meta.message}
          </motion.p>

          {/* Mini stat summary */}
          {stats && (
            <motion.div
              className="mt-5 flex flex-wrap gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              {[
                { label: 'Stress', value: stats.stress, color: '#f43f5e' },
                { label: 'Motivation', value: stats.motivation, color: '#22d3ee' },
                { label: 'Grades', value: stats.grades, color: '#818cf8' },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-1.5 rounded-lg bg-slate-900/60 px-3 py-1.5">
                  <div className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-[10px] font-medium text-slate-400">{s.label}</span>
                  <span className="font-mono text-[10px] font-bold text-slate-300">{s.value}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
