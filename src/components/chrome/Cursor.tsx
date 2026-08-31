import { useEffect, useRef, useState } from 'react'
import { useIsTouch } from '../../lib/useMediaQuery'
import { useReducedMotion } from '../../lib/useMotionPref'
import styles from './Cursor.module.css'

type Mode = 'default' | 'link' | 'view' | 'drag' | 'text'

/**
 * A crosshair that trails the pointer and reads the element underneath.
 * Any element can annotate it with `data-cursor="view"` and `data-cursor-label`.
 */
export function Cursor() {
  const isTouch = useIsTouch()
  const reduced = useReducedMotion()
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<Mode>('default')
  const [label, setLabel] = useState('')
  const [visible, setVisible] = useState(false)

  const disabled = isTouch || reduced

  useEffect(() => {
    if (disabled) {
      document.body.dataset.cursor = 'off'
      return
    }
    document.body.dataset.cursor = 'on'

    const target = { x: innerWidth / 2, y: innerHeight / 2 }
    const eased = { x: target.x, y: target.y }
    let raf = 0

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      if (!visible) setVisible(true)

      const el = (e.target as HTMLElement)?.closest<HTMLElement>('[data-cursor], a, button')
      if (!el) {
        setMode('default')
        setLabel('')
        return
      }
      const declared = el.dataset.cursor as Mode | undefined
      setMode(declared ?? (el.tagName === 'A' || el.tagName === 'BUTTON' ? 'link' : 'default'))
      setLabel(el.dataset.cursorLabel ?? '')
    }

    const tick = () => {
      // the dot snaps, the ring lags — that gap is the whole effect
      eased.x += (target.x - eased.x) * 0.16
      eased.y += (target.y - eased.y) * 0.16
      if (dot.current) {
        dot.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`
      }
      if (ring.current) {
        ring.current.style.transform = `translate3d(${eased.x}px, ${eased.y}px, 0)`
      }
      raf = requestAnimationFrame(tick)
    }

    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerenter', onEnter)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('pointerenter', onEnter)
      delete document.body.dataset.cursor
    }
    // `visible` is intentionally excluded: it only gates the first paint.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled])

  if (disabled) return null

  return (
    <div className={styles.root} data-visible={visible || undefined} aria-hidden="true">
      <div ref={ring} className={styles.ring} data-mode={mode}>
        <span className={styles.arm} data-side="n" />
        <span className={styles.arm} data-side="e" />
        <span className={styles.arm} data-side="s" />
        <span className={styles.arm} data-side="w" />
        {label ? <span className={styles.label}>{label}</span> : null}
      </div>
      <div ref={dot} className={styles.dot} data-mode={mode} />
    </div>
  )
}
