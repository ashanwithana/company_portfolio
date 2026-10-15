'use client'

import * as React from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'

import { Eyebrow } from '@/components/ui/badge'
import { GhostWord } from '@/components/ui/ghost-word'
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
  /**
   * The longer telling, rendered only where there is room for it — the
   * /discipline page. The home journey stays with the short version.
   */
  detail: string
}

/** Every panel is exactly this wide, so the horizontal travel is exact. */
const PANEL_VW = 85

/**
 * The six-phase discipline as cards on a horizontal sliding track.
 *
 * A pinned viewport scrubs sideways through the journey — intro plus one open
 * card per phase — while each card choreographs its own entrance, ghost
 * numerals drift behind at a lag, and a glowing traveler dot rides the
 * progress spine. Every card stays fully open, so nothing needs clicking.
 * Reduced-motion users get the same phases as calm ruled articles instead.
 */
export function Method({
  steps,
  showIntro = true,
}: {
  steps: readonly MethodStep[]
  /** The /discipline page carries its own PageHeader, so it suppresses this one. */
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
  const panelCount = (showIntro ? 1 : 0) + steps.length

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  })
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    // Panels are 85vw in a 100vw viewport, so the track runs offset by half
    // the leftover (7.5vw): panel 0 opens dead-centre and the last panel
    // closes dead-centre. Without the offset every panel sits 7.5vw left.
    ['7.5vw', `-${(panelCount - 1) * PANEL_VW - 7.5}vw`],
  )
  const scaleX = scrollYProgress
  // Traveler dot rides the spine.
  const dotLeft = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  const [active, setActive] = React.useState(0)
  const [pastIntro, setPastIntro] = React.useState(false)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    // Panel boundaries sit at even slices of progress (intro is panel 0).
    const panel = Math.floor(v * panelCount)
    setActive(Math.min(steps.length - 1, Math.max(0, panel - (showIntro ? 1 : 0))))
    setPastIntro(panel >= (showIntro ? 1 : 0))
  })

  return (
    <div
      ref={targetRef}
      className="relative bg-background"
      style={{ height: `${panelCount * 100}vh` }}
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        {/*
          One fixed ghost numeral for the whole viewport, keyed to the active
          phase — the number always matches the screen, and there is no 00.
        */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            {pastIntro ? (
              <motion.span
                key={steps[active]?.numeral}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.01 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-[30vw] leading-none font-extrabold tracking-[-0.04em] whitespace-nowrap text-foreground/[0.05] tabular-nums select-none"
              >
                {steps[active]?.numeral}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </div>

        <motion.div style={{ x }} className="flex w-max items-center">
          {showIntro ? <IntroPanel /> : null}

          {steps.map((step, i) => (
            <PhaseCard
              key={step.word}
              step={step}
              index={(showIntro ? 1 : 0) + i}
              total={panelCount}
              progress={scrollYProgress}
              count={steps.length}
            />
          ))}
        </motion.div>

        {/* Journey chrome: live counter, traveler dot, progress spine. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-8">
          <div className="container-page flex items-center gap-6">
            <p className="shrink-0 label text-muted-foreground tabular-nums" role="status">
              {String(active + 1).padStart(2, '0')} — {steps[active]?.label}
            </p>
            <div
              className="relative h-px flex-1 bg-border-strong"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={steps.length}
              aria-valuenow={active + 1}
              aria-label="Discipline progress"
            >
              <motion.div className="absolute inset-0 origin-left bg-brand" style={{ scaleX }} />
              <motion.span
                aria-hidden="true"
                style={{ left: dotLeft }}
                className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand shadow-[0_0_14px_3px_var(--brand)]"
              />
            </div>
            <p className="shrink-0 label text-muted-foreground tabular-nums">
              {String(steps.length).padStart(2, '0')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Shared visibility choreography: each panel peaks as its slice centers and
 * crossfades with its neighbours — at any scroll position at least one panel
 * is substantially visible, so the travel never crosses an empty screen. The
 * rise is derived from the same value, so motion and opacity stay in sync.
 */
function usePanelVisibility(
  progress: MotionValue<number>,
  index: number,
  total: number,
  fadeIn = true,
) {
  const center = (index + 0.5) / total
  const half = 0.9 / total
  const opacity = useTransform(progress, (p: number) => {
    // The opening frame skips its fade-in: it must be solid on arrival.
    if (!fadeIn && p <= center) return 1
    return Math.min(1, Math.max(0, 1 - Math.abs(p - center) / half))
  })
  const y = useTransform(opacity, [0, 1], [70, 0])
  return { opacity, y }
}

function IntroPanel() {
  // Deliberately static: this is the opening frame, so the whole set stays
  // together, centred, and fully legible — it only fades out on departure,
  // handled by the fixed crossfade below.
  return (
    <div className="relative flex h-svh w-[85vw] shrink-0 items-center justify-center px-[6vw]">
      <div className="@container relative w-full max-w-4xl text-center">
        <GhostWord word="Discipline" placement="center" className="-top-[0.14em]" />
        <p className="relative text-center label-wide text-muted-foreground">
          <span aria-hidden="true">[</span> <span className="text-foreground">Discipline</span>{' '}
          <span aria-hidden="true">]</span>
        </p>
        <h2 className="relative mt-5 display-lg">How every engagement runs.</h2>
        <p className="mt-6 label text-muted-foreground" aria-hidden="true">
          Scroll to travel <span className="text-brand">→</span>
        </p>
      </div>
    </div>
  )
}

function PhaseCard({
  step,
  index,
  total,
  progress,
  count,
}: {
  step: MethodStep
  /** Panel position in the whole track (intro counts as panel 0). */
  index: number
  total: number
  progress: MotionValue<number>
  count: number
}) {
  const { opacity, y } = usePanelVisibility(progress, index, total)

  return (
    <div className="relative flex h-svh w-[85vw] shrink-0 items-center justify-center px-[5vw]">
      <motion.div
        aria-label={`Phase ${step.numeral}: ${step.word}`}
        style={{ opacity, y }}
        className="relative flex h-full w-full max-w-3xl flex-col items-center justify-between py-[13svh] text-center"
      >
        <p className="label text-brand tabular-nums">
          Phase {step.numeral} / {String(count).padStart(2, '0')}
        </p>

        <div>
          <h3 className="mx-auto font-display text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] font-extrabold tracking-[-0.04em] text-balance">
            {step.word}
            <span aria-hidden="true" className="text-brand">
              .
            </span>
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-[1.65] font-light text-foreground/90">
            {step.lead}
          </p>
        </div>

        <div className="w-full">
          <ul className="mx-auto grid max-w-xl gap-x-10 gap-y-2.5 text-left sm:grid-cols-2">
            {step.points.map((point) => (
              <li
                key={point}
                className="relative pl-7 text-[13px] leading-relaxed font-light text-muted-foreground"
              >
                <span aria-hidden="true" className="absolute top-0 left-0 text-brand">
                  —
                </span>
                {point}
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-5 flex max-w-md items-baseline justify-center gap-3 border-t border-border pt-4 text-[13px]">
            <span className="shrink-0 label text-[0.6rem] text-brand">Ends with</span>
            <span className="text-foreground">{step.endsWith}</span>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

/** No-motion fallback: the same phases as ruled articles. */
function PlainStack({ steps, showIntro }: { steps: readonly MethodStep[]; showIntro: boolean }) {
  return (
    <div className="relative bg-background">
      <div className={cn('container-page', showIntro ? 'py-24 md:py-32' : 'pt-2 pb-24 md:pb-32')}>
        {showIntro ? (
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow className="justify-center">The discipline</Eyebrow>
            <h2 className="mx-auto mt-5 display-lg">How every engagement runs.</h2>
          </div>
        ) : null}
        <div className={cn('mx-auto max-w-4xl', showIntro ? 'mt-16' : 'mt-8')}>
          {steps.map((step) => (
            <article
              key={step.word}
              aria-label={`Phase ${step.numeral}: ${step.word}`}
              className="border-t border-border py-10 last:border-b"
            >
              <p className="label text-brand tabular-nums">
                {step.numeral} / {String(steps.length).padStart(2, '0')}
              </p>
              <h3 className="mt-3 display-md">{step.word}.</h3>
              <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">{step.lead}</p>
              <p className="mt-4 text-[13px]">
                <span className="label text-[0.6rem] text-brand">Ends with </span>
                <span className="text-foreground">{step.endsWith}</span>
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
