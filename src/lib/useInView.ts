import { useEffect, useRef, useState } from 'react'

interface Options {
  /** Fraction of the element that must be visible. */
  amount?: number
  /** Shrink the viewport before testing — negative values delay the trigger. */
  margin?: string
  /** Keep reporting after the first entry. */
  repeat?: boolean
}

export function useInView<T extends HTMLElement = HTMLDivElement>({
  amount = 0.2,
  margin = '0px 0px -12% 0px',
  repeat = false,
}: Options = {}) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (!repeat) io.disconnect()
        } else if (repeat) {
          setInView(false)
        }
      },
      { threshold: amount, rootMargin: margin },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [amount, margin, repeat])

  return { ref, inView }
}
