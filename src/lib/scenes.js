import { resolveEnding } from './stats.js'

/**
 * Central narrative data for all 10 scenes.
 * Mechanics intentionally echo SDT / procrastination research without expository lecturing:
 * autonomy-supportive routes tend to reduce avoidance and stabilize stress;
 * controlling routes amplify pressure and guilt-driven avoidance;
 * self-efficacy gates confident planning options; high stress warps tone and UI elsewhere.
 */

/** @typedef {import('./stats.js').INITIAL_STATS} GameStats */
/** @typedef {import('./stats.js').INITIAL_FLAGS} GameFlags */

/**
 * @typedef {Object} Beat
 * @property {string} speaker — 'narrator' | 'internal' | 'parent' | 'teacher' | 'friend' | 'system'
 * @property {string} text
 */

/**
 * @typedef {Object} Choice
 * @property {string} id
 * @property {string} label
 * @property {Partial<GameStats>} [delta]
 * @property {Partial<GameFlags>} [flags]
 * @property {(ctx: SceneContext) => boolean} [showIf] — if missing, always shown
 * @property {Beat[]} [postBeats] — optional lines after this choice (e.g. parent reply)
 */

/**
 * @typedef {Object} SceneContext
 * @property {GameStats} stats
 * @property {GameFlags} flags
 */

/**
 * @typedef {Object} SceneDef
 * @property {string} id
 * @property {string} title
 * @property {string} tagline
 * @property {(ctx: SceneContext) => Beat[]} getBeats
 * @property {(ctx: SceneContext) => Choice[]} getChoices
 */

/** Utility: stress-based internal voice color in copy (handled in UI, not here) */
function stressLine(ctx, calm, stressed) {
  return ctx.stats.stress >= 68 ? stressed : calm
}

