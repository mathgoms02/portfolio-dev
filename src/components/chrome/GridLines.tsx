import styles from './GridLines.module.css'

/**
 * The structural grid, left visible on purpose: twelve columns and a ruler,
 * so the page reads as something that was measured rather than assembled.
 */
export function GridLines() {
  return (
    <div className={styles.lines} aria-hidden="true">
      <div className={styles.ruler}>
        {Array.from({ length: 48 }, (_, i) => (
          <span key={i} data-major={i % 6 === 0 || undefined} />
        ))}
      </div>
      <div className={styles.columns}>
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
    </div>
  )
}
