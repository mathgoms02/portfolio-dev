import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useInView } from '../../lib/useInView'
import styles from './Reveal.module.css'

type Variant = 'up' | 'fade' | 'clip' | 'left' | 'scale'

interface Props {
  children: ReactNode
  as?: ElementType
  variant?: Variant
  /** Seconds of delay before this element starts. */
  delay?: number
  amount?: number
  className?: string
  style?: CSSProperties
}

/**
 * Entrance animation driven by a data attribute, so a list of fifty items costs
 * one IntersectionObserver each and zero JS per frame.
 */
export function Reveal({
  children,
  as: Tag = 'div',
  variant = 'up',
  delay = 0,
  amount = 0.15,
  className,
  style,
}: Props) {
  const { ref, inView } = useInView<HTMLDivElement>({ amount })

  return (
    <Tag
      ref={ref}
      className={[styles.reveal, className].filter(Boolean).join(' ')}
      data-variant={variant}
      data-shown={inView || undefined}
      style={{ '--reveal-delay': `${delay}s`, ...style } as CSSProperties}
    >
      {children}
    </Tag>
  )
}