/** @type {SceneDef[]} */
export const SCENES = [
  // SCENE 1 — OVERWHELMED
  {
    id: 's1',
    title: 'Overwhelmed',
    tagline: 'Monday morning, your head already full.',
    getBeats: (ctx) => {
      const t = stressLine(
        ctx,
        'You tell yourself you still have time.',
        'Time feels like something that slips through your fingers when you try to grab it.',
      )
      return [
        {
          speaker: 'narrator',
          text: 'Your phone buzzes with the school portal: a research essay, two chapters for Chem, and a mock exam block added to the calendar — all in the same week.',
        },
        {
          speaker: 'narrator',
          text: 'You already stayed up too late Sunday. Your eyes feel grainy. The hallway noise hasn’t even started and you’re tired.',
        },
        { speaker: 'internal', text: t },
        {
          speaker: 'internal',
          text: 'A familiar tightness sits under your ribs. If you start listing everything, the list becomes a wall.',
        },
      ]
    },
    getChoices: () => [
      {
        id: 's1_plan',
        label: 'Pull out your planner and try to break the week into pieces',
        delta: { stress: -6, motivation: +8, procrastination: -10, selfEfficacy: +6, grades: +2 },
        flags: { planningWins: 1, autonomySeekingCount: 1 },
      },
      {
        id: 's1_avoid',
        label: 'Close the tab and pretend you didn’t see the notification yet',
        delta: { stress: +10, motivation: -6, procrastination: +14, selfEfficacy: -5 },
      },
      {
        id: 's1_distract',
        label: 'Scroll socials for “just five minutes” to numb the spike of panic',
        delta: { stress: -4, motivation: -8, procrastination: +16, selfEfficacy: -4, grades: -1 },
        flags: { distractionDepth: 1 },
      },
    ],
  },

  // SCENE 2 — FIRST PARENT INTERACTION
  {
    id: 's2',
    title: 'Kitchen Tension',
    tagline: 'They notice you go quiet.',
    getBeats: (ctx) => [
      {
        speaker: 'narrator',
        text: 'After school, the kitchen smells like reheated soup. Your parent leans against the counter, drying a mug slowly — watching you more than the ceramic.',
      },
      {
        speaker: 'parent',
        text: '“Rough week?” they ask. It lands heavier than small talk.',
      },
      {
        speaker: 'internal',
        text:
          ctx.stats.stress >= 65
            ? 'Your throat tightens. Honesty feels risky. So does lying.'
            : 'You could brush it off — or actually tell the truth for once.',
      },
    ],
    getChoices: () => [
      {
        id: 's2_open',
        label: 'Admit you’re overwhelmed and ask to talk through priorities together',
        delta: { stress: -8, motivation: +6, selfEfficacy: +5, procrastination: -6 },
        flags: { parentStyle: 'autonomy', autonomySeekingCount: 1 },
        postBeats: [
          {
            speaker: 'parent',
            text: 'They nod, slower this time. “Okay. Thank you for telling me.” Their voice steadies. “We don’t have to solve the whole semester tonight — just the next humane step.”',
          },
          {
            speaker: 'parent',
            text: '“What feels heaviest right now — the essay, the exams, or the tired?” They slide a chair out for you, like choice matters.',
          },
          {
            speaker: 'internal',
            text: 'It doesn’t fix the workload. Still, something loosens — like you’re not holding the whole building alone.',
          },
        ],
      },
      {
        id: 's2_shrug',
        label: 'Shrug and say school is “fine,” keeping it vague',
        delta: { stress: +6, motivation: -4, procrastination: +6 },
        flags: { parentStyle: 'controlling' },
        postBeats: [
          {
            speaker: 'parent',
            text: 'Their jaw tightens. “Fine doesn’t look like fine, not with those grades on the portal.”',
          },
          {
            speaker: 'parent',
            text: '“I’m not raising you to wing your future. If you won’t take this seriously, we’re going to tighten the rules until you do.”',
          },
          {
            speaker: 'internal',
            text: 'You feel smaller — watched, not seen.',
          },
        ],
      },
      {
        id: 's2_deflect',
        label: 'Snap that you don’t need a lecture right now',
        delta: { stress: +10, motivation: -8, selfEfficacy: -6, procrastination: +4 },
        flags: { parentStyle: 'controlling' },
        postBeats: [
          {
            speaker: 'parent',
            text: '“Don’t talk to me like that,” they snap back. “You think stress is an excuse?”',
          },
          {
            speaker: 'parent',
            text: '“You’re going to regret this if you keep slacking. I’m done being the nice parent about it.”',
          },
          {
            speaker: 'internal',
            text: 'Your chest buzzes with heat — anger and shame tangled. You want to disappear into your room and never explain yourself again.',
          },
        ],
      },
    ],
  },

  // SCENE 3 — SCHOOL PRESSURE
  {
    id: 's3',
    title: 'Hallway Static',
    tagline: 'Another exam gets dropped into the pile.',
    getBeats: (ctx) => {
      const parentEcho =
        ctx.flags.parentStyle === 'autonomy'
          ? 'You still hear the calmer rhythm of last night’s conversation — “we can choose what matters first.”'
          : 'You still hear the edge in their voice — “you can’t keep doing the bare minimum.”'
      return [
        {
          speaker: 'teacher',
          text: '“Pop quiz Friday,” your history teacher says, like it’s a gift. Someone groans. Someone else laughs like they’re already ahead.',
        },
        {
          speaker: 'narrator',
          text: 'In the hallway, two classmates compare color-coded notes. Their highlighters look like weapons.',
        },
        { speaker: 'internal', text: parentEcho },
        {
          speaker: 'internal',
          text:
            ctx.stats.selfEfficacy >= 55
              ? 'You don’t have to be them. You just have to be a version of you who starts.'
              : 'You feel smaller, like everyone else got a manual you never received.',
        },
      ]
    },
    getChoices: (ctx) => {
      const base = [
        {
          id: 's3_plan',
          label: 'Text yourself a rough study plan between classes',
          delta: { stress: -5, motivation: +7, procrastination: -8, selfEfficacy: +4, grades: +2 },
          flags: { planningWins: 1 },
        },
        {
          id: 's3_fine',
          label: 'Laugh along and pretend you’re on top of it',
          delta: { stress: +8, procrastination: +6, motivation: -4 },
        },
        {
          id: 's3_compare',
          label: 'Spiral quietly comparing yourself to everyone else',
          delta: { stress: +12, selfEfficacy: -10, motivation: -6, procrastination: +4 },
        },
        {
          id: 's3_ignore',
          label: 'Put earbuds in and ignore responsibilities until the bell forces you back',
          delta: { procrastination: +10, stress: +4, grades: -1 },
        },
      ]
      const helpChoice = {
        id: 's3_friend',
        label: 'Ask a friend if they want to study later — even if it’s awkward',
        delta: { stress: -6, motivation: +5, selfEfficacy: +3, procrastination: -6, grades: +1 },
        flags: { askedFriendHelp: true, autonomySeekingCount: 1 },
      }
      // Friend help is easier to attempt when motivation isn’t bottomed out
      if (ctx.stats.motivation >= 28) {
        base.splice(1, 0, helpChoice)
      }
      return base
    },
  },

  // SCENE 4 — DIGITAL DISTRACTIONS
  {
    id: 's4',
    title: 'The Pull',
    tagline: 'You meant to study. The screen had other plans.',
    getBeats: (ctx) => [
      {
        speaker: 'narrator',
        text: 'You sit at your desk. The textbook is open to the right page — a small victory. Then your phone lights up: a meme tag, a streak reminder, a clip titled “you NEED to see this.”',
      },
      {
        speaker: 'internal',
        text:
          ctx.stats.procrastination >= 60
            ? 'Relief is one tap away. Relief always wins lately.'
            : 'You know the relief is borrowed. You still want it.',
      },
      {
        speaker: 'system',
        text: 'Notifications stack like unread evidence.',
      },
    ],
    getChoices: () => [
      {
        id: 's4_phone',
        label: 'Check your phone “real quick” — then fall into a rabbit hole',
        delta: { stress: -6, procrastination: +18, motivation: -6, selfEfficacy: -5, grades: -2 },
        flags: { distractionDepth: 2 },
      },
      {
        id: 's4_game',
        label: 'Play one round of a game to “decompress” first',
        delta: { stress: -8, procrastination: +14, motivation: -4, grades: -2 },
        flags: { distractionDepth: 1 },
      },
      {
        id: 's4_focus',
        label: 'Put the phone face-down across the room and set a 20-minute timer',
        delta: { stress: -3, procrastination: -12, motivation: +6, selfEfficacy: +6, grades: +3 },
        flags: { planningWins: 1, autonomySeekingCount: 1 },
      },
      {
        id: 's4_half',
        label: 'Split the difference — YouTube in the corner while “reading”',
        delta: { stress: +2, procrastination: +10, selfEfficacy: -4, grades: -1 },
        flags: { distractionDepth: 1 },
      },
    ],
  },

  // SCENE 5 — EMOTIONAL OVERLOAD
  {
    id: 's5',
    title: 'Overload',
    tagline: 'Your thoughts start sprinting.',
    getBeats: (ctx) => [
      {
        speaker: 'narrator',
        text: 'It’s late. The lamp makes a small island of light. Everything outside that island feels enormous.',
      },
      {
        speaker: 'internal',
        text:
          ctx.stats.stress >= 72
            ? 'If you fail, it proves what you secretly fear — that you’re lazy, dramatic, not built for this.'
            : 'The worry is loud, but not deafening. You can still hear yourself underneath it.',
      },
      {
        speaker: 'internal',
        text:
          ctx.stats.procrastination >= 65
            ? 'You hate that you keep doing this to yourself. The hate doesn’t magically open the textbook.'
            : 'You’re scared, but part of you still wants to try — not perfectly, just honestly.',
      },
    ],
    getChoices: () => [
      {
        id: 's5_chunk',
        label: 'Write the smallest possible next step on a sticky note',
        delta: { stress: -10, procrastination: -8, motivation: +6, selfEfficacy: +5, grades: +1 },
        flags: { planningWins: 1 },
      },
      {
        id: 's5_support',
        label: 'Message someone you trust: “I’m not okay tonight.”',
        delta: { stress: -12, motivation: +4, selfEfficacy: +3 },
        flags: { autonomySeekingCount: 1 },
      },
      {
        id: 's5_avoid',
        label: 'Shut the laptop and go to bed without touching the work',
        delta: { stress: -4, procrastination: +12, grades: -2 },
      },
      {
        id: 's5_spiral',
        label: 'Stay up berating yourself in the notes app',
        delta: { stress: +14, motivation: -10, selfEfficacy: -8, procrastination: +6 },
      },
    ],
  },

  // SCENE 6 — ATTEMPT AT RECOVERY
  {
    id: 's6',
    title: 'Regain',
    tagline: 'You try to steer the week back.',
    getBeats: (ctx) => [
      {
        speaker: 'narrator',
        text: 'Morning light hits different when you didn’t earn your sleep. Still, you’re upright. That has to count for something.',
      },
      {
        speaker: 'internal',
        text:
          ctx.stats.selfEfficacy >= 52
            ? 'You don’t need a heroic comeback — you need a boring, repeatable start.'
            : 'Starting feels like lifting something you can’t grip. Even thinking about it makes you want to disappear into easier things.',
      },
    ],
    getChoices: (ctx) => {
      /** @type {Choice[]} */
      const choices = [
        {
          id: 's6_schedule',
          label: 'Block out tonight in realistic 30-minute segments',
          delta: { stress: -7, procrastination: -10, motivation: +6, selfEfficacy: +5, grades: +2 },
          flags: { usedStructuredRecovery: true, planningWins: 1 },
        },
        {
          id: 's6_reflect',
          label: 'Journal for ten minutes — what actually scares you about this week?',
          delta: { stress: -8, motivation: +5, procrastination: -6 },
          flags: { autonomySeekingCount: 1 },
        },
        {
          id: 's6_help',
          label: 'Email the teacher a specific question instead of suffering in silence',
          delta: { stress: -5, selfEfficacy: +6, grades: +2, motivation: +4 },
          flags: { autonomySeekingCount: 1 },
        },
        {
          id: 's6_give',
          label: 'Decide it’s too late and numb out instead',
          delta: { procrastination: +12, motivation: -10, stress: +6, grades: -2 },
        },
      ]

      const pomodoro = {
        id: 's6_pomodoro',
        label: 'Try a Pomodoro: 25 minutes focused, 5 minutes break',
        delta: { procrastination: -14, motivation: +8, stress: -5, grades: +3, selfEfficacy: +4 },
        flags: { usedStructuredRecovery: true },
        showIf: (c) => c.stats.motivation >= 32 || c.stats.selfEfficacy >= 38,
      }

      choices.splice(2, 0, pomodoro)
      return choices.filter((ch) => (ch.showIf ? ch.showIf(ctx) : true))
    },
  },

  // SCENE 7 — SECOND PARENT INTERACTION
  {
    id: 's7',
    title: 'The Check-In',
    tagline: 'They see the mess — or the effort.',
    getBeats: (ctx) => {
      const prep = ctx.stats.grades - ctx.stats.procrastination * 0.6 + (ctx.flags.planningWins || 0) * 3
      const messy = prep < 42 || ctx.stats.procrastination >= 62
      const opening =
        ctx.flags.parentStyle === 'autonomy'
          ? messy
            ? '“I can see you’re carrying a lot,” your parent says, voice softer than you expected. “I’m not here to shame you. I’m here with you.”'
            : '“You’ve been putting in real effort,” they say. “What’s still feeling heavy?”'
          : messy
            ? '“This is exactly what I was afraid of,” your parent says, arms crossed. “If you keep choosing screens over school, what future are you building?”'
            : '“Don’t get comfortable,” they warn. “One good night doesn’t fix a pattern.”'

      return [
        {
          speaker: 'narrator',
          text: 'Dinner is quieter than usual. Forks scrape plates like punctuation you can’t decode.',
        },
        { speaker: 'parent', text: opening },
        {
          speaker: 'internal',
          text:
            ctx.flags.parentStyle === 'autonomy'
              ? 'It doesn’t solve your workload — but something unclenches, just a little.'
              : 'Your stomach drops. You want to argue, disappear, prove them wrong — anything but sit in the heat of it.',
        },
      ]
    },
    getChoices: (ctx) => {
      const autonomyBoost =
        ctx.flags.parentStyle === 'autonomy'
          ? { stress: -6, motivation: +6, selfEfficacy: +5, procrastination: -6 }
          : { stress: -2, motivation: +2, selfEfficacy: +2, procrastination: -2 }

      const controlTax =
        ctx.flags.parentStyle === 'controlling'
          ? { stress: +10, motivation: -6, procrastination: +8, selfEfficacy: -5 }
          : { stress: +3, motivation: -2 }

      return [
        {
          id: 's7_boundary',
          label: 'Ask for what you need: space, a later talk, or help prioritizing',
          delta: {
            ...autonomyBoost,
            ...(ctx.flags.parentStyle === 'controlling' ? { stress: +4 } : {}),
          },
          flags: { autonomySeekingCount: 1 },
        },
        {
          id: 's7_comply',
          label: 'Nod along to keep the peace — even if you feel hollow after',
          delta: controlTax,
        },
        {
          id: 's7_truth',
          label: 'Tell the truth about how their words land in your body',
          delta:
            ctx.flags.parentStyle === 'autonomy'
              ? { stress: -8, motivation: +5, selfEfficacy: +6, procrastination: -4 }
              : { stress: +12, motivation: -8, procrastination: +6 },
        },
      ]
    },
  },

  // SCENE 8 — DEADLINE CRISIS
  {
    id: 's8',
    title: 'Deadline Night',
    tagline: 'The week collides with itself.',
    getBeats: (ctx) => {
      const crisis = ctx.stats.procrastination >= 58 || ctx.stats.stress >= 70
      return [
        {
          speaker: 'narrator',
          text: crisis
            ? 'The essay is still a skeleton. Your notes are half sentences and panic arrows. Sleep is a rumor.'
            : 'It’s not perfect — but you have paragraphs, citations circled, and a plan for the last mile.',
        },
        {
          speaker: 'internal',
          text: crisis
            ? 'Your heart hammers like a countdown you can’t pause.'
            : 'You’re tired, but there’s a strange steadiness under the tired.',
        },
      ]
    },
    getChoices: () => [
      {
        id: 's8_panic',
        label: 'Cram for hours with energy drinks and shredded focus',
        delta: { stress: +12, grades: +2, motivation: -8, selfEfficacy: -4, procrastination: -6 },
      },
      {
        id: 's8_trim',
        label: 'Cut scope smartly: do the highest-weight requirements first',
        delta: { stress: -6, procrastination: -10, grades: +3, selfEfficacy: +6, motivation: +4 },
        flags: { planningWins: 1 },
      },
      {
        id: 's8_bail',
        label: 'Avoid opening the document entirely',
        delta: { procrastination: +14, stress: +8, grades: -4, selfEfficacy: -8 },
      },
      {
        id: 's8_sleep',
        label: 'Choose sleep over an all-nighter — accept imperfect submission',
        delta: { stress: -10, grades: -2, motivation: +4, procrastination: -4, selfEfficacy: +2 },
      },
    ],
  },

  // SCENE 9 — FINAL EXAM DAY
  {
    id: 's9',
    title: 'Exam Morning',
    tagline: 'The room smells like pencil shavings and rain.',
    getBeats: (ctx) => {
      const conf =
        ctx.stats.selfEfficacy >= 58 && ctx.stats.procrastination <= 45
          ? 'You’re nervous — but it’s the clean edge of nerves, not the spinning kind.'
          : ctx.stats.stress >= 75
            ? 'Your hands are cold. The questions look like a language you half-speak.'
            : 'You don’t feel ready-ready. You feel present — which is different.'
      return [
        {
          speaker: 'narrator',
          text: 'Desks squeak. Someone flips pages too fast, like speed can trick competence.',
        },
        { speaker: 'internal', text: conf },
        {
          speaker: 'teacher',
          text: '“You may begin.”',
        },
      ]
    },
    getChoices: () => [
      {
        id: 's9_breathe',
        label: 'Take three slow breaths and start with the questions you know',
        delta: { stress: -10, grades: +3, selfEfficacy: +4 },
      },
      {
        id: 's9_rush',
        label: 'Race ahead to the hardest section to prove you can',
        delta: { stress: +8, grades: +1, procrastination: +2 },
      },
      {
        id: 's9_blank',
        label: 'Freeze for a minute staring at the page, then scramble to catch up',
        delta: { stress: +10, grades: -2, selfEfficacy: -6 },
      },
    ],
  },

  // SCENE 10 — ENDINGS (narrative + play again)
  {
    id: 's10',
    title: 'After',
    tagline: 'The week leaves a shape in you.',
    getBeats: (ctx) => {
      const endingId = ctx._endingId || 'mixed_reflection'
      const epilogues = ENDING_COPY[endingId] || ENDING_COPY.mixed_reflection
      return [
        {
          speaker: 'narrator',
          text: 'The bell rings. Hallways swell. You walk out carrying whatever version of yourself survived the week.',
        },
        ...epilogues,
      ]
    },
    getChoices: () => [
      {
        id: 'restart',
        label: 'Play again — new choices, new week',
        delta: {},
        flags: {},
      },
    ],
  },
]

