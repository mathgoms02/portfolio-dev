import { stackGroups } from '../../data/stack'
import { useLocale } from '../../i18n/LocaleContext'
import { ui } from '../../i18n/ui'
import { Reveal } from '../ui/Reveal'
import { SectionHead } from '../ui/SectionHead'
import { GithubActivity } from './GithubActivity'
import styles from './Stack.module.css'

export function Stack() {
  const { locale, t } = useLocale()

  return (
    <section id="stack" className={styles.section}>
      <div className="wrap">
        <SectionHead
          index="05"
          label={ui.nav.stack[locale]}
          title={ui.section.stack[locale]}
          lead={
            locale === 'pt'
              ? 'A barra cheia marca o que uso todo dia. A vazia, o que já coloquei em produção pelo menos uma vez.'
              : 'A full bar marks what I use every day. An empty one, what I have shipped with at least once.'
          }
        />

        <div className={styles.layout}>
          <div className={styles.groups}>
            {stackGroups.map((group, i) => (
              <Reveal key={group.id} variant="up" delay={i * 0.05} className={styles.group}>
                <h3 className={styles.groupLabel}>
                  <span className={styles.groupNum}>{String(i + 1).padStart(2, '0')}</span>
                  {t(group.label)}
                </h3>
                <ul className={styles.items}>
                  {group.items.map((item) => (
                    <li key={item.name} className={styles.item}>
                      <span className={styles.itemName}>{item.name}</span>
                      {item.note ? <span className={styles.itemNote}>{t(item.note)}</span> : null}
                      <span className={styles.meter} aria-hidden="true">
                        {[1, 2, 3].map((step) => (
                          <i key={step} data-on={(item.level ?? 1) >= step || undefined} />
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>

          <Reveal variant="up" delay={0.1} className={styles.activity}>
            <GithubActivity />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
