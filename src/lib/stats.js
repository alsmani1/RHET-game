/**
 * Core stat model for the narrative game.
 * Values are 0–100 and map to Self-Determination Theory / self-regulation research themes:
 * stress ↔ emotional overload; motivation ↔ autonomous engagement;
 * self-efficacy ↔ perceived competence; procrastination ↔ avoidance;
 * grades ↔ cumulative performance (moves slowly).
 */

export const STAT_KEYS = ['stress', 'motivation', 'selfEfficacy', 'procrastination', 'grades']

/** Human-readable labels for the HUD */
export const STAT_LABELS = {
  stress: 'Stress',
  motivation: 'Motivation',
  selfEfficacy: 'Self-efficacy',
  procrastination: 'Procrastination',
  grades: 'Grades',
}

/** Short descriptions for tooltips / accessibility */
export const STAT_HINTS = {
  stress: 'Pressure, anxiety, emotional load',
  motivation: 'Willingness to engage with schoolwork',
  selfEfficacy: 'Belief you can handle the workload',
  procrastination: 'Avoidance and delay',
  grades: 'Overall academic standing',
}

/** Starting values: tired, pressured, not catastrophic */
export const INITIAL_STATS = {
  stress: 58,
  motivation: 42,
  selfEfficacy: 45,
  procrastination: 48,
  grades: 68,
}

export const INITIAL_FLAGS = {
  /** 'autonomy' | 'controlling' — set during first parent scene */
  parentStyle: null,
  /** Track supportive behaviors the player leaned into */
  autonomySeekingCount: 0,
  /** Digital spiral depth for scene 4 */
  distractionDepth: 0,
  /** Did the player ask a friend for help in scene 3 */
  askedFriendHelp: false,
  /** Used structured recovery tools in scene 6 */
  usedStructuredRecovery: false,
  /** Chunks / planning wins */
  planningWins: 0,
}

/**
 * Clamp a single stat into [0, 100].
 * @param {number} n
 */
export function clampStat(n) {
  return Math.max(0, Math.min(100, Math.round(n)))
}

/**
 * Merge partial stat deltas into a copy of `stats`.
 * @param {typeof INITIAL_STATS} stats
 * @param {Partial<typeof INITIAL_STATS>} delta
 */
export function applyStatDelta(stats, delta) {
  const next = { ...stats }
  for (const key of STAT_KEYS) {
    if (delta[key] !== undefined) {
      next[key] = clampStat(next[key] + delta[key])
    }
  }
  return next
}

/**
 * Derive a simple "preparedness" score for branching copy (not shown to player).
 * Higher procrastination and stress drag it down; grades nudge it up.
 */
export function preparednessScore(stats) {
  const p = stats.procrastination
  const g = stats.grades
  const s = stats.stress
  return clampStat(72 - p * 0.45 + g * 0.15 - s * 0.12)
}

/**
 * Pick an ending id from final stats and story flags.
 * Priority is intentional: extreme states win over middling ones.
 *
 * @param {typeof INITIAL_STATS} stats
 * @param {typeof INITIAL_FLAGS} flags
 * @returns {string}
 */
export function resolveEnding(stats, flags) {
  const { stress, motivation, procrastination, grades } = stats

  // Emotional burnout: overload + collapse of drive
  if (stress >= 82 && motivation <= 28 && procrastination >= 55) {
    return 'burnout'
  }

  // Severe procrastination spiral
  if (procrastination >= 78 && grades <= 52) {
    return 'severe_procrastination'
  }

  // High achievement, hollow — pushed performance, depleted motivation
  if (grades >= 82 && stress >= 72 && motivation <= 40) {
    return 'high_achievement_exhausted'
  }

  // Healthy self-regulation — autonomy-support helps this cluster emerge
  if (
    procrastination <= 38 &&
    stress <= 55 &&
    motivation >= 55 &&
    flags.parentStyle === 'autonomy'
  ) {
    return 'healthy_regulation'
  }

  // Balanced growth — not perfect, but integrated learning from pressure
  if (
    procrastination <= 50 &&
    grades >= 62 &&
    stress <= 68 &&
    motivation >= 45
  ) {
    return 'balanced_growth'
  }

  // Controlling parenting + high stress → guarded "survived" ending
  if (flags.parentStyle === 'controlling' && stress >= 65 && procrastination >= 45) {
    return 'survived_pressure'
  }

  // Default reflective ending
  return 'mixed_reflection'
}
