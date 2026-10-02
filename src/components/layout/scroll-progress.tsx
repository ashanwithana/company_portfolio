'use client'

import * as React from 'react'

/**
 * Gradient scroll-progress bar pinned to the top of the viewport.
 *
 * The transform is driven from a passive scroll listener scheduled through
 * `requestAnimationFrame`, so updates never trigger layout. `will-change` is
 * kept on the element since it is promoted to its own layer anyway.
 */
export function ScrollProgress() {
  const barRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    let frame = 0

    const update = () => {
      frame = 0
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? Math.min(Math.max(window.scrollY / scrollable, 0), 1) : 0
      bar.style.transform = `scaleX(${progress})`
    }

    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return (
    <div
      ref={barRef}
      className="no-print pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px] origin-left will-change-transform bg-[linear-gradient(90deg,var(--coral),var(--mint),var(--primary))]"
      style={{ transform: 'scaleX(0)' }}
      aria-hidden="true"
    />
  )
}
