import { useEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof matchMedia === 'function' ? matchMedia(query).matches : false,
  )

  useEffect(() => {
    const mq = matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/** True on devices whose primary input is a finger — no hover, no custom cursor. */
export function useIsTouch(): boolean {
  return useMediaQuery('(hover: none), (pointer: coarse)')
}
