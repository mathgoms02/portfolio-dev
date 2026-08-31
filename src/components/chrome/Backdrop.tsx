import { useEffect, useRef } from 'react'
import { useIsTouch } from '../../lib/useMediaQuery'
import { useReducedMotion } from '../../lib/useMotionPref'
import styles from './Backdrop.module.css'

const TAU = Math.PI * 2

/** Ink and amber, as raw channels so they can be mixed per particle. */
const INK = [237, 234, 228]
const AMBER = [255, 176, 0]

/** One filing per this many CSS pixels of viewport, capped below. */
const DENSITY = 4_500
const MAX = 520

/**
 * How quickly the pointer's pull decays. At this distance the alignment is
 * half — large enough that the whole field leans, with no hard edge.
 */
const FALLOFF = 210

/**
 * Strokes are grouped into buckets of similar colour and opacity so the whole
 * field is drawn in a few dozen calls instead of one per filing. A separate
 * `strokeStyle` per particle would defeat batching entirely.
 */
const MIX_STEPS = 6
const ALPHA_STEPS = 7
const MAX_ALPHA = 0.4

/** Signed shortest rotation from `from` to `to`. */
function angleDelta(to: number, from: number) {
  let d = (to - from) % TAU
  if (d > Math.PI) d -= TAU
  if (d < -Math.PI) d += TAU
  return d
}

interface Filing {
  x: number
  y: number
  /** drift, slow enough that the lattice never reads as fixed */
  vx: number
  vy: number
  /** 0 → far, 1 → near; drives length and opacity */
  depth: number
  len: number
  alpha: number
  /** current orientation, eased toward the target every frame */
  angle: number
  /** where it points when the pointer is far away, itself slowly turning */
  idle: number
  spin: number
}

/**
 * Iron filings around a magnet: every mark is a short stroke that turns to face
 * the pointer, strongly near it and barely at the far corners, so the field
 * shows a gradient from order to drift.
 *
 * The pointer changes orientation and hue, never the background luminance —
 * a one-pixel stroke adds nothing measurable under a paragraph, so text
 * contrast is the same wherever the cursor sits.
 */
export function Backdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  const isTouch = useIsTouch()

  useEffect(() => {
    if (reduced || isTouch) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let width = 0
    let height = 0
    let filings: Filing[] = []

    const build = () => {
      const count = Math.min(MAX, Math.round((width * height) / DENSITY))
      filings = Array.from({ length: count }, () => {
        const depth = Math.random()
        const idle = Math.random() * TAU
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.06,
          vy: (Math.random() - 0.5) * 0.06,
          depth,
          len: 3.5 + depth * 6,
          alpha: 0.07 + depth * 0.16,
          angle: idle,
          idle,
          // the field keeps turning on its own, so a still pointer is not a still page
          spin: (Math.random() - 0.5) * 0.0055,
        }
      })
    }

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2)
      width = innerWidth
      height = innerHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.lineCap = 'round'
      build()
    }
    resize()
    addEventListener('resize', resize)

    const pointer = { x: width / 2, y: height / 2, inside: 0 }
    const eased = { x: width / 2, y: height / 2, inside: 0 }

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.inside = 1
    }
    const onLeave = () => {
      pointer.inside = 0
    }
    addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)

    // reused across frames; one slot per (colour, opacity) bucket
    const buckets: (Path2D | undefined)[] = new Array(MIX_STEPS * ALPHA_STEPS).fill(undefined)

    let raf = 0
    let last = 0

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (document.hidden) return
      if (now - last < 20) return
      const dt = Math.min(3, (now - last) / 16.67)
      last = now

      // the pointer lags a little, so the field sweeps rather than snaps
      eased.x += (pointer.x - eased.x) * 0.12
      eased.y += (pointer.y - eased.y) * 0.12
      eased.inside += (pointer.inside - eased.inside) * 0.14

      ctx.clearRect(0, 0, width, height)
      ctx.lineWidth = 1

      for (const f of filings) {
        f.x += f.vx * dt
        f.y += f.vy * dt
        if (f.x < -8) f.x = width + 8
        if (f.x > width + 8) f.x = -8
        if (f.y < -8) f.y = height + 8
        if (f.y > height + 8) f.y = -8

        const dx = eased.x - f.x
        const dy = eased.y - f.y
        const dist = Math.hypot(dx, dy)
        // smooth inverse-square pull: strong at the pointer, never zero anywhere
        const pull = eased.inside / (1 + (dist / FALLOFF) ** 2)

        f.idle += f.spin * dt
        // The target is a blend, not a switch: close filings lock onto the
        // pointer while distant ones keep turning on their own, which is what
        // gives the field a gradient from order to drift.
        const toPointer = Math.atan2(dy, dx)
        const target = f.idle + angleDelta(toPointer, f.idle) * Math.min(1, pull * 1.5)
        f.angle += angleDelta(target, f.angle) * Math.min(1, (0.03 + pull * 0.24) * dt)

        // near the pointer the filings stretch and warm toward amber
        const mix = Math.min(1, pull * 1.15)
        const len = f.len * (1 + pull * 0.55)
        const alpha = f.alpha * (1 + pull * 0.6)

        const hx = (Math.cos(f.angle) * len) / 2
        const hy = (Math.sin(f.angle) * len) / 2

        const mi = Math.min(MIX_STEPS - 1, Math.floor(mix * MIX_STEPS))
        const ai = Math.min(ALPHA_STEPS - 1, Math.floor((alpha / MAX_ALPHA) * ALPHA_STEPS))
        const path = buckets[mi * ALPHA_STEPS + ai] ?? (buckets[mi * ALPHA_STEPS + ai] = new Path2D())
        path.moveTo(f.x - hx, f.y - hy)
        path.lineTo(f.x + hx, f.y + hy)
      }

      for (let mi = 0; mi < MIX_STEPS; mi += 1) {
        const m = (mi + 0.5) / MIX_STEPS
        const r = Math.round(INK[0] + (AMBER[0] - INK[0]) * m)
        const g = Math.round(INK[1] + (AMBER[1] - INK[1]) * m)
        const b = Math.round(INK[2] + (AMBER[2] - INK[2]) * m)
        for (let ai = 0; ai < ALPHA_STEPS; ai += 1) {
          const path = buckets[mi * ALPHA_STEPS + ai]
          if (!path) continue
          const a = ((ai + 0.5) / ALPHA_STEPS) * MAX_ALPHA
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`
          ctx.stroke(path)
          buckets[mi * ALPHA_STEPS + ai] = undefined
        }
      }
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', resize)
      removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [reduced, isTouch])

  if (reduced || isTouch) return null

  return <canvas ref={canvasRef} className={styles.backdrop} aria-hidden="true" />
}
