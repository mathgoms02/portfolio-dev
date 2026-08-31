import { lab } from '../../data/projects'
import { useLocale } from '../../i18n/LocaleContext'
import { ui } from '../../i18n/ui'
import { relativeTime } from '../../lib/format'
import { useGithub } from '../../lib/useGithub'
import { Reveal } from '../ui/Reveal'
import { SectionHead } from '../ui/SectionHead'
import styles from './Lab.module.css'

export function Lab() {
  const { locale, t } = useLocale()
  const { repos } = useGithub()

  return (
    <section id="lab" className={styles.section}>
      <div className="wrap">
        <SectionHead
          index="06"
          label={ui.nav.lab[locale]}
          title={ui.section.lab[locale]}
          lead={
            locale === 'pt'
              ? 'Trabalhos de faculdade, experimentos e coisas feitas só para entender como funcionam.'
              : 'Coursework, experiments and things built purely to understand how they work.'
          }
        />

        <ul className={styles.grid}>
          {lab.map((item, i) => {
            const repo = repos[item.repo.toLowerCase()]
            return (
              <Reveal as="li" key={item.repo} variant="up" delay={(i % 4) * 0.05}>
                <a
                  className={styles.card}
                  href={`https://github.com/${item.repo}`}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="link"
                >
                  <span className={styles.cardHead}>
                    <span className={styles.cardName}>{item.name}</span>
                    <span className={styles.cardYear}>{item.year}</span>
                  </span>

                  <span className={styles.cardNote}>{t(item.note)}</span>

                  <span className={styles.cardFoot}>
                    <span className={styles.tags}>
                      {item.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </span>
                    {repo ? (
                      <span className={styles.freshness}>
                        {repo.stars > 0 ? `★ ${repo.stars} · ` : ''}
                        {relativeTime(repo.pushedAt, locale)}
                      </span>
                    ) : null}
                  </span>
                </a>
              </Reveal>
            )
          })}
        </ul>

        <a className={styles.all} href="https://github.com/mathgoms02?tab=repositories" target="_blank" rel="noreferrer">
          {ui.common.viewAll[locale]}
          <svg viewBox="0 0 24 14" width="22" height="13" aria-hidden="true">
            <path d="M0 7h21M15 1l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </a>
      </div>
    </section>
  )
}
