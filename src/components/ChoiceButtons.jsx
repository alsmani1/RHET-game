import { motion } from 'framer-motion'

/**
 * Choice list with hover motion; stress adds micro jitter on the container.
 * @param {{ choices: Array<{ id: string, label: string }>, onChoose: (id: string) => void, disabled?: boolean, stress?: number }} props
 */
export default function ChoiceButtons({ choices, onChoose, disabled, stress = 0 }) {
  const shake = stress >= 72
  return (
    <motion.div
      className="flex flex-col gap-2.5 sm:gap-3"
      animate={
        shake
          ? {
              x: [0, -1.2, 1.2, -0.8, 0.8, 0],
              y: [0, 0.6, -0.6, 0],
            }
          : { x: 0, y: 0 }
      }
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {choices.map((c, i) => (
        <motion.button
          key={c.id}
          type="button"
          disabled={disabled}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ scale: disabled ? 1 : 1.01 }}
          whileTap={{ scale: disabled ? 1 : 0.99 }}
          onClick={() => !disabled && onChoose(c.id)}
          className="rounded-xl border border-slate-600/80 bg-slate-900/70 px-4 py-3 text-left text-sm text-slate-100 shadow-md ring-1 ring-white/5 transition hover:border-amber-500/50 hover:bg-slate-800/90 hover:shadow-amber-900/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 disabled:cursor-not-allowed disabled:opacity-40 sm:text-base"
        >
          {c.label}
        </motion.button>
      ))}
    </motion.div>
  )
}
