import Lenis from 'lenis'
import {
  createContext, useContext, useEffect, useMemo, useRef, useState,
  type ReactNode,
} from 'react'
import { useReducedMotion } from './useMotionPref'

interface ScrollValue {
  /** Smooth-scroll to an element id or absolute offset. */
  scrollTo: (target: string | number, offset?: number, immediate?: boolean) => void
  /** 0 → 1 across the whole document. */
  progress: number
  /** Pixels scrolled from the top. */
  y: number
  /** −1 up, 1 down, 0 idle. */
  direction: number
  stop: () => void
  start: () => void
}

const ScrollContext = createContext<ScrollValue | null>(null)

export function ScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const reduced = useReducedMotion()
  const [state, setState] = useState({ progress: 0, y: 0, direction: 0 })

  useEffect(() => {
    if (reduced) {
      // Native scrolling only; still track position for the progress rail.
      const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        setState({
          y: window.scrollY,
          progress: max > 0 ? window.scrollY / max : 0,
          direction: 0,
        })
      }
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      wheelMultiplier: 0.95,
      touchMultiplier: 1.6,
      lerp: 0.09,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ({ scroll, progress, direction }: Lenis) => {
      setState({ y: scroll, progress, direction })
    })

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reduced])

  const value = useMemo<ScrollValue>(
    () => ({
      ...state,
      scrollTo: (target, offset = 0, immediate = false) => {
        const lenis = lenisRef.current
        if (lenis) {
          lenis.scrollTo(typeof target === 'string' ? `#${target}` : target, {
            offset,
            duration: immediate ? 0 : 1.25,
            immediate,
            force: true,
          })
          return
        }
        if (typeof target === 'number') {
          window.scrollTo({ top: target + offset, behavior: 'auto' })
        } else {
          const el = document.getElementById(target)
          if (el) window.scrollTo({ top: el.offsetTop + offset, behavior: 'auto' })
        }
      },
      stop: () => lenisRef.current?.stop(),
      start: () => lenisRef.current?.start(),
    }),
    [state],
  )

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
}

export function useScrollControl(): ScrollValue {
  const ctx = useContext(ScrollContext)
  if (!ctx) throw new Error('useScrollControl must be used inside <ScrollProvider>')
  return ctx
}
