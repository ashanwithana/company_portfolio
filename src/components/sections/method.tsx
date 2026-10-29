'use client'

import * as React from 'react'
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'

import { SilkBackground } from '@/components/ui/silk-background'
import { cn } from '@/lib/utils'

export type MethodStep = {
  /** Display word, e.g. "Immerse". */
  word: string
  /** Two-digit numeral, e.g. "01". */
  numeral: string
  /** Short label for the rail. */
  label: string
  /** One-line claim. */
  lead: string
  /** Lowercase dash-led points. */
  points: readonly string[]
  /** The concrete artifact the phase hands over — the accountability hook. */
  endsWith: string
  /**
   * The longer telling, rendered only where there is room for it — the
   * /discipline page. The home rail stays with the short version.
   */
  detail: string
}

/** Section label: mono ordinal, tracked wide, followed by a hairline rule. */
function SectionLabel({
  children,
  progress,
  trailing,
}: {
  children: React.ReactNode
  /** When given, the rule fills left to right with this value. */
  progress?: MotionValue<number>
  trailing?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
        {children}
      </span>
      <span aria-hidden="true" className="relative h-px max-w-[280px] flex-1 bg-border">
        {progress ? (
          <motion.span
            style={{ scaleX: progress }}
            className="absolute inset-0 origin-left bg-foreground/40"
          />
        ) : null}
      </span>
      {trailing}
    </div>
  )
}

/**
 * The home Discipline section: a pinned stage that scrubs a rail of sheets
 * sideways as the page scrolls. Each sheet is a hairline-bordered card whose
 * title is drawn as an outline and fills with ink as the sheet reaches the
 * centre. Reduced-motion users get the same sheets as a plain vertical stack.
 */
export function Method({
  steps,
  showIntro = true,
}: {
  steps: readonly MethodStep[]
  /** Suppress the section header where the page carries its own. */
  showIntro?: boolean
}) {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) {
    return <PlainStack steps={steps} showIntro={showIntro} />
  }
  return <Journey steps={steps} showIntro={showIntro} />
}

