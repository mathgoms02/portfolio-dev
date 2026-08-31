import { useEffect, useRef, useState } from 'react'
import { useIsTouch } from '../../lib/useMediaQuery'
import styles from './AsciiPortrait.module.css'

/** Dark to light. The glyph gets denser as the pixel gets brighter. */
const RAMP = ' .:-=+*oyk#%@'
/** Target width of one character on screen, in CSS pixels. */
const CHAR_W = 4.4
/** A monospace cell is about twice as tall as it is wide. */
const CELL_RATIO = 0.5

interface Props {
  /** Source image, already sized and graded. */
  src: string
  /** Flips once the portrait has resolved out of its ASCII state. */
  resolved: boolean
  /** The plate is hovered — light up the pointer spotlight. */
  hover: boolean
  /** Fires once the character grid has been drawn at least once. */
  onReady?: () => void
}

/**
 * Renders the portrait as characters on two canvases: one in ink for the
 * entrance, one in amber that a pointer-tracked radial mask reveals on hover.
 *
 * Both are painted once per size. The interaction is a CSS mask driven by two
 * custom properties, so moving the pointer costs two style writes rather than
 * a repaint of several thousand glyphs.
 */
export function AsciiPortrait({ src, resolved, hover, onReady }: Props) {
  const inkRef = useRef<HTMLCanvasElement>(null)
  const hotRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const [size, setSize] = useState<{ w: number; h: number } | null>(null)
  const [painted, setPainted] = useState(false)
  const isTouch = useIsTouch()

  // --- track the rendered size; the character grid is built for the screen,
  //     not for the source image ---
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      if (width < 40 || height < 40) return
      setSize((prev) =>
        prev && Math.abs(prev.w - width) < 4 && Math.abs(prev.h - height) < 4
          ? prev
          : { w: Math.round(width), h: Math.round(height) },
      )
    })
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [])

  // --- load the source once ---
  useEffect(() => {
    let cancelled = false
    const img = new Image()
    img.decoding = 'async'
    img.src = src
    const done = () => {
      if (!cancelled) {
        imageRef.current = img
        setSize((s) => (s ? { ...s } : s)) // nudge the paint effect
      }
    }
    if (img.complete) done()
    else img.addEventListener('load', done, { once: true })
    return () => {
      cancelled = true
      img.removeEventListener('load', done)
    }
  }, [src])

  // --- paint ---
  useEffect(() => {
    const img = imageRef.current
    const ink = inkRef.current
    const hot = hotRef.current
    if (!img || !ink || !hot || !size) return

    const cols = Math.max(24, Math.round(size.w / CHAR_W))
    const rows = Math.max(24, Math.round((size.h / CHAR_W) * CELL_RATIO))

    const sampler = document.createElement('canvas')
    sampler.width = cols
    sampler.height = rows
    const sctx = sampler.getContext('2d', { willReadFrequently: true })
    if (!sctx) return
    sctx.drawImage(img, 0, 0, cols, rows)

    let data: Uint8ClampedArray
    try {
      data = sctx.getImageData(0, 0, cols, rows).data
    } catch {
      return // tainted canvas — leave the photograph alone
    }

    const dpr = Math.min(devicePixelRatio || 1, 2)
    const cellW = (size.w / cols) * dpr
    const cellH = (size.h / rows) * dpr
    const w = Math.round(size.w * dpr)
    const h = Math.round(size.h * dpr)

    // --- first pass: luminance and coverage per cell ---
    const lumGrid = new Float32Array(cols * rows)
    const covGrid = new Float32Array(cols * rows)
    for (let k = 0; k < cols * rows; k += 1) {
      const i4 = k * 4
      const cover = data[i4 + 3] / 255
      const lum = (0.2126 * data[i4] + 0.7152 * data[i4 + 1] + 0.0722 * data[i4 + 2]) / 255
      covGrid[k] = cover
      lumGrid[k] = lum
    }

    // --- unsharp mask: a portrait is mostly flat shirt and flat backdrop, and a
    //     global curve leaves the face with three glyphs. Boosting each cell
    //     against its 3x3 neighbourhood puts the features back. ---
    const blur = new Float32Array(cols * rows)
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        let sum = 0
        let n = 0
        for (let dr = -1; dr <= 1; dr += 1) {
          for (let dc = -1; dc <= 1; dc += 1) {
            const rr = r + dr
            const cc = c + dc
            if (rr < 0 || rr >= rows || cc < 0 || cc >= cols) continue
            sum += lumGrid[rr * cols + cc]
            n += 1
          }
        }
        blur[r * cols + c] = sum / n
      }
    }

    const sharp = new Float32Array(cols * rows)
    const lums: number[] = []
    for (let k = 0; k < cols * rows; k += 1) {
      const v = lumGrid[k] + (lumGrid[k] - blur[k]) * 1.6
      sharp[k] = v
      if (covGrid[k] >= 0.35 && lumGrid[k] >= 0.055) lums.push(v)
    }
    if (lums.length === 0) return

    // stretch the range the subject actually occupies
    const sorted = [...lums].sort((a, b) => a - b)
    const p = (q: number) => sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))]
    const lo = p(0.015)
    const hi = p(0.985)
    const span = Math.max(0.08, hi - lo)

    const cells: { x: number; y: number; glyph: string; level: number }[] = []
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const k = r * cols + c
        if (covGrid[k] < 0.35 || lumGrid[k] < 0.055) continue // studio backdrop
        // gamma < 1 lifts the mid tones, which is where the face lives
        const level = Math.min(1, Math.max(0, (sharp[k] - lo) / span) ** 0.82)
        const glyph = RAMP[Math.round(level * (RAMP.length - 1))]
        if (glyph === ' ') continue
        cells.push({ x: c * cellW, y: r * cellH, glyph, level })
      }
    }

    const draw = (canvas: HTMLCanvasElement, color: string, boost: number) => {
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.clearRect(0, 0, w, h)
      ctx.font = `${cellH * 1.02}px "IBM Plex Mono", ui-monospace, monospace`
      ctx.textBaseline = 'top'
      ctx.fillStyle = color
      for (const cell of cells) {
        // the glyph already carries the tone, so opacity only needs to keep the
        // darkest characters from reading as solid ink
        ctx.globalAlpha = Math.min(1, 0.46 + cell.level * boost)
        ctx.fillText(cell.glyph, cell.x, cell.y)
      }
      ctx.globalAlpha = 1
    }

    draw(ink, '#edeae4', 0.54)
    draw(hot, '#ffb000', 0.6)
    setPainted(true)
    onReady?.()
  }, [size, onReady])

  // The spotlight is a mask position, not a repaint.
  useEffect(() => {
    if (isTouch) return
    const wrap = wrapRef.current
    if (!wrap) return
    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect()
      wrap.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
      wrap.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [isTouch])

  return (
    <div
      ref={wrapRef}
      className={styles.ascii}
      data-painted={painted || undefined}
      data-resolved={resolved || undefined}
      data-hover={(hover && !isTouch) || undefined}
      aria-hidden="true"
    >
      <canvas ref={inkRef} className={styles.ink} />
      <canvas ref={hotRef} className={styles.hot} />
    </div>
  )
}
