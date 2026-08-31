import {
  createContext, useCallback, useContext, useMemo, useRef, useState,
  type ReactNode,
} from 'react'
import { SECTIONS } from '../data/sections'
import { useLocale } from '../i18n/LocaleContext'
import { useScrollControl } from './ScrollProvider'
import { useReducedMotion } from './useMotionPref'
import styles from './TransitionProvider.module.css'

const SLATS = 7
const COVER_MS = 420
const HOLD_MS = 90
const UNCOVER_MS = 520

type Phase = 'idle' | 'cover' | 'uncover'

interface TransitionValue {
  /** Jump to a section behind a closing curtain. */
  navigate: (id: string, offset?: number) => void
  phase: Phase
}

const TransitionContext = createContext<TransitionValue | null>(null)

/**
 * Deliberate navigation — the rail, the header, the command palette — happens
 * behind a curtain of vertical slats rather than as a long smooth scroll, so a
 * jump across eight thousand pixels reads as a cut instead of a blur.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const { scrollTo } = useScrollControl()
  const { locale } = useLocale()
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('idle')
  const [label, setLabel] = useState('')
  const busy = useRef(false)

  const navigate = useCallback(
    (id: string, offset = 0) => {
      if (reduced) {
        scrollTo(id, offset)
        return
      }
      if (busy.current) return
      busy.current = true
      const section = SECTIONS.find((s) => s.id === id)
      setLabel(section ? `${section.num} · ${section.label[locale]}` : id)
      setPhase('cover')

      window.setTimeout(() => {
        scrollTo(id, offset, true)
        window.setTimeout(() => {
          setPhase('uncover')
          window.setTimeout(() => {
            setPhase('idle')
            busy.current = false
          }, UNCOVER_MS + SLATS * 40)
        }, HOLD_MS)
      }, COVER_MS + SLATS * 40)
    },
    [locale, reduced, scrollTo],
  )

  const value = useMemo<TransitionValue>(() => ({ navigate, phase }), [navigate, phase])

  return (
    <TransitionContext.Provider value={value}>
      {children}
      {reduced ? null : (
        <div className={styles.curtain} data-phase={phase} aria-hidden="true">
          {Array.from({ length: SLATS }, (_, i) => (
            <span key={i} style={{ '--i': i, '--n': SLATS } as React.CSSProperties} />
          ))}
          <span className={styles.label}>{label}</span>
        </div>
      )}
    </TransitionContext.Provider>
  )
}

export function useTransition(): TransitionValue {
  const ctx = useContext(TransitionContext)
  if (!ctx) throw new Error('useTransition must be used inside <TransitionProvider>')
  return ctx
}
