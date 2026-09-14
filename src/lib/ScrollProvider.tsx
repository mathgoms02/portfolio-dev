import Lenis from 'lenis'
import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
  type ReactNode,
} from 'react'
import { useReducedMotion } from './useMotionPref'

interface ScrollState {
  /** 0 → 1 across the whole document. */
  progress: number
  /** Pixels scrolled from the top. */
  y: number
  /** −1 up, 1 down, 0 idle. */
  direction: number
}

interface ScrollActions {
  /** Smooth-scroll to an element id or absolute offset. */
  scrollTo: (target: string | number, offset?: number, immediate?: boolean) => void
  /** Take one lock on the page scroll. Every stop() needs a matching start(). */
  stop: () => void
  /** Release one lock; the page only scrolls again when the last one goes. */
  start: () => void
}

type ScrollValue = ScrollState & ScrollActions

const StateContext = createContext<ScrollState | null>(null)
const ActionsContext = createContext<ScrollActions | null>(null)

/**
 * The page scrolls the <html> element, not <body> — global.css sets
 * `overflow-x: hidden` on <html>, which stops <body>'s overflow from
 * propagating to the viewport. So the lock has to land on <html>, and it
 * pads out the scrollbar it removes to keep the layout still.
 */
function lockDocument() {
  const el = document.documentElement
  const gap = window.innerWidth - el.clientWidth
  el.style.overflow = 'hidden'
  if (gap > 0) el.style.paddingRight = `${gap}px`
}

function unlockDocument() {
  const el = document.documentElement
  el.style.overflow = ''
  el.style.paddingRight = ''
}

export function ScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const locks = useRef(0)
  const reduced = useReducedMotion()
  const [state, setState] = useState<ScrollState>({ progress: 0, y: 0, direction: 0 })

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
    // A modal may already hold a lock when the instance is rebuilt.
    if (locks.current > 0) lenis.stop()

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

  // These never change identity: they only ever touch refs. Rebuilding them on
  // every scroll frame used to retrigger every effect that depends on them.
  const scrollTo = useCallback<ScrollActions['scrollTo']>((target, offset = 0, immediate = false) => {
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
  }, [])

  const stop = useCallback(() => {
    locks.current += 1
    if (locks.current > 1) return
    lenisRef.current?.stop()
    lockDocument()
  }, [])

  const start = useCallback(() => {
    if (locks.current === 0) return
    locks.current -= 1
    if (locks.current > 0) return
    unlockDocument()
    lenisRef.current?.start()
  }, [])

  const actions = useMemo<ScrollActions>(
    () => ({ scrollTo, stop, start }),
    [scrollTo, stop, start],
  )

  return (
    <ActionsContext.Provider value={actions}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </ActionsContext.Provider>
  )
}

/** Scroll position plus the actions. Only for components that need the numbers. */
export function useScrollControl(): ScrollValue {
  const state = useContext(StateContext)
  const actions = useContext(ActionsContext)
  if (!state || !actions) throw new Error('useScrollControl must be used inside <ScrollProvider>')
  return { ...state, ...actions }
}

/**
 * Actions only. Components that use this do not re-render on every scroll
 * frame — which is what modals want.
 */
export function useScrollActions(): ScrollActions {
  const ctx = useContext(ActionsContext)
  if (!ctx) throw new Error('useScrollActions must be used inside <ScrollProvider>')
  return ctx
}
