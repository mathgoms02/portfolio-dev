import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useMotionPref'

const GLYPHS = '▚▞█▓▒░/\\|<>[]{}=+*·:;$#%&@01'

interface Options {
  /** Milliseconds each character spends resolving. */
  speed?: number
  /** Extra frames of noise before a character locks in, per index. */
  scatter?: number
  /** Start the animation. Flipping this back to false resets to the plain text. */
  play?: boolean
}

/**
 * Resolves `text` out of a field of noise, one character at a time.
 * Returns the string to render — the caller stays in control of markup.
 */
export function useScramble(text: string, { speed = 26, scatter = 3, play = true }: Options = {}) {
  const reduced = useReducedMotion()
  // Always start from the real string: if requestAnimationFrame never runs
  // (hidden tab, throttled renderer), the text simply stays readable.
  const [output, setOutput] = useState(text)
  const frame = useRef(0)
  const raf = useRef(0)

  useEffect(() => {
    if (reduced || !play) {
      setOutput(text)
      return
    }

    const chars = [...text]
    // Each character locks in at its own moment, staggered left to right.
    const locks = chars.map((_, i) => i * 0.6 + Math.random() * scatter)
    const total = Math.max(...locks, 0) + 6
    let last = 0
    frame.current = 0

    const tick = (now: number) => {
      if (now - last >= speed) {
        last = now
        frame.current += 1
        const f = frame.current
        setOutput(
          chars
            .map((ch, i) => {
              if (ch === ' ') return ' '
              if (f >= locks[i]) return ch
              if (f < locks[i] - 5) return ' '
              return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
            })
            .join(''),
        )
        if (f > total) {
          setOutput(text)
          return
        }
      }
      raf.current = requestAnimationFrame(tick)
    }

    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [text, speed, scatter, play, reduced])

  return output
}
