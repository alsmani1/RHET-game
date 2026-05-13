import { useCallback, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './index.css'

import StatBar from './components/StatBar.jsx'
import DialogueBox from './components/DialogueBox.jsx'
import ChoiceButtons from './components/ChoiceButtons.jsx'
import EndingSystem from './components/EndingSystem.jsx'
import VisualAtmosphere from './components/VisualAtmosphere.jsx'
import AudioAmbient from './components/AudioAmbient.jsx'
import TitleScreen from './components/TitleScreen.jsx'
import SceneBackground from './components/SceneBackground.jsx'
import SceneTitleCard from './components/SceneTitleCard.jsx'
import SceneProgress from './components/SceneProgress.jsx'

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
  const [started, setStarted] = useState(false)
  const [game, setGame] = useState(() => resetGame())
  const [muted, setMuted] = useState(true)
  const [hudOpen, setHudOpen] = useState(false)
  const [showTitleCard, setShowTitleCard] = useState(true)
  const [prevSceneIndex, setPrevSceneIndex] = useState(-1)

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

  // Detect scene change for title card
  if (sceneIndex !== prevSceneIndex) {
    if (prevSceneIndex !== -1) {
      // Will trigger title card on next render
    }
    setPrevSceneIndex(sceneIndex)
  }

  const handleContinue = useCallback(() => {
    setGame((g) => {
      const rt = buildSceneRuntime(g.sceneIndex, g.stats, g.flags)
      const mains = rt?.beats ?? []
      const posts = g.postBeats

      if (posts?.length) {
        if (g.postIndex < posts.length - 1) {
          return { ...g, postIndex: g.postIndex + 1 }
        }
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
        setStarted(false)
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

  // ─── Title Screen ───
  if (!started) {
    return (
      <AnimatePresence>
        <TitleScreen onStart={() => setStarted(true)} />
      </AnimatePresence>
    )
  }

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden">
      {/* Scene background (full viewport) */}
      <SceneBackground
        sceneId={sceneMeta?.id}
        mood={sceneMeta?.mood || 'neutral'}
        stress={stats.stress}
      />

      {/* Atmospheric effects overlay */}
      <VisualAtmosphere stress={stats.stress} procrastination={stats.procrastination} selfEfficacy={stats.selfEfficacy} />

      {/* Audio */}
      <AudioAmbient muted={muted} stress={stats.stress} />

      {/* Scene title card (auto-dismisses) */}
      <SceneTitleCard
        sceneIndex={sceneIndex}
        title={sceneMeta?.title}
        tagline={sceneMeta?.tagline}
      />

      {/* ─── Top HUD Bar ─── */}
      <header className="safe-area-top relative z-20 flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3">
        {/* Left: scene info */}
        <div className="flex items-center gap-2">
          <SceneProgress current={sceneIndex} total={SCENES.length} />
        </div>

        {/* Right: controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            className="glass-panel rounded-full px-3 py-1.5 text-[10px] font-medium text-slate-300 transition hover:text-white sm:text-xs"
          >
            {muted ? '🔇' : '🔊'}
          </button>
          <button
            type="button"
            onClick={() => setHudOpen((o) => !o)}
            className="glass-panel rounded-full px-3 py-1.5 text-[10px] font-medium text-slate-300 transition hover:text-white sm:text-xs"
          >
            {hudOpen ? '✕' : '📊'}
          </button>
        </div>
      </header>

      {/* ─── Floating Stats HUD (collapsible) ─── */}
      <AnimatePresence>
        {hudOpen && (
          <motion.aside
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel absolute left-3 top-14 z-30 w-52 rounded-2xl p-3 shadow-2xl sm:left-4 sm:top-16 sm:w-60"
          >
            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Your State
            </p>
            <div className="flex flex-col gap-2.5">
              {STAT_KEYS.map((key) => (
                <StatBar
                  key={key}
                  label={STAT_LABELS[key]}
                  statKey={key}
                  hint={STAT_HINTS[key]}
                  value={stats[key]}
                  colorClass={STAT_COLORS[key]}
                />
              ))}
            </div>
            <div className="mt-3 rounded-lg bg-slate-900/40 p-2 text-[9px] leading-relaxed text-slate-500">
              Bars shift with your choices — pressure moving through a body trying to cope.
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ─── Main Content: Bottom-anchored dialogue ─── */}
      <div className="relative z-10 mt-auto flex flex-col safe-area-bottom">
        {/* Ending banner (if final scene) */}
        {sceneIndex === SCENES.length - 1 && endingId && (
          <div className="px-3 sm:px-4">
            <EndingSystem endingId={endingId} stats={stats} />
          </div>
        )}

        {/* Desk residue — compact version */}
        <div className="px-3 pb-1 sm:px-4">
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            {['Research essay', 'Chem chapters', 'History mock'].map((t, i) => {
              const undone = stats.procrastination > 35 + i * 12
              return (
                <span
                  key={t}
                  className={`rounded-full px-2 py-0.5 ${
                    undone
                      ? 'bg-amber-950/40 text-amber-300/70 ring-1 ring-amber-500/20'
                      : 'bg-emerald-950/30 text-emerald-300/60 ring-1 ring-emerald-500/15 line-through'
                  }`}
                >
                  {undone ? '☐' : '☑'} {t}
                </span>
              )
            })}
          </div>
        </div>

        {/* Dialogue panel */}
        <div className="px-3 py-2 sm:px-4 sm:py-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={sceneIndex + (inPost ? '-post' : '')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Scene label + post-choice tag */}
              <div className="mb-1.5 flex items-center justify-between">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-amber-400/50">
                  {sceneMeta?.title}
                </p>
                {inPost && (
                  <span className="rounded-full bg-violet-950/50 px-2 py-0.5 text-[9px] text-violet-300/70 ring-1 ring-violet-500/20">
                    After your choice
                  </span>
                )}
              </div>

              <DialogueBox beat={currentBeat} stress={stats.stress} selfEfficacy={stats.selfEfficacy} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Actions: Continue button or Choice cards */}
        <div className="px-3 pb-4 sm:px-4 sm:pb-6">
          {!showChoices ? (
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleContinue}
              className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-900/20 transition hover:from-amber-400 hover:to-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 sm:text-base"
            >
              {atLastLine ? (inPost ? 'Continue →' : mainBeats.length ? 'Decide…' : 'Continue →') : 'Continue →'}
            </motion.button>
          ) : (
            <ChoiceButtons choices={choices} onChoose={handleChoose} stress={stats.stress} />
          )}
        </div>
      </div>
    </div>
  )
}
