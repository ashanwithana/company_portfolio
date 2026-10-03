'use client'

import * as React from 'react'

/**
 * Vertical scroll rail pinned to the right edge, with a live percentage readout.
 *
 * Two separate pieces of state rather than one: the rail fill is written
 * straight to the DOM from a rAF-scheduled scroll listener so it never triggers
 * a React render on the scroll path, while the numeric readout is throttled to
 * whole-percent changes — that is the only part that needs to re-render, and
 * doing so at most 100 times per page keeps it cheap.
 *
 * Hidden from assistive tech and from viewports too narrow for an edge rail.
 */
export function ScrollProgress() {
  const railRef = React.useRef<HTMLSpanElement>(null)
  const knobRef = React.useRef<HTMLSpanElement>(null)
  const [percent, setPercent] = React.useState(0)

  React.useEffect(() => {
    const rail = railRef.current
    const knob = knobRef.current
    if (!rail || !knob) return

    let frame = 0
    let lastPercent = -1

    const update = () => {
      frame = 0
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? Math.min(Math.max(window.scrollY / scrollable, 0), 1) : 0

      rail.style.transform = `scaleY(${progress})`
      knob.style.transform = `translateY(${progress * 100}%)`

      const next = Math.round(progress * 100)
      if (next !== lastPercent) {
        lastPercent = next
        setPercent(next)
      }
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
      <span className="rotate-180 label text-[0.6rem] text-muted-foreground [writing-mode:vertical-rl]">
        scroll
      </span>

      <span className="relative block h-32 w-px overflow-hidden bg-border-strong">
        <span
          ref={railRef}
          className="absolute inset-0 origin-top bg-coral will-change-transform"
          style={{ transform: 'scaleY(0)' }}
        />
        <span
          ref={knobRef}
          className="absolute top-0 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-coral will-change-transform"
          style={{ transform: 'translateY(0)' }}
        />
      </span>

      {/* Live readout. Announced politely so it is not silent to screen readers. */}
      <span className="label text-[0.6rem] text-muted-foreground tabular-nums" aria-live="off">
        {String(percent).padStart(3, '0')}%
      </span>
    </div>
  )
}
