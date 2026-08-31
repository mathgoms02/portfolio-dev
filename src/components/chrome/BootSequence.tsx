import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocale } from '../../i18n/LocaleContext'
import { ui } from '../../i18n/ui'
import { githubSnapshot } from '../../data/github-snapshot'
import { useReducedMotion } from '../../lib/useMotionPref'
import styles from './BootSequence.module.css'

const SESSION_KEY = 'mg.booted'

interface Line {
  text: string
  value?: string
  tone?: 'ok' | 'accent' | 'dim'
}

function lines(locale: 'pt' | 'en'): Line[] {
  const t = (pt: string, en: string) => (locale === 'pt' ? pt : en)
  return [
    { text: 'mg.portfolio', value: 'v2.0.0', tone: 'dim' },
    { text: t('idioma detectado', 'locale detected'), value: locale === 'pt' ? 'pt-BR' : 'en-US', tone: 'ok' },
    { text: t('carregando perfil', 'loading profile'), value: 'ok', tone: 'ok' },
    { text: 'github/mathgoms02', value: `${githubSnapshot.publicRepos} repos`, tone: 'accent' },
    { text: t('contribuições · 12 meses', 'contributions · 12 months'), value: String(githubSnapshot.contributionsLastYear), tone: 'accent' },
    { text: t('montando grid', 'mounting grid'), value: '12 col', tone: 'ok' },
    { text: t('hidratando react', 'hydrating react'), value: '19.2', tone: 'ok' },
  ]
}

export function BootSequence({ onDone }: { onDone: () => void }) {
  const { locale } = useLocale()
  const reduced = useReducedMotion()
  // frozen at mount: switching language mid-boot should not restart the log
  const [script] = useState(() => lines(locale))

  const [shown, setShown] = useState(0)
  const [progress, setProgress] = useState(0)
  const [closing, setClosing] = useState(false)
  const finished = useRef(false)

  const finish = useCallback(() => {
    if (finished.current) return
    finished.current = true
    try {
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      /* non-fatal — the boot simply plays again next time */
    }
    setClosing(true)
    window.setTimeout(onDone, reduced ? 0 : 760)
  }, [onDone, reduced])

  // reveal one line at a time
  useEffect(() => {
    if (reduced) {
      finish()
      return
    }
    if (shown >= script.length) return
    const id = window.setTimeout(() => setShown((n) => n + 1), shown === 0 ? 180 : 105)
    return () => window.clearTimeout(id)
  }, [shown, script.length, reduced, finish])

  // progress bar runs slightly ahead of the lines, then closes the curtain
  useEffect(() => {
    if (reduced) return
    const target = Math.round((shown / script.length) * 100)
    const id = window.setInterval(() => {
      setProgress((p) => {
        if (p >= target) return p
        return Math.min(target, p + 3)
      })
    }, 12)
    return () => window.clearInterval(id)
  }, [shown, script.length, reduced])

  useEffect(() => {
    if (shown >= script.length && progress >= 100) {
      const id = window.setTimeout(finish, 340)
      return () => window.clearTimeout(id)
    }
  }, [shown, progress, script.length, finish])

  // escape, click or any key skips
  useEffect(() => {
    const skip = () => finish()
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)
    return () => {
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
    }
  }, [finish])

  const blocks = Math.round(progress / 5)

  return (
    <div className={styles.boot} data-closing={closing || undefined} role="status" aria-live="polite">
      <div className={styles.inner}>
        <ol className={styles.log}>
          {script.slice(0, shown).map((line, i) => (
            <li key={line.text} className={styles.line} style={{ animationDelay: `${i * 12}ms` }}>
              <span className={styles.caret}>›</span>
              <span className={styles.text}>{line.text}</span>
              <span className={styles.dots} aria-hidden="true" />
              <span className={styles.value} data-tone={line.tone}>
                {line.value}
              </span>
            </li>
          ))}
        </ol>

        <div className={styles.progress}>
          <span className={styles.bar} aria-hidden="true">
            {'█'.repeat(blocks)}
            <span className={styles.empty}>{'░'.repeat(Math.max(0, 20 - blocks))}</span>
          </span>
          <span className={styles.pct}>{String(progress).padStart(3, ' ')}%</span>
        </div>

        <p className={styles.hint}>{ui.boot.skip[locale]}</p>
      </div>

      <span className={styles.curtain} aria-hidden="true" />
    </div>
  )
}

export function hasBooted(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}
