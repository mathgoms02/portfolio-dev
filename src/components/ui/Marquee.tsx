import type { ReactNode } from 'react'
import styles from './Marquee.module.css'

interface Props {
  items: ReactNode[]
  /** Seconds for one full pass. Larger is slower. */
  duration?: number
  reverse?: boolean
  separator?: string
  className?: string
}

/** Seamless ticker — the track is duplicated and translated by exactly 50%. */
export function Marquee({
  items,
  duration = 42,
  reverse = false,
  separator = '/',
  className,
}: Props) {
  const run = (
    <ul className={styles.run} aria-hidden="true">
      {items.map((item, i) => (
        <li key={i} className={styles.item}>
          {item}
          <span className={styles.sep}>{separator}</span>
        </li>
      ))}
    </ul>
  )

  return (
    <div className={[styles.marquee, className].filter(Boolean).join(' ')}>
      <div
        className={styles.track}
        data-reverse={reverse || undefined}
        style={{ animationDuration: `${duration}s` }}
      >
        {run}
        {run}
      </div>
    </div>
  )
}
