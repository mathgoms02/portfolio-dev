import styles from './Grain.module.css'

/**
 * Film grain + a faint scanline, painted over everything.
 * Pure CSS: no canvas, no per-frame work.
 */
export function Grain() {
  return <div className={styles.grain} aria-hidden="true" />
}
