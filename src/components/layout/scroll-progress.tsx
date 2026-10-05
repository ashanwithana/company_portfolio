'use client'

import * as React from 'react'

/**
 * Vertical scroll rail pinned to the right edge.
 *
 * The rail fill is written straight to the DOM from a rAF-scheduled scroll
 * listener so it never triggers a React render on the scroll path.
 *
 * Hidden from assistive tech and from viewports too narrow for an edge rail.
 */
export function ScrollProgress() {
  const railRef = React.useRef<HTMLSpanElement>(null)
  const knobRef = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const rail = railRef.current
    const knob = knobRef.current
    if (!rail || !knob) return

    let frame = 0

    const update = () => {
      frame = 0
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? Math.min(Math.max(window.scrollY / scrollable, 0), 1) : 0

      rail.style.transform = `scaleY(${progress})`
      knob.style.transform = `translateY(${progress * 100}%)`
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
      className="no-print pointer-events-none fixed top-1/2 right-5 z-[60] hidden -translate-y-1/2 flex-col items-center gap-3 md:flex"
      aria-hidden="true"
    >
      <span className="relative block h-32 w-px overflow-hidden bg-border-strong">
        <span
          ref={railRef}
          className="absolute inset-0 origin-top bg-brand will-change-transform"
          style={{ transform: 'scaleY(0)' }}
        />
        <span
          ref={knobRef}
          className="absolute top-0 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground will-change-transform"
          style={{ transform: 'translateY(0)' }}
        />
      </span>
    </div>
  )
}
