import { useEffect, useState } from 'react'
import { useReducedMotion } from './useMotionPref'

/** Eases a number up from zero once `play` flips true. */
export function useCountUp(target: number, play: boolean, duration = 1400) {
  const reduced = useReducedMotion()
  const [value, setValue] = useState(play && reduced ? target : 0)

  useEffect(() => {
    if (!play) return
    if (reduced) {
      setValue(target)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      // easeOutExpo — fast arrival, long settle
      const eased = t === 1 ? 1 : 1 - 2 ** (-9 * t)
      setValue(target * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
      else setValue(target)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, play, duration, reduced])

  return value
}
