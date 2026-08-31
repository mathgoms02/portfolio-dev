import { useEffect, useState } from 'react'
import { SECTIONS } from '../data/sections'

/** Id of the section currently occupying the middle of the viewport. */
export function useActiveSection(): string {
  const [active, setActive] = useState(SECTIONS[0].id)

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    )
    if (!els.length || typeof IntersectionObserver === 'undefined') return

    // A thin band across the middle of the screen: whichever section crosses it wins.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )

    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return active
}