function Journey({ steps, showIntro }: { steps: readonly MethodStep[]; showIntro: boolean }) {
  const targetRef = React.useRef<HTMLDivElement>(null)
  const trackRef = React.useRef<HTMLDivElement>(null)
  const count = steps.length

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  })

  // Horizontal travel is measured, not computed from vw maths: the track is
  // padded so the first and last sheets can sit dead-centre, and the distance
  // between those two rest positions is simply how far it overflows.
  const travel = useMotionValue(0)
  React.useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const measure = () => travel.set(Math.max(0, track.scrollWidth - window.innerWidth))
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [travel])

  const x = useTransform([scrollYProgress, travel], ([p, t]: number[]) => -(p ?? 0) * (t ?? 0))

  const [active, setActive] = React.useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActive(Math.min(count - 1, Math.max(0, Math.round(v * (count - 1)))))
  })

  return (
    <div
      ref={targetRef}
      className="relative border-t border-border"
      style={{ height: `${count * 85 + 100}vh` }}
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center gap-8 overflow-hidden pt-20 md:gap-12">
        {showIntro ? (
          <div className="container-page w-full">
            <div className="mb-5 md:mb-7">
              <SectionLabel
                progress={scrollYProgress}
                trailing={
                  <span
                    role="status"
                    className="font-mono text-[10px] tracking-[0.24em] text-muted-foreground tabular-nums"
                  >
                    {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
                  </span>
                }
              >
                03 / Discipline
              </SectionLabel>
            </div>
            <h2 className="text-[clamp(2.4rem,5.6vw,5.6rem)] leading-[0.92] font-thin tracking-tighter uppercase">
              Six phases.
              <br />
              <span className="font-bold">One standard.</span>
            </h2>
          </div>
        ) : null}

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex w-max items-stretch gap-4 px-[calc((100vw-var(--sheet-w))/2)] [--sheet-w:min(86vw,52rem)] md:gap-5"
        >
          {steps.map((step, i) => (
            <PhaseSheet
              key={step.word}
              step={step}
              total={count}
              fill={{ progress: scrollYProgress, index: i, count }}
              className="w-[var(--sheet-w)] shrink-0 md:h-[min(46svh,26rem)] md:min-h-[320px]"
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

/** Per-sheet fill amount: 0 while the sheet approaches, 1 once it is centred. */
function useSheetFill(progress: MotionValue<number>, index: number, count: number) {
  const slice = 1 / Math.max(count - 1, 1)
  const start = (index - 0.55) * slice
  const end = (index - 0.05) * slice
  return useTransform(progress, (p: number) =>
    Math.min(1, Math.max(0, (p - start) / (end - start))),
  )
}

type FillSource = { progress: MotionValue<number>; index: number; count: number }

/**
 * Renders its children only while the box is within about a screen of the
 * viewport, and unmounts them again once it is well clear. The silk layer owns
 * a WebGL context, and a page with a dozen live ones wastes memory even when
 * each is paused, so cards far from view hold no context at all.
 */
function WhenNear({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [near, setNear] = React.useState(false)

  React.useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => setNear(entry?.isIntersecting ?? false),
      {
        rootMargin: '50% 100% 50% 100%',
      },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      {near ? children : null}
    </div>
  )
}

/**
 * One phase as a sheet. Title and numeral are drawn as outlines; when a
 * `fill` source is supplied they fill with ink left to right as the sheet
 * arrives. Without one (the /discipline page, the reduced-motion stack) the
 * type is simply solid.
 */
export function PhaseSheet({
  step,
  total,
  fill,
  detail = false,
  className,
}: {
  step: MethodStep
  total: number
  fill?: FillSource
  /** Show the long telling and the points, for pages with room. */
  detail?: boolean
  className?: string
}) {
  return (
    <article
      aria-label={`Phase ${step.numeral}: ${step.word}`}
      className={cn(
        'group relative isolate flex min-h-[300px] flex-col justify-between overflow-hidden border border-border p-6 transition-colors duration-700 hover:border-border-strong md:p-8 lg:p-10',
        className,
      )}
    >
      {/* Silk only on the home rail (the cards that carry a scroll fill). The
          /discipline page and the reduced-motion stack stay plain. */}
      {fill ? (
        <WhenNear>
          <SilkBackground className="opacity-80" seed={Number.parseInt(step.numeral, 10) || 0} />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-background/60 via-background/5 to-transparent"
          />
        </WhenNear>
      ) : null}

      <div className="flex items-start justify-between gap-6">
        <span
          aria-hidden="true"
          className="font-mono text-[10px] tracking-[0.24em] text-muted-foreground tabular-nums"
        >
          {step.numeral} / {String(total).padStart(2, '0')}
        </span>
        <p className="max-w-[62%] text-right font-mono text-[10px] leading-relaxed tracking-[0.14em] text-muted-foreground uppercase">
          <span className="text-muted-foreground/60">Ends with · </span>
          {step.endsWith}
        </p>
      </div>

      <div className="mt-10 md:mt-0">
        <h3 className="relative text-[clamp(1.9rem,3.2vw,3.4rem)] leading-[1.05] font-light tracking-tight">
          {fill ? (
            <OutlinedText fill={fill}>{step.word}</OutlinedText>
          ) : (
            <span className="block">{step.word}</span>
          )}
        </h3>
        <p className="mt-4 max-w-[38ch] text-sm leading-relaxed font-light text-foreground/70 lg:text-[15px]">
          {step.lead}
        </p>

        {detail ? (
          <div className="mt-6 max-w-2xl">
            <p className="leading-relaxed font-light text-muted-foreground">{step.detail}</p>
            <ul className="mt-6 flex flex-col gap-y-1.5">
              {step.points.map((point) => (
                <li
                  key={point}
                  className="font-mono text-[10px] leading-relaxed tracking-[0.14em] text-muted-foreground uppercase"
                >
                  <span aria-hidden="true" className="mr-3 text-muted-foreground/50">
                    —
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {!detail ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-6 bottom-4 text-[clamp(4.5rem,9vw,8.5rem)] leading-none font-thin tracking-tighter tabular-nums select-none md:right-8 md:bottom-6 lg:right-10"
        >
          {fill ? (
            <OutlinedText fill={fill} faint>
              {step.numeral}
            </OutlinedText>
          ) : (
            <span className="block text-foreground/10">{step.numeral}</span>
          )}
        </span>
      ) : null}
    </article>
  )
}

/**
 * Outline text with an ink layer revealed over it. The outline is aria-hidden;
 * the ink layer carries the accessible text and is always in the DOM, so the
 * reveal is purely visual.
 */
function OutlinedText({
  children,
  fill,
  faint = false,
}: {
  children: React.ReactNode
  fill: FillSource
  faint?: boolean
}) {
  const { progress, index, count } = fill
  const amount = useSheetFill(progress, index, count)
  const clipPath = useTransform(amount, (v: number) => `inset(0 ${(1 - v) * 100}% 0 0)`)

  return (
    <span className="relative block">
      <span
        aria-hidden="true"
        className={cn(
          'block text-transparent',
          faint
            ? '[-webkit-text-stroke:1px_color-mix(in_oklab,var(--foreground)_14%,transparent)]'
            : '[-webkit-text-stroke:1px_color-mix(in_oklab,var(--foreground)_32%,transparent)]',
        )}
      >
        {children}
      </span>
      <motion.span
        style={{ clipPath }}
        className={cn(
          'absolute inset-0 block',
          faint ? 'text-foreground/[0.14]' : 'text-foreground',
        )}
      >
        {children}
      </motion.span>
    </span>
  )
}

/** No-motion fallback: the same sheets as a vertical stack. */
function PlainStack({ steps, showIntro }: { steps: readonly MethodStep[]; showIntro: boolean }) {
  return (
    <div className="relative border-t border-border">
      <div className={cn('container-page', showIntro ? 'py-24 md:py-32' : 'pt-2 pb-24 md:pb-32')}>
        {showIntro ? (
          <div className="mb-10 md:mb-14">
            <div className="mb-5 md:mb-7">
              <SectionLabel>03 / Discipline</SectionLabel>
            </div>
            <h2 className="text-[clamp(2.4rem,5.6vw,5.6rem)] leading-[0.92] font-thin tracking-tighter uppercase">
              Six phases.
              <br />
              <span className="font-bold">One standard.</span>
            </h2>
          </div>
        ) : null}
        <div className="flex max-w-3xl flex-col gap-4 md:gap-5">
          {steps.map((step) => (
            <PhaseSheet key={step.word} step={step} total={steps.length} detail />
          ))}
        </div>
      </div>
    </div>
  )
}
