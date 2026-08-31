import { education, metrics, positioning, spokenLanguages } from '../../data/profile'
import { useLocale } from '../../i18n/LocaleContext'
import { ui } from '../../i18n/ui'
import { useCountUp } from '../../lib/useCountUp'
import { useInView } from '../../lib/useInView'
import { monthYear } from '../../lib/format'
import { Reveal } from '../ui/Reveal'
import { SectionHead } from '../ui/SectionHead'
import type { Metric } from '../../data/types'
import styles from './Profile.module.css'

function MetricCell({ metric, index }: { metric: Metric; index: number }) {
  const { t } = useLocale()
  const { ref, inView } = useInView<HTMLDivElement>({ amount: 0.5 })
  const value = useCountUp(metric.value, inView, 1200 + index * 120)

  return (
    <div ref={ref} className={styles.metric}>
      <span className={styles.metricValue}>
        {metric.prefix}
        {Math.round(value)}
        <span className={styles.metricSuffix}>{metric.suffix}</span>
      </span>
      <span className={styles.metricLabel}>{t(metric.label)}</span>
      {metric.note ? <span className={styles.metricNote}>{t(metric.note)}</span> : null}
    </div>
  )
}

export function Profile() {
  const { locale, t } = useLocale()

  return (
    <section id="profile" className={styles.section}>
      <div className="wrap">
        <SectionHead
          index="01"
          label={ui.nav.profile[locale]}
          title={ui.section.profile[locale]}
        />

        <div className={styles.body}>
          <ol className={styles.points}>
            {t(positioning).map((point, i) => (
              <Reveal as="li" key={point} variant="up" delay={i * 0.06} className={styles.point}>
                <span className={styles.pointNum}>{String(i + 1).padStart(2, '0')}</span>
                <p>{point}</p>
              </Reveal>
            ))}
          </ol>

          <aside className={styles.side}>
            <Reveal variant="up" className={styles.metrics}>
              {metrics.map((m, i) => (
                <MetricCell key={m.id} metric={m} index={i} />
              ))}
            </Reveal>

            <Reveal variant="up" delay={0.1} className={styles.credentials}>
              <div className={styles.credBlock}>
                <h3 className={styles.credLabel}>{locale === 'pt' ? 'Formação' : 'Education'}</h3>
                <p className={styles.credMain}>{t(education.degree)}</p>
                <p className={styles.credMeta}>
                  {education.school} · {monthYear(education.start, locale)} — {monthYear(education.end, locale)}
                  <span className={styles.badge}>{t(education.status)}</span>
                </p>
              </div>

              <div className={styles.credBlock}>
                <h3 className={styles.credLabel}>{locale === 'pt' ? 'Idiomas' : 'Languages'}</h3>
                <ul className={styles.langs}>
                  {spokenLanguages.map((lang) => (
                    <li key={lang.dots}>
                      <span className={styles.langName}>{t(lang.name)}</span>
                      <span className={styles.dots} aria-hidden="true">
                        {Array.from({ length: 5 }, (_, i) => (
                          <i key={i} data-on={i < lang.dots || undefined} />
                        ))}
                      </span>
                      <span className={styles.langLevel}>{t(lang.level)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </aside>
        </div>
      </div>
    </section>
  )
}
