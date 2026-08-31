import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
  type ReactNode,
} from 'react'
import type { L, Locale } from '../data/types'

const STORAGE_KEY = 'mg.locale'

interface LocaleValue {
  locale: Locale
  setLocale: (l: Locale) => void
  toggle: () => void
  /** Resolve a bilingual value to the active locale. */
  t: <T>(value: Record<Locale, T>) => T
}

const LocaleContext = createContext<LocaleValue | null>(null)

function detect(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'pt' || saved === 'en') return saved
  } catch {
    /* storage can be unavailable — fall through to the browser hint */
  }
  const nav = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'pt'
  return nav.startsWith('pt') ? 'pt' : 'en'
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detect)

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    try {
      localStorage.setItem(STORAGE_KEY, l)
    } catch {
      /* non-fatal: the choice simply will not persist */
    }
  }, [])

  const toggle = useCallback(() => {
    setLocaleState((prev) => {
      const next: Locale = prev === 'pt' ? 'en' : 'pt'
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        /* non-fatal */
      }
      return next
    })
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale === 'pt' ? 'pt-BR' : 'en'
  }, [locale])

  const value = useMemo<LocaleValue>(
    () => ({
      locale,
      setLocale,
      toggle,
      t: (<T,>(v: Record<Locale, T>) => v[locale]) as LocaleValue['t'],
    }),
    [locale, setLocale, toggle],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used inside <LocaleProvider>')
  return ctx
}

/** Shorthand for components that only need the resolver. */
export function useT() {
  return useLocale().t
}

export type { L, Locale }
