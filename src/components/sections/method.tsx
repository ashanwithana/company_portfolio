'use client'

import * as React from 'react'

import { Eyebrow } from '@/components/ui/badge'
import { useReducedMotion } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'

export type MethodStep = {
  /** Giant word, e.g. "Understand". */
  word: string
  /** Two-digit ghost numeral, e.g. "01". */
  numeral: string
  /** Short label for the progress rail. */
  label: string
  /** One-line claim, 15px. */
  lead: string
  /** Lowercase dash-led points. */
  points: readonly string[]
}

/**
 * The five-phase method, as a pinned horizontal scroll.
 *
 * This mirrors the reference's signature interaction: the section pins to the
 * viewport while vertical scroll drives a horizontal track of five panels. Each
 * panel carries a ghost numeral, a giant step word, a one-line claim and a
 * short dash-led list. A progress rail at the bottom shows the five phase
 * letters with the active one as a pink dot.
 *
 * Implementation notes:
 * - Scroll progress is computed in a rAF-throttled listener and written
 *   straight to the track's `transform`, so scrolling never triggers a React
 *   render. The active-step state only updates when the step index changes.
 * - Before the effect runs (SSR, hydration, reduced motion, no JS) the track
 *   is a plain vertical stack — the content is fully readable and there is no
 *   markup mismatch, because the horizontal layout is applied exclusively by
 *   setting `data-ready` in the effect.
 */
export function Method({ steps }: { steps: readonly MethodStep[] }) {
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const trackRef = React.useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const [active, setActive] = React.useState(0)
  const activeRef = React.useRef(0)

  React.useEffect(() => {
    const wrap = wrapRef.current
    const track = trackRef.current
    if (!wrap || !track) return
    if (reducedMotion) return

    wrap.dataset.ready = 'true'

    let frame = 0

    const update = () => {
      frame = 0
      const wrapTop = wrap.offsetTop
      const total = wrap.offsetHeight - window.innerHeight
      const progress = total > 0 ? Math.min(Math.max((window.scrollY - wrapTop) / total, 0), 1) : 0

      const maxShift = Math.max(track.scrollWidth - window.innerWidth, 0)
      track.style.transform = `translate3d(${-progress * maxShift}px, 0, 0)`

      // Inner parallax: ghost numerals drift against the track direction, so
      // the backdrop feels deeper than the copy. Written straight to the DOM —
      // still no React render on the scroll path.
      const panels = track.querySelectorAll<HTMLElement>('.method-panel')
      const mid = window.innerWidth / 2
      panels.forEach((panel) => {
        const rect = panel.getBoundingClientRect()
        const offset = rect.left + rect.width / 2 - mid
        const ghost = panel.querySelector<HTMLElement>(':scope > span')
        if (ghost) ghost.style.transform = `translate3d(${(-offset * 0.08).toFixed(1)}px, 0, 0)`
      })

      const index = Math.min(Math.floor(progress * steps.length), steps.length - 1)
      if (index !== activeRef.current) {
        activeRef.current = index
        setActive(index)
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
      delete wrap.dataset.ready
    }
  }, [reducedMotion, steps.length])

  return (
    // Scroll room for the pin: five panels plus room for the intro to clear.
    // On mobile (and without JS) this collapses — the track is a plain stack.
    <div ref={wrapRef} className="method-wrap tone-paper relative md:h-[520vh]">
      <div className="method-viewport md:sticky md:top-0 md:flex md:h-screen md:flex-col md:justify-center md:overflow-hidden">
        <div className="container-page">
          <Eyebrow className="justify-center">The method</Eyebrow>
          <h2 className="mx-auto mt-5 max-w-3xl text-center display-lg">
            Five phases, one number.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-muted-foreground md:text-lg">
            Technology accelerates faster every day. Most businesses fall behind. We close that gap
            with a five-phase method that does not follow the curve — it bends it.
          </p>
        </div>

        <div
          ref={trackRef}
          className="method-track mt-14 flex flex-col gap-16 px-4 will-change-transform md:mt-10 md:flex-row md:items-stretch md:gap-0 md:px-0"
        >
          {steps.map((step) => (
            <article
              key={step.word}
              aria-label={`Phase ${step.numeral}: ${step.word}`}
              className="method-panel relative shrink-0 px-4 md:w-[74vw] md:px-[7vw] lg:w-[56vw] lg:px-[5vw]"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-[0.22em] left-0 font-display text-[clamp(12.5rem,60vh,24.5rem)] text-ghost select-none"
              >
                {step.numeral}
              </span>

              <div className="relative">
                <h3 className="font-display text-[clamp(3rem,14.5vw,8rem)] leading-[1] font-bold tracking-normal text-balance">
                  {step.word}
                  <span aria-hidden="true" className="text-coral">
                    .
                  </span>
                </h3>

                <p className="mt-6 max-w-md text-[15px] leading-[1.7] font-light text-foreground/90">
                  {step.lead}
                </p>

                <ul className="mt-6 max-w-md space-y-2.5">
                  {step.points.map((point) => (
                    <li
                      key={point}
                      className="relative pl-7 text-[12px] leading-relaxed font-light text-muted-foreground"
                    >
                      <span aria-hidden="true" className="absolute top-0 left-0">
                        —
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}

          {/* End spacer so the last panel can travel fully into view. */}
          <div aria-hidden="true" className="hidden shrink-0 md:block md:w-[12vw]" />
        </div>

        {/* Progress rail: reached phases as bold letters joined by long rules,
            upcoming phases as dots, the final node a pink destination dot.
            Only the active phase carries its label beneath. */}
        <div className="container-page mt-12 hidden md:block" aria-hidden="true">
          <div className="flex max-w-xl items-start">
            {steps.map((step, i) => (
              <React.Fragment key={step.word}>
                <div className="flex flex-col items-center gap-2.5">
                  <span
                    className={cn(
                      'font-display leading-none font-bold transition-colors duration-500',
                      i <= active
                        ? 'text-[28px] text-foreground'
                        : 'text-[10px] leading-[2.8] text-foreground',
                      i === steps.length - 1 && i > active && 'text-coral',
                    )}
                  >
                    {i <= active ? step.word.charAt(0) : '●'}
                  </span>
                  <span
                    className={cn(
                      'font-mono text-[9px] tracking-[0.14em] uppercase',
                      i === active ? 'text-muted-foreground' : 'invisible',
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="mx-1 mt-[13px] h-px flex-1 bg-border-strong"
                  />
                ) : null}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Screen-reader + no-JS equivalent of the progress state. */}
        <p className="sr-only" role="status">
          Phase {active + 1} of {steps.length}: {steps[active]?.word}
        </p>
      </div>
    </div>
  )
}
