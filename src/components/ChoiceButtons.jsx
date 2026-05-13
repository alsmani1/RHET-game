import { motion } from 'framer-motion'

/** Stat icon hints shown on choices */
const STAT_ICONS = {
  stress: '😰',
  motivation: '🔥',
  selfEfficacy: '💪',
  procrastination: '⏰',
  grades: '📊',
}

/**
 * Choice cards that slide up from bottom as floating cards over the scene.
 * Mobile-first design with touch-friendly sizing.
 * @param {{ choices: Array<{ id: string, label: string, delta?: object }>, onChoose: (id: string) => void, disabled?: boolean, stress?: number }} props
 */
export default function ChoiceButtons({ choices, onChoose, disabled, stress = 0 }) {
  return (
    <div className="flex w-full flex-col gap-2.5">
      {choices.map((c, i) => {
        // Show small stat change hints
        const hints = c.delta
          ? Object.entries(c.delta)
              .filter(([, v]) => v !== 0 && v !== undefined)
              .slice(0, 3)
              .map(([key, v]) => ({
                icon: STAT_ICONS[key] || '•',
                dir: v > 0 ? '↑' : '↓',
                key,
              }))
          : []

        return (
          <motion.button
            key={c.id}
            type="button"
            disabled={disabled}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: disabled ? 1 : 1.015, y: disabled ? 0 : -2 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            onClick={() => !disabled && onChoose(c.id)}
            className="glass-panel group relative w-full rounded-2xl px-4 py-3.5 text-left transition-all hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-900/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 disabled:cursor-not-allowed disabled:opacity-30 sm:px-5 sm:py-4"
            style={{
              borderColor: 'rgba(255,255,255,0.08)',
            }}
          >
            <div className="flex items-start justify-between gap-3">
              {/* Choice text */}
              <p className="flex-1 text-sm leading-relaxed text-slate-200 group-hover:text-white sm:text-base">
                {c.label}
              </p>

              {/* Stat hint icons */}
              {hints.length > 0 && (
                <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-70">
                  {hints.map((h) => (
                    <span key={h.key} className="text-[10px]" title={`${h.key} ${h.dir}`}>
                      {h.icon}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Hover glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 opacity-0 transition-opacity group-hover:opacity-100" />
          </motion.button>
        )
      })}
    </div>
  )
}
