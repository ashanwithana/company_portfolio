'use client'

import * as React from 'react'

import { useReducedMotion } from './use-media-query'

/**
 * Eased count-up used by the About stats.
 *
 * The rAF loop is the only writer of state, and it only runs once — after the
 * first frame, so there is no synchronous setState. When the user prefers
 * reduced motion we skip the loop entirely and derive the final value, which
 * also means the number is correct on the very first paint.
 */
export function useCountUp(target: number, duration = 1600, decimals = 0) {
  const reducedMotion = useReducedMotion()
  const [animated, setAnimated] = React.useState(0)
  const frameRef = React.useRef<number | undefined>(undefined)

  React.useEffect(() => {
    if (reducedMotion) return

    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      // easeOutExpo — fast start, gentle settle.
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setAnimated(Number((target * eased).toFixed(decimals)))

      if (progress < 1) frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [target, duration, decimals, reducedMotion])

  return reducedMotion ? target : animated
}
