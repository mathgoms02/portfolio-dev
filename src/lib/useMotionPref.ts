import { useEffect, useState } from 'react'

/** Live-updating `prefers-reduced-motion` with a user override. */
const OVERRIDE_KEY = 'mg.reduceMotion'

function readOverride(): boolean | null {
  try {
    const v = localStorage.getItem(OVERRIDE_KEY)
    return v === null ? null : v === '1'
  } catch {
    return null
  }
}

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    const override = readOverride()
    if (override !== null) return override
    return typeof matchMedia === 'function'
      ? matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  })

  useEffect(() => {
    if (readOverride() !== null) return
    const mq = matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}

export function setMotionOverride(reduce: boolean) {
  try {
    localStorage.setItem(OVERRIDE_KEY, reduce ? '1' : '0')
  } catch {
    /* non-fatal */
  }
  document.documentElement.dataset.reduceMotion = reduce ? 'true' : 'false'
}
