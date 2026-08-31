import { achievements } from '../../data/experience'
import { useLocale } from '../../i18n/LocaleContext'
import { ui } from '../../i18n/ui'
import { Reveal } from '../ui/Reveal'
import { SectionHead } from '../ui/SectionHead'
import styles from './Impact.module.css'

export function Impact() {
  const { locale, t } = useLocale()

  return (
    <section id="impact" className={styles.section}>
      <div className="wrap">
        <SectionHead
          index="04"
          label={ui.nav.impact[locale]}
          title={ui.section.impact[locale]}
          lead={
            locale === 'pt'
              ? 'Nem todo trabalho relevante vira repositório público. Estes quatro rodaram dentro de empresas — e o que ficou foi medido.'
              : 'Not all meaningful work becomes a public repository. These four ran inside companies — and what remained was measured.'
          }
        />

        <ol className={styles.grid}>
          {achievements.map((a, i) => (
            <Reveal as="li" key={a.id} variant="up" delay={i * 0.07} className={styles.card}>
              <span className={styles.at}>{a.at}</span>

              <p className={styles.figure}>
                {a.figure}
                <span className={styles.figureNote}>{t(a.figureNote)}</span>
              </p>

              <h3 className={styles.headline}>{t(a.headline)}</h3>
              <p className={styles.detail}>{t(a.detail)}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
