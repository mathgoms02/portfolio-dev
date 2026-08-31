import { useRef, type ReactNode } from 'react'
import { useIsTouch } from '../../lib/useMediaQuery'
import { useReducedMotion } from '../../lib/useMotionPref'

interface Props {
  children: ReactNode
  /** How far the element is allowed to drift, in pixels. */
  strength?: number
  className?: string
}

/** Nudges its child toward the pointer while hovered. */
export function Magnetic({ children, strength = 14, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const isTouch = useIsTouch()
  const reduced = useReducedMotion()
  const inert = isTouch || reduced

  return (
    <span
      ref={ref}
      className={className}
      style={{ display: 'inline-block', willChange: inert ? undefined : 'transform' }}
      onPointerMove={
        inert
          ? undefined
          : (e) => {
              const el = ref.current
              if (!el) return
              const r = el.getBoundingClientRect()
              const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2)
              const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
              el.style.transition = 'transform 120ms linear'
              el.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`
            }
      }
      onPointerLeave={
        inert
          ? undefined
          : () => {
              const el = ref.current
              if (!el) return
              el.style.transition = 'transform 520ms var(--ease-snap)'
              el.style.transform = 'translate3d(0,0,0)'
            }
      }
    >
      {children}
    </span>
  )
}
