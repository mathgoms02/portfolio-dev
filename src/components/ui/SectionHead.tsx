import type { ReactNode } from 'react'
import { Reveal } from './Reveal'
import { ScrambleText } from './ScrambleText'
import styles from './SectionHead.module.css'

interface Props {
  index: string
  label: string
  title: string
  lead?: ReactNode
  align?: 'left' | 'wide'
}

export function SectionHead({ index, label, title, lead, align = 'left' }: Props) {
  return (
    <header className={styles.head} data-align={align}>
      <Reveal variant="fade" className={styles.meta}>
        <span className={styles.index}>{index}</span>
        <span className={styles.rule} aria-hidden="true" />
        <span className={styles.label}>{label}</span>
      </Reveal>

      <Reveal variant="up" delay={0.05}>
        <h2 className={styles.title}>
          <ScrambleText text={title} speed={22} scatter={5} />
        </h2>
      </Reveal>

      {lead ? (
        <Reveal variant="up" delay={0.12} className={styles.lead}>
          {lead}
        </Reveal>
      ) : null}
    </header>
  )
}
