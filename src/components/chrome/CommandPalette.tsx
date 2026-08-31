import { useEffect, useMemo, useRef, useState } from 'react'
import { SECTIONS } from '../../data/sections'
import { contact, cvFile } from '../../data/profile'
import { projects } from '../../data/projects'
import { useLocale } from '../../i18n/LocaleContext'
import { ui } from '../../i18n/ui'
import { useScrollControl } from '../../lib/ScrollProvider'
import { useTransition } from '../../lib/TransitionProvider'
import { setMotionOverride, useReducedMotion } from '../../lib/useMotionPref'
import styles from './CommandPalette.module.css'

type Group = 'sections' | 'projects' | 'links' | 'actions'

interface Command {
  id: string
  group: Group
  label: string
  hint?: string
  run: () => void
}

interface Props {
  open: boolean
  onClose: () => void
}

/** Subsequence match — "imp" finds "Impact Orchestrator". */
function matches(haystack: string, needle: string): boolean {
  if (!needle) return true
  const h = haystack.toLowerCase()
  const n = needle.toLowerCase()
  if (h.includes(n)) return true
  let i = 0
  for (const ch of h) {
    if (ch === n[i]) i += 1
    if (i === n.length) return true
  }
  return false
}

export function CommandPalette({ open, onClose }: Props) {
  const { locale, toggle, t } = useLocale()
  const { stop, start } = useScrollControl()
  const { navigate } = useTransition()
  const reduced = useReducedMotion()
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const commands = useMemo<Command[]>(() => {
    const go = (id: string) => () => {
      onClose()
      requestAnimationFrame(() => navigate(id))
    }

    const sections: Command[] = SECTIONS.map((s) => ({
      id: `sec-${s.id}`,
      group: 'sections',
      label: s.label[locale],
      hint: s.num,
      run: go(s.id),
    }))

    const work: Command[] = projects.map((p) => ({
      id: `prj-${p.id}`,
      group: 'projects',
      label: p.name,
      hint: t(p.tagline),
      run: () => {
        onClose()
        requestAnimationFrame(() => {
          navigate(`project-${p.id}`, -80)
        })
      },
    }))

    const links: Command[] = contact.map((c) => ({
      id: `lnk-${c.label}`,
      group: 'links',
      label: c.label,
      hint: c.handle,
      run: () => {
        onClose()
        window.open(c.href, c.href.startsWith('mailto:') ? '_self' : '_blank', 'noopener,noreferrer')
      },
    }))

    const actions: Command[] = [
      {
        id: 'act-lang',
        group: 'actions',
        label: ui.palette.toggleLang[locale],
        hint: locale === 'pt' ? 'EN' : 'PT',
        run: () => {
          toggle()
          onClose()
        },
      },
      {
        id: 'act-cv',
        group: 'actions',
        label: ui.palette.downloadCv[locale],
        hint: 'PDF',
        run: () => {
          onClose()
          const a = document.createElement('a')
          a.href = `${import.meta.env.BASE_URL}${cvFile}`
          a.download = cvFile
          a.click()
        },
      },
      {
        id: 'act-motion',
        group: 'actions',
        label: reduced
          ? (locale === 'pt' ? 'Reativar animações' : 'Restore animations')
          : ui.palette.toggleMotion[locale],
        hint: reduced ? 'on' : 'off',
        run: () => {
          setMotionOverride(!reduced)
          onClose()
          // the preference is read at mount by several hooks; a reload is the
          // honest way to apply it everywhere at once
          window.setTimeout(() => window.location.reload(), 120)
        },
      },
      {
        id: 'act-copy',
        group: 'actions',
        label: ui.palette.copyEmail[locale],
        hint: 'math.gomsx3@gmail.com',
        run: () => {
          navigator.clipboard?.writeText('math.gomsx3@gmail.com').catch(() => {})
          onClose()
        },
      },
    ]

    return [...sections, ...work, ...actions, ...links]
  }, [locale, navigate, onClose, reduced, t, toggle])

  const results = useMemo(
    () => commands.filter((c) => matches(`${c.label} ${c.hint ?? ''}`, query)),
    [commands, query],
  )

  // grouped, preserving the declared order
  const grouped = useMemo(() => {
    const order: Group[] = ['sections', 'projects', 'actions', 'links']
    return order
      .map((g) => ({ group: g, items: results.filter((r) => r.group === g) }))
      .filter((g) => g.items.length > 0)
  }, [results])

  useEffect(() => setCursor(0), [query])

  useEffect(() => {
    if (!open) {
      setQuery('')
      start()
      return
    }
    stop()
    const id = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(id)
  }, [open, start, stop])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setCursor((c) => (c + 1) % Math.max(1, results.length))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setCursor((c) => (c - 1 + results.length) % Math.max(1, results.length))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        results[cursor]?.run()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, results, cursor, onClose])

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>('[data-active="true"]')
      ?.scrollIntoView({ block: 'nearest' })
  }, [cursor])

  if (!open) return null

  let flat = -1

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={ui.hero.palette[locale]}>
      <button type="button" className={styles.scrim} onClick={onClose} tabIndex={-1} aria-hidden="true" />

      <div className={styles.panel}>
        <div className={styles.field}>
          <span className={styles.prompt} aria-hidden="true">›</span>
          <input
            ref={inputRef}
            className={styles.input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={ui.palette.placeholder[locale]}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className={styles.esc}>esc</kbd>
        </div>

        <div className={styles.results} ref={listRef}>
          {grouped.length === 0 ? (
            <p className={styles.empty}>{ui.palette.empty[locale]}</p>
          ) : (
            grouped.map(({ group, items }) => (
              <section key={group} className={styles.group}>
                <h3 className={styles.groupLabel}>{ui.palette[group][locale]}</h3>
                <ul>
                  {items.map((cmd) => {
                    flat += 1
                    const active = flat === cursor
                    const index = flat
                    return (
                      <li key={cmd.id}>
                        <button
                          type="button"
                          className={styles.row}
                          data-active={active}
                          onMouseMove={() => setCursor(index)}
                          onClick={cmd.run}
                        >
                          <span className={styles.rowLabel}>{cmd.label}</span>
                          {cmd.hint ? <span className={styles.rowHint}>{cmd.hint}</span> : null}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </section>
            ))
          )}
        </div>

        <footer className={styles.foot}>
          <span><kbd>↑</kbd><kbd>↓</kbd> {ui.palette.hintNav[locale]}</span>
          <span><kbd>↵</kbd> {ui.palette.hintOpen[locale]}</span>
          <span><kbd>esc</kbd> {ui.palette.hintClose[locale]}</span>
        </footer>
      </div>
    </div>
  )
}
