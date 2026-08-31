import type { ElementType } from 'react'
import { useInView } from '../../lib/useInView'
import { useScramble } from '../../lib/useScramble'

interface Props {
  text: string
  as?: ElementType
  className?: string
  speed?: number
  scatter?: number
  /** Skip the observer and run immediately (hero, boot sequence). */
  immediate?: boolean
}

/** Renders `text` resolving out of glyph noise the first time it is seen. */
export function ScrambleText({
  text,
  as: Tag = 'span',
  className,
  speed,
  scatter,
  immediate = false,
}: Props) {
  const { ref, inView } = useInView<HTMLSpanElement>({ amount: 0.4 })
  const output = useScramble(text, { speed, scatter, play: immediate || inView })

  return (
    <Tag ref={ref} className={className}>
      <span className="sr">{text}</span>
      <span aria-hidden="true">{output}</span>
    </Tag>
  )
}
