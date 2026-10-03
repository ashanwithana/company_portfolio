'use client'

import * as React from 'react'

import { Eyebrow } from '@/components/ui/badge'
import { useReducedMotion } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'

export type MethodStep = {
  /** Giant word, e.g. "Understand". */
  word: string
  /** Two-digit numeral, e.g. "01". */
  numeral: string
  /** Short label for the rail. */
  label: string
  /** One-line claim, 15px. */
  lead: string
  /** Lowercase dash-led points. */
  points: readonly string[]
  /** The concrete artifact the phase hands over — the accountability hook. */
  endsWith: string
}

/**
 * The five-phase method, staged as a sticky rail beside scrolling phases.
 *
 * A deliberate departure from the sideways-pinned reference: the left rail
 * pins a giant numeral that flips as each phase crosses the viewport centre,
 * with a progress spine and an anchor list of the five phases. The phases
 * themselves scroll naturally on the right, each closing with an "Ends with"
 * line — the concrete artifact that makes the phase accountable.
 *
 * The active phase is derived from an IntersectionObserver (no rAF loop, no
 * scroll math), and without JavaScript every phase is simply readable in
 * order. Reduced motion collapses the numeral crossfade via the global reset.
 */
export function Method({
  steps,
  showIntro = true,
}: {
  steps: readonly MethodStep[]
  /** The /method page carries its own PageHeader, so it suppresses this one. */
  showIntro?: boolean
}) {
  const [active, setActive] = React.useState(0)
  const articleRefs = React.useRef<(HTMLElement | null)[]>([])
  const reducedMotion = useReducedMotion()

  React.useEffect(() => {
    const articles = articleRefs.current.filter((el): el is HTMLElement => el !== null)
    if (articles.length === 0) return
    if (typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const index = articles.indexOf(entry.target as HTMLElement)
          if (index >= 0) setActive(index)
        }
      },
      // A band around the viewport centre: the phase crossing it is current.
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 },
    )

    for (const article of articles) observer.observe(article)
    return () => observer.disconnect()
  }, [])

  const goToPhase = (index: number) => {
    articleRefs.current[index]?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'center',
    })
  }

  return (
    <div className="relative bg-background">
      <div
        className={cn(
          'container-page',
          // Without the intro (the /method page has its own header), the
          // wrapper keeps only bottom rhythm — otherwise a full section of
          // empty padding sits between the header and the first phase.
          showIntro ? 'py-24 md:py-32' : 'pt-2 pb-24 md:pb-32',
        )}
      >
        {showIntro ? (
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow className="justify-center">The method</Eyebrow>
            <h2 className="mx-auto mt-5 display-lg">How every engagement runs.</h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Every engagement runs the same five phases. Each one ends with something you can hold
              us to — that is the whole method.
            </p>
          </div>
        ) : null}

        <div
          className={cn(
            'grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20',
            // Without the intro there is no heading to separate from, so the
            // grid tucks up under the page header instead of holding a full
            // section gap of dead air.
            showIntro ? 'mt-16 md:mt-20' : 'mt-8 md:mt-10',
          )}
        >
          {/* Sticky rail: flipping numeral, progress spine, phase anchors. */}
          <div className="hidden lg:block">
            <div className="sticky top-32">
              <div
                className="relative font-display text-[clamp(8rem,18vw,15rem)] leading-[0.85] font-extrabold tracking-[-0.04em] tabular-nums"
                aria-hidden="true"
              >
                {steps.map((step, i) => (
                  <span
                    key={step.numeral}
                    className={cn(
                      'block transition-[opacity,transform] duration-500 ease-out',
                      i === active
                        ? 'relative opacity-100'
                        : 'pointer-events-none absolute inset-0 translate-y-4 opacity-0',
                    )}
                  >
                    <span className={i === active ? 'text-foreground' : ''}>{step.numeral}</span>
                    <span className="text-coral">.</span>
                  </span>
                ))}
              </div>

              <p className="mt-6 label text-muted-foreground">
                Phase {active + 1} of {steps.length} — {steps[active]?.label}
              </p>

              {/* Progress spine. */}
              <div
                className="mt-4 h-px w-full bg-border-strong"
                role="progressbar"
                aria-valuemin={1}
                aria-valuemax={steps.length}
                aria-valuenow={active + 1}
                aria-label="Method progress"
              >
                <div
                  className="h-full origin-left bg-coral transition-transform duration-500 ease-out"
                  style={{ transform: `scaleX(${(active + 1) / steps.length})` }}
                />
              </div>

              {/* Anchor list. */}
              <ul className="mt-8 space-y-1">
                {steps.map((step, i) => (
                  <li key={step.word}>
                    <button
                      type="button"
                      onClick={() => goToPhase(i)}
                      aria-current={i === active ? 'true' : undefined}
                      className={cn(
                        'group flex min-h-10 w-full items-center gap-4 rounded-xl px-3 text-left transition-colors',
                        i === active
                          ? 'text-foreground'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      <span
                        className={cn(
                          'font-mono text-[11px] tabular-nums',
                          i === active ? 'text-coral' : 'text-muted-foreground/60',
                        )}
                      >
                        {step.numeral}
                      </span>
                      <span className="text-[15px]">{step.label}</span>
                      <span
                        aria-hidden="true"
                        className={cn(
                          'ml-auto transition-transform duration-300',
                          i === active ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0',
                        )}
                      >
                        →
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Phases. */}
          <div>
            {steps.map((step, i) => (
              <article
                key={step.word}
                ref={(el) => {
                  articleRefs.current[i] = el
                }}
                aria-label={`Phase ${step.numeral}: ${step.word}`}
                className="border-t border-border py-14 first:border-t-0 first:pt-0 md:py-20 lg:min-h-[62vh] lg:first:pt-14"
              >
                {/* Inline numeral for narrow screens, where the rail is hidden. */}
                <p className="label text-coral tabular-nums lg:hidden">
                  {step.numeral} / {String(steps.length).padStart(2, '0')}
                </p>

                <h3 className="mt-4 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1] font-bold tracking-normal text-balance lg:mt-0">
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

                <p className="mt-8 flex max-w-md items-baseline gap-3 border-t border-border pt-5 text-[13px]">
                  <span className="shrink-0 label text-[0.6rem] text-coral">Ends with</span>
                  <span className="text-foreground">{step.endsWith}</span>
                </p>
              </article>
            ))}
          </div>
        </div>

        {/* Screen-reader status for the rail state. */}
        <p className="sr-only" role="status">
          Phase {active + 1} of {steps.length}: {steps[active]?.word}
        </p>
      </div>
    </div>
  )
}
