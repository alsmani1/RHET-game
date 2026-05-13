import { motion } from 'framer-motion'

const STAT_ICONS = {
  stress: '😰',
  motivation: '🔥',
  selfEfficacy: '💪',
  procrastination: '⏰',
  grades: '📊',
}

/**
 * Compact floating stat gauge for the mobile HUD.
 * Shows as a small horizontal bar with icon and value.
 * @param {{ label: string, statKey: string, value: number, hint?: string, colorClass: string }} props
 */
export default function StatBar({ label, statKey, value, hint, colorClass }) {
  const icon = STAT_ICONS[statKey] || '•'
  
  // Color extraction from gradient class names
  const colorMap = {
    'from-rose-500 to-orange-400': '#f43f5e',
    'from-cyan-400 to-blue-500': '#22d3ee',
    'from-emerald-400 to-teal-500': '#34d399',
    'from-amber-500 to-rose-600': '#f59e0b',
    'from-indigo-400 to-violet-500': '#818cf8',
  }
  const barColor = colorMap[colorClass] || '#fbbf24'

  return (
    <div className="group flex items-center gap-2" title={hint}>
      {/* Icon */}
      <span className="text-xs shrink-0">{icon}</span>

      {/* Bar container */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-1 mb-0.5">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 truncate">
            {label}
          </span>
          <span className="font-mono text-[9px] text-slate-500 shrink-0">{value}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-800/80">
          <motion.div
            className="h-full rounded-full"
            style={{ background: barColor }}
            initial={false}
            animate={{ width: `${value}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />
        </div>
      </div>
    </div>
  )
}
