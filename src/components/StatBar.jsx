import { motion } from 'framer-motion'

/**
 * Single horizontal stat meter with label and animated fill.
 * @param {{ label: string, value: number, hint?: string, colorClass: string, stress?: number }} props
 */
export default function StatBar({ label, value, hint, colorClass }) {
  return (
    <div className="group flex flex-col gap-0.5" title={hint}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 group-hover:text-slate-400 sm:text-xs">
          {label}
        </span>
        <span className="font-mono text-[10px] text-slate-400 sm:text-xs">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800/80 ring-1 ring-slate-700/60">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${colorClass}`}
          initial={false}
          animate={{ width: `${value}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        />
      </div>
    </div>
  )
}