/** Ending paragraphs keyed by resolveEnding ids */
const ENDING_COPY = {
  healthy_regulation: [
    {
      speaker: 'internal',
      text: 'You didn’t become a machine. You became someone who could notice panic without obeying it.',
    },
    {
      speaker: 'narrator',
      text: 'Support didn’t do the work for you — it made the work feel possible. Your effort finally had somewhere stable to land.',
    },
  ],
  severe_procrastination: [
    {
      speaker: 'internal',
      text: 'Relief and guilt keep trading places, like two sides of the same coin you never asked for.',
    },
    {
      speaker: 'narrator',
      text: 'The week slipped through short comforts. The cost shows up quietly — in grades, yes, but also in how hard it is to trust yourself next time.',
    },
  ],
  burnout: [
    {
      speaker: 'internal',
      text: 'You survived. That word feels bigger than it should.',
    },
    {
      speaker: 'narrator',
      text: 'Your body kept score even when your schedule pretended it wouldn’t. The work didn’t vanish — it hollowed you out while you tried to carry it alone.',
    },
  ],
  high_achievement_exhausted: [
    {
      speaker: 'internal',
      text: 'You can perform competence. You’re not sure you can feel it.',
    },
    {
      speaker: 'narrator',
      text: 'The numbers look fine — maybe even great — but motivation is thin ice. Achievement without recovery becomes its own kind of trap.',
    },
  ],
  balanced_growth: [
    {
      speaker: 'internal',
      text: 'It wasn’t clean. It wasn’t Instagram-study-aesthetic. It was real.',
    },
    {
      speaker: 'narrator',
      text: 'You mixed imperfect discipline with moments of honesty. The week still hurt — but it bent instead of breaking.',
    },
  ],
  survived_pressure: [
    {
      speaker: 'internal',
      text: 'You learned how to endure loud love. You’re not sure you learned how to breathe inside it.',
    },
    {
      speaker: 'narrator',
      text: 'Pressure can squeeze out performance — for a while. What it rarely teaches is how to come back to yourself when nobody is watching.',
    },
  ],
  mixed_reflection: [
    {
      speaker: 'internal',
      text: 'Some choices helped. Some didn’t. The hardest part is that you knew — even when you couldn’t stop.',
    },
    {
      speaker: 'narrator',
      text: 'Regulation isn’t a single decision; it’s a pattern built from a hundred small ones. This week was one layer in a longer story.',
    },
  ],
}

/**
 * Merge flag increments (numeric flags add; others replace).
 * @param {GameFlags} flags
 * @param {Partial<GameFlags>} patch
 */
export function mergeFlags(flags, patch) {
  const next = { ...flags }
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined) continue
    if (typeof next[k] === 'number' && typeof v === 'number') {
      next[k] = next[k] + v
    } else {
      next[k] = v
    }
  }
  return next
}

/**
 * Build beats for a scene, attaching ending id for scene 10.
 * @param {number} sceneIndex
 * @param {GameStats} stats
 * @param {GameFlags} flags
 */
export function buildSceneRuntime(sceneIndex, stats, flags) {
  const scene = SCENES[sceneIndex]
  if (!scene) return null
  const endingId = sceneIndex === SCENES.length - 1 ? resolveEnding(stats, flags) : null
  /** @type {SceneContext} */
  const ctx = { stats, flags, _endingId: endingId }
  return {
    scene,
    endingId,
    beats: scene.getBeats(ctx),
    choices: scene.getChoices(ctx),
  }
}
