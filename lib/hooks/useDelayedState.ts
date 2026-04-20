import { useEffect, useRef, useState } from 'react'

/**
 * Debounced boolean — prevents flash for fast operations.
 * Shows after `showAfter` ms, hides after `hideAfter` ms minimum display.
 */
export function useDelayedState(
  value: boolean,
  { showAfter = 150, hideAfter = 300 } = {}
): boolean {
  const [shown, setShown] = useState(false)
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (value) {
      if (hideTimer.current) clearTimeout(hideTimer.current)
      showTimer.current = setTimeout(() => setShown(true), showAfter)
    } else {
      if (showTimer.current) clearTimeout(showTimer.current)
      if (shown) {
        hideTimer.current = setTimeout(() => setShown(false), hideAfter)
      }
    }
    return () => {
      if (showTimer.current) clearTimeout(showTimer.current)
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [value, showAfter, hideAfter, shown])

  return shown
}
