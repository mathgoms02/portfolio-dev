import { useEffect, useRef } from 'react'

/**
 * Escape closes the topmost overlay, and only that one.
 *
 * Each overlay used to listen on window by itself, so one Escape dismissed
 * every open overlay at once — the command palette on top of a case sheet took
 * both down. Listener order cannot settle it either: the sheet opens first, so
 * its handler runs first. A shared stack makes it explicit, whatever the order
 * the overlays mounted in.
 */
interface Layer {
  dismiss: () => void
}

const stack: Layer[] = []
let listening = false

function onKey(e: KeyboardEvent) {
  if (e.key !== 'Escape') return
  const top = stack[stack.length - 1]
  if (!top) return
  e.preventDefault()
  top.dismiss()
}

/** Registers `onDismiss` as the top layer while `active`. */
export function useDismissLayer(active: boolean, onDismiss: () => void) {
  const latest = useRef(onDismiss)

  useEffect(() => {
    latest.current = onDismiss
  }, [onDismiss])

  useEffect(() => {
    if (!active) return

    const layer: Layer = { dismiss: () => latest.current() }
    stack.push(layer)
    if (!listening) {
      window.addEventListener('keydown', onKey)
      listening = true
    }

    return () => {
      const i = stack.indexOf(layer)
      if (i !== -1) stack.splice(i, 1)
      if (stack.length === 0 && listening) {
        window.removeEventListener('keydown', onKey)
        listening = false
      }
    }
  }, [active])
}
