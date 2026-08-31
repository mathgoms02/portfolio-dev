import { courses, events, roles } from '../../data/experience'
import { useLocale } from '../../i18n/LocaleContext'
import { ui } from '../../i18n/ui'
import { durationLabel, monthYear, monthsBetween } from '../../lib/format'
import { Reveal } from '../ui/Reveal'
import { SectionHead } from '../ui/SectionHead'
import type { Role } from '../../data/types'
import styles from './Trajectory.module.css'

function RoleEntry({ role, index }: { role: Role; index: number }) {
  const { locale, t } = useLocale()
  const months = monthsBetween(role.start, role.end)
  const current = role.end === null

  return (
    <Reveal
      as="li"
      variant="up"
      delay={index * 0.04}
      className={styles.entry}
      data-current={current || undefined}
    >
      <div className={styles.when}>
        <span className={styles.node} aria-hidden="true" />
        <span className={styles.period}>
          {monthYear(role.start, locale)}
          <span className={styles.dash}>—</span>
          {role.end ? monthYear(role.end, locale) : ui.common.present[locale]}
        </span>
        <span className={styles.duration}>{durationLabel(months, locale)}</span>
      </div>

      <div className={styles.what}>
        <header className={styles.entryHead}>
          <h3 className={styles.title}>{t(role.title)}</h3>
          <p className={styles.company}>
            <span className={styles.companyName}>{role.company}</span>
            <span className={styles.kind}>{t(role.kind)}</span>
          </p>
          <p className={styles.place}>
            {typeof role.location === 'string' ? role.location : t(role.location)}
            {role.companyNote ? <span className={styles.note}> · {t(role.companyNote)}</span> : null}
          </p>
        </header>

        <ul className={styles.bullets}>
          {t(role.bullets).map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>

        <ul className={styles.chips}>
          {role.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    </Reveal>
  )
}

export function Trajectory() {
  const { locale, t } = useLocale()

  return (
    <section id="trajectory" className={styles.section}>
      <div className="wrap">
        <SectionHead
          index="02"
          label={ui.nav.trajectory[locale]}
          title={ui.section.trajectory[locale]}
        />

        <ol className={styles.timeline}>
          {roles.map((role, i) => (
            <RoleEntry key={role.id} role={role} index={i} />
          ))}
        </ol>

        <div className={styles.extras}>
          <Reveal variant="up" className={styles.extra}>
            <h3 className={styles.extraLabel}>{locale === 'pt' ? 'Maratonas' : 'Competitions'}</h3>
            <ul className={styles.eventList}>
              {events.map((e) => (
                <li key={e.id}>
                  <span className={styles.eventYear}>{e.year}</span>
                  <div>
                    <p className={styles.eventName}>{t(e.name)}</p>
                    <p className={styles.eventOrg}>{e.org}</p>
                    <p className={styles.eventDetail}>{t(e.detail)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal variant="up" delay={0.08} className={styles.extra}>
            <h3 className={styles.extraLabel}>{locale === 'pt' ? 'Formação contínua' : 'Continued training'}</h3>
            <ul className={styles.courseList}>
              {courses.map((c) => (
                <li key={t(c.name)}>{t(c.name)}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
