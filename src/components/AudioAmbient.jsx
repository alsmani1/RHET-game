import { useEffect, useRef } from 'react'

/**
 * Lightweight Web Audio "bed": low-volume filtered noise + two oscillators.
 * Responds to stress (harsher harmonics) when unmuted.
 * @param {{ muted: boolean, stress: number }} props
 */
export default function AudioAmbient({ muted, stress }) {
  const ctxRef = useRef(null)
  const nodesRef = useRef(null)

  useEffect(() => {
    if (muted || typeof window === 'undefined') return
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    const ctx = new AC()
    const master = ctx.createGain()
    master.gain.value = 0.06
    master.connect(ctx.destination)

    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = 110

    const osc2 = ctx.createOscillator()
    osc2.type = 'triangle'
    osc2.frequency.value = 164.8

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 420

    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
    const ch = noiseBuf.getChannelData(0)
    for (let i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * 0.15
    const noise = ctx.createBufferSource()
    noise.buffer = noiseBuf
    noise.loop = true
    const noiseGain = ctx.createGain()
    noiseGain.gain.value = 0.04

    osc.connect(filter)
    osc2.connect(filter)
    filter.connect(master)
    noise.connect(noiseGain)
    noiseGain.connect(master)

    osc.start()
    osc2.start()
    noise.start()
    ctxRef.current = ctx
    nodesRef.current = { master, osc, osc2, filter, noiseGain }

    return () => {
      try {
        osc.stop()
        osc2.stop()
        noise.stop()
        ctx.close()
      } catch {
        /* ignore */
      }
    }
  }, [muted])

  useEffect(() => {
    const n = nodesRef.current
    const ctx = ctxRef.current
    if (!n || !ctx || muted) return
    const t = ctx.currentTime
    const harsh = stress / 100
    n.filter.frequency.setTargetAtTime(320 + (1 - harsh) * 280, t, 0.05)
    n.osc2.frequency.setTargetAtTime(164.8 + harsh * 40, t, 0.08)
    n.master.gain.setTargetAtTime(0.035 + harsh * 0.04, t, 0.1)
  }, [stress, muted])

  return null
}
