import { useCallback, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './index.css'

import StatBar from './components/StatBar.jsx'
import DialogueBox from './components/DialogueBox.jsx'
import ChoiceButtons from './components/ChoiceButtons.jsx'
import EndingSystem from './components/EndingSystem.jsx'
import VisualAtmosphere from './components/VisualAtmosphere.jsx'
import AudioAmbient from './components/AudioAmbient.jsx'

import { applyStatDelta, INITIAL_FLAGS, INITIAL_STATS, STAT_HINTS, STAT_LABELS, STAT_KEYS } from './lib/stats.js'
import { buildSceneRuntime, mergeFlags, SCENES } from './lib/scenes.js'

const STAT_COLORS = {
  stress: 'from-rose-500 to-orange-400',
  motivation: 'from-cyan-400 to-blue-500',
  selfEfficacy: 'from-emerald-400 to-teal-500',
  procrastination: 'from-amber-500 to-rose-600',
  grades: 'from-indigo-400 to-violet-500',
}

function resetGame() {
  return {
    sceneIndex: 0,
    beatIndex: 0,
    stats: { ...INITIAL_STATS },
    flags: { ...INITIAL_FLAGS },
    showChoices: false,
    postBeats: null,
    postIndex: 0,
  }
}

export default function App() {
  const [game, setGame] = useState(() => resetGame())
  const [muted, setMuted] = useState(true)

  const { sceneIndex, beatIndex, stats, flags, showChoices, postBeats, postIndex } = game

  const runtime = useMemo(
    () => buildSceneRuntime(sceneIndex, stats, flags),
    [sceneIndex, stats, flags],
  )

  const mainBeats = runtime?.beats ?? []
  const choices = runtime?.choices ?? []
  const endingId = runtime?.endingId ?? null

  const inPost = Boolean(postBeats?.length)
  const activeBeats = inPost ? postBeats : mainBeats
  const currentBeat = activeBeats[inPost ? postIndex : beatIndex] ?? null

  const handleContinue = useCallback(() => {
    setGame((g) => {
      const rt = buildSceneRuntime(g.sceneIndex, g.stats, g.flags)
      const mains = rt?.beats ?? []
      const posts = g.postBeats

      if (posts?.length) {
        if (g.postIndex < posts.length - 1) {
          return { ...g, postIndex: g.postIndex + 1 }
        }
        // Finished post-choice beats → next scene
        return {
          ...g,
          sceneIndex: Math.min(g.sceneIndex + 1, SCENES.length - 1),
          beatIndex: 0,
          showChoices: false,
          postBeats: null,
          postIndex: 0,
        }
      }

      if (g.beatIndex < mains.length - 1) {
        return { ...g, beatIndex: g.beatIndex + 1 }
      }
      return { ...g, showChoices: true }
    })
  }, [])

  const handleChoose = useCallback((choiceId) => {
    setGame((g) => {
      const rt = buildSceneRuntime(g.sceneIndex, g.stats, g.flags)
      const ch = rt?.choices.find((c) => c.id === choiceId)
      if (!ch) return g

      if (choiceId === 'restart') {
        return resetGame()
      }

      let nextStats = g.stats
      if (ch.delta && Object.keys(ch.delta).length) {
        nextStats = applyStatDelta(g.stats, ch.delta)
      }
      let nextFlags = g.flags
      if (ch.flags && Object.keys(ch.flags).length) {
        nextFlags = mergeFlags(g.flags, ch.flags)
      }

      if (ch.postBeats?.length) {
        return {
          ...g,
          stats: nextStats,
          flags: nextFlags,
          postBeats: ch.postBeats,
          postIndex: 0,
          showChoices: false,
        }
      }

      return {
        ...g,
        stats: nextStats,
        flags: nextFlags,
        sceneIndex: Math.min(g.sceneIndex + 1, SCENES.length - 1),
        beatIndex: 0,
        showChoices: false,
        postBeats: null,
        postIndex: 0,
      }
    })
  }, [])

  const sceneMeta = SCENES[sceneIndex]
  const atLastLine =
    inPost && postBeats
      ? postIndex >= postBeats.length - 1
      : beatIndex >= mainBeats.length - 1

  const stressHue = stats.stress
  const uiStressClass =
    stressHue >= 75 ? 'from-slate-950 via-slate-900 to-rose-950/80' : 'from-slate-950 via-slate-900 to-slate-900'

  return (
    <div
      className={`relative z-10 flex min-h-full flex-col bg-gradient-to-br ${uiStressClass} text-slate-100 transition-colors duration-700`}
    >
      <VisualAtmosphere stress={stats.stress} procrastination={stats.procrastination} selfEfficacy={stats.selfEfficacy} />
      <AudioAmbient muted={muted} stress={stats.stress} />

      <header className="relative z-10 border-b border-white/5 bg-slate-950/60 px-3 py-3 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-200/60">Interactive narrative</p>
            <h1 className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">Pressure Valve</h1>
            <p className="max-w-md text-xs text-slate-400 sm:text-sm">
              A week of exams, messages, and kitchen-table conversations — where avoidance and support both leave marks.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              className="rounded-lg border border-slate-600 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-amber-500/50"
            >
              {muted ? 'Sound: off' : 'Sound: on'}
            </button>
            <span className="rounded-lg border border-slate-700/80 bg-slate-900/50 px-3 py-1.5 font-mono text-[10px] text-slate-400 sm:text-xs">
              Scene {sceneIndex + 1} / {SCENES.length}
            </span>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-3 py-4 sm:px-6 sm:py-6 lg:flex-row lg:gap-6">
        {/* Permanent stat HUD */}
        <aside className="lg:w-72 lg:shrink-0">
          <div className="sticky top-4 rounded-2xl border border-slate-700/60 bg-slate-950/70 p-4 shadow-xl backdrop-blur-md">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Your state</p>
            <div className="flex flex-col gap-3.5">
              {STAT_KEYS.map((key) => (
                <StatBar
                  key={key}
                  label={STAT_LABELS[key]}
                  hint={STAT_HINTS[key]}
                  value={stats[key]}
                  colorClass={STAT_COLORS[key]}
                />
              ))}
            </div>
            <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900/50 p-2 text-[10px] leading-relaxed text-slate-500">
              Bars shift with your choices — not as a grade on you, but as pressure moving through a body trying to
              cope.
            </div>
          </div>
        </aside>

        <main className="relative min-w-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={sceneIndex + (inPost ? '-post' : '')}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.4 }}
              className="rounded-3xl border border-slate-700/50 bg-slate-950/40 p-4 shadow-2xl backdrop-blur-sm sm:p-6"
            >
              {sceneIndex === SCENES.length - 1 && endingId ? <EndingSystem endingId={endingId} /> : null}

              <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-200/50">
                    {sceneMeta?.title}
                  </p>
                  <h2 className="text-xl font-semibold text-white sm:text-2xl">{sceneMeta?.tagline}</h2>
                </div>
                {inPost ? (
                  <span className="rounded-full border border-violet-500/30 bg-violet-950/40 px-2 py-0.5 text-[10px] text-violet-200">
                    After your choice
                  </span>
                ) : null}
              </div>

              <DialogueBox beat={currentBeat} stress={stats.stress} selfEfficacy={stats.selfEfficacy} />

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {!showChoices ? (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleContinue}
                    className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-900/30 hover:from-amber-400 hover:to-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                  >
                    {atLastLine ? (inPost ? 'Continue' : mainBeats.length ? 'Decide…' : 'Continue') : 'Continue'}
                  </motion.button>
                ) : (
                  <ChoiceButtons choices={choices} onChoose={handleChoose} stress={stats.stress} />
                )}
              </div>

              {/* Lightweight “unfinished tasks” checklist driven by procrastination */}
              <div className="mt-8 rounded-xl border border-dashed border-slate-700/80 bg-slate-900/30 p-3">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Desk residue</p>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  {['Research essay', 'Chem chapters', 'History mock'].map((t, i) => {
                    const undone = stats.procrastination > 35 + i * 12
                    return (
                      <li
                        key={t}
                        className={`flex items-center gap-2 ${undone ? 'text-amber-200/80' : 'text-emerald-300/80'}`}
                      >
                        <span className="font-mono">{undone ? '☐' : '☑'}</span>
                        {t}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
