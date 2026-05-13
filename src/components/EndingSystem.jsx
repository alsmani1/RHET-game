import { motion } from 'framer-motion'

/** Maps internal ending ids to presentation titles + tone */
const ENDING_META = {
  healthy_regulation: {
    title: 'Quiet momentum',
    subtitle: 'Healthy self-regulation',
    accent: 'from-emerald-500/40 to-teal-500/20',
  },
  severe_procrastination: {
    title: 'Borrowed time',
    subtitle: 'Severe procrastination spiral',
    accent: 'from-rose-600/35 to-amber-900/20',
  },
  burnout: {
    title: 'Hollow bell',
    subtitle: 'Emotional burnout',
    accent: 'from-violet-600/35 to-slate-900/40',
  },
  high_achievement_exhausted: {
    title: 'Polished surface',
    subtitle: 'High marks, depleted drive',
    accent: 'from-amber-500/35 to-slate-800/30',
  },
  balanced_growth: {
    title: 'Uneven but honest',
    subtitle: 'Balanced growth',
    accent: 'from-cyan-500/30 to-emerald-900/20',
  },
  survived_pressure: {
    title: 'Survived the noise',
    subtitle: 'Pressure without repair',
    accent: 'from-orange-600/35 to-slate-900/35',
  },
  mixed_reflection: {
    title: 'A week that split the difference',
    subtitle: 'Mixed outcomes',
    accent: 'from-slate-500/30 to-slate-800/25',
  },
}

/**
 * Banner shown at the start of the final scene, summarizing the arc outcome.
 * @param {{ endingId: string | null }} props
 */
export default function EndingSystem({ endingId }) {
  const meta = ENDING_META[endingId] || ENDING_META.mixed_reflection
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-4 rounded-2xl bg-gradient-to-r p-[1px] shadow-lg ${meta.accent}`}
    >
      <div className="rounded-2xl bg-slate-950/90 px-4 py-3 sm:px-5 sm:py-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-200/70">
          How this week settled
        </p>
        <h2 className="mt-1 font-semibold text-slate-50 sm:text-lg">{meta.title}</h2>
        <p className="text-xs text-slate-400 sm:text-sm">{meta.subtitle}</p>
      </div>
    </motion.div>
  )
}
