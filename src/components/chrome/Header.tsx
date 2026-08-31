import { useLocale } from '../../i18n/LocaleContext'
import { ui } from '../../i18n/ui'
import { cvFile } from '../../data/profile'
import { useScrollControl } from '../../lib/ScrollProvider'
import { useTransition } from '../../lib/TransitionProvider'
import { Magnetic } from '../ui/Magnetic'
import styles from './Header.module.css'

interface Props {
  onOpenPalette: () => void
}

export function Header({ onOpenPalette }: Props) {
  const { locale, toggle } = useLocale()
  const { y } = useScrollControl()
  const { navigate } = useTransition()
  const cvHref = `${import.meta.env.BASE_URL}${cvFile}`

  return (
    <header className={styles.header} data-scrolled={y > 40 || undefined}>
      <a
        className={styles.mark}
        href="#index"
        onClick={(e) => {
          e.preventDefault()
          navigate('index')
        }}
      >
        MG
      </a>

      <div className={styles.actions}>
        <Magnetic strength={6}>
          <button
            type="button"
            className={styles.search}
            onClick={onOpenPalette}
            aria-label={ui.palette.placeholder[locale]}
          >
            <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
              <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
              <path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square" />
            </svg>
            <span className={styles.searchLabel}>{ui.hero.palette[locale]}</span>
            <kbd className={styles.kbd}>⌘K</kbd>
          </button>
        </Magnetic>

        <button
          type="button"
          className={styles.lang}
          onClick={toggle}
          aria-label={ui.palette.toggleLang[locale]}
        >
          <span className={styles.langTrack} data-locale={locale}>
            <span data-side="pt">PT</span>
            <span data-side="en">EN</span>
            <span className={styles.langThumb} aria-hidden="true" />
          </span>
        </button>

        <Magnetic strength={6}>
          <a className={styles.cv} href={cvHref} download>
            <span>CV</span>
            <svg viewBox="0 0 12 14" width="10" height="12" aria-hidden="true">
              <path d="M6 0v10M2 6.5 6 10.5 10 6.5M0.5 13.5h11" fill="none" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </a>
        </Magnetic>
      </div>
    </header>
  )
}
