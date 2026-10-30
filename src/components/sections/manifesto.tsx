'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import * as React from 'react'

import { cn } from '@/lib/utils'

export type ManifestoLine = {
  /** One line of the statement. */
  text: string
  /** How many trailing words are set bold against the thin rest. */
  strongWords?: number
}

type ManifestoProps = {
  lines: readonly ManifestoLine[]
  /** Section label, e.g. "02 / Manifesto". */
  label?: string
  /** Short terms listed beside the label; each lights up as the scroll passes it. */
  keywords?: readonly string[]
  /** Anchor id. Must be unique per page when the component is used more than once. */
  id?: string
  /** Accessible name of the section. */
  ariaLabel?: string
  /** Height of the scroll track; the pinned stage is one viewport of it. */
  trackClassName?: string
  /** Optional content set under the statement, inside the pinned stage. */
  children?: React.ReactNode
}

/** Share of the track used for the reveal; the rest is a beat on the finished text. */
const REVEAL_SPAN = 0.85

/**
 * Scroll-pinned manifesto.
 *
 * A 250vh track holds a sticky, viewport-high stage, framed by faint vertical
 * rails. The statement is set thin and uppercase as outlined type; a solid
 * copy of each line is revealed over it by a mask that sweeps left to right,
 * one line after another, as the track scrolls past. Trailing words are bold.
 * Above it, the label's rule fills with progress and the keyword list lights
 * up in turn.
 *
 * The solid layer holds the real text and is always in the DOM; the outline
 * layer is aria-hidden. Only a mask and opacities change, so the statement is
 * readable without JavaScript and by assistive technology. With reduced motion
 * the statement is shown solid and the track collapses to an ordinary section.
 */
export function Manifesto({
  lines,
  label = '02 / Manifesto',
  keywords = [],
  id = 'manifesto',
  ariaLabel = 'Manifesto',
  trackClassName = 'h-[250vh]',
  children,
}: ManifestoProps) {
  const track = React.useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: track,
    offset: ['start start', 'end end'],
  })
  const ruleScale = useTransform(scrollYProgress, [0, REVEAL_SPAN], [0, 1], { clamp: true })

  return (
    <section
      id={id}
      ref={track}
      aria-label={ariaLabel}
      className={reduced ? 'relative border-t border-border py-24' : cn('relative', trackClassName)}
    >
      {/* Page rails */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 mx-auto flex w-full max-w-[1600px] justify-center px-4 md:px-8"
      >
        <div className="h-full w-full border-x border-foreground/5" />
      </div>

      <div
        className={
          reduced
            ? 'relative z-10 mx-auto w-full max-w-[1600px] px-4 md:px-8'
            : 'sticky top-0 h-[100svh] w-full overflow-hidden border-t border-border'
        }
      >
        <div
          className={
            reduced
              ? ''
              : 'relative z-10 mx-auto flex h-full w-full max-w-[1600px] flex-col justify-center px-4 md:px-8'
          }
        >
          <div className="mb-6 flex items-center justify-between gap-6 md:mb-10">
            <div className="flex flex-1 items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
                {label}
              </span>
              <span aria-hidden="true" className="relative h-px max-w-[280px] flex-1 bg-border">
                {reduced ? null : (
                  <motion.span
                    style={{ scaleX: ruleScale }}
                    className="absolute inset-0 origin-left bg-foreground/40"
                  />
                )}
              </span>
            </div>

            {keywords.length > 0 ? (
              <ol aria-hidden="true" className="hidden items-center gap-7 xl:flex">
                {keywords.map((keyword, index) => (
                  <Keyword
                    key={keyword}
                    progress={scrollYProgress}
                    index={index}
                    total={keywords.length}
                    settled={Boolean(reduced)}
                  >
                    {keyword}
                  </Keyword>
                ))}
              </ol>
            ) : null}
          </div>

          <p className="max-w-[1400px] text-[clamp(1.7rem,4.8vw,4.8rem)] leading-[1.04] tracking-tight text-balance uppercase">
            {lines.map((line, index) => (
              <Line
                key={line.text}
                line={line}
                progress={scrollYProgress}
                index={index}
                total={lines.length}
                settled={Boolean(reduced)}
              />
            ))}
          </p>

          {children}
        </div>
      </div>
    </section>
  )
}

function Keyword({
  children,
  progress,
  index,
  total,
  settled,
}: {
  children: React.ReactNode
  progress: MotionValue<number>
  index: number
  total: number
  settled: boolean
}) {
  const start = (index / total) * REVEAL_SPAN
  const end = ((index + 1) / total) * REVEAL_SPAN
  const opacity = useTransform(progress, [start, end], [0.25, 1])

  return (
    <motion.li
      style={settled ? undefined : { opacity }}
      className="flex items-center gap-3 font-mono text-[10px] tracking-[0.22em] uppercase"
    >
      <span aria-hidden="true" className="h-px w-5 bg-foreground" />
      {children}
    </motion.li>
  )
}

function Line({
  line,
  progress,
  index,
  total,
  settled,
}: {
  line: ManifestoLine
  progress: MotionValue<number>
  index: number
  total: number
  settled: boolean
}) {
  const words = line.text.split(/\s+/).filter(Boolean)
  const strongFrom = words.length - (line.strongWords ?? 1)

  // Each line owns an equal slice of the reveal span. Within its slice the
  // mask edge travels from just left of the line to just past its right end.
  const start = (index / total) * REVEAL_SPAN
  const end = ((index + 1) / total) * REVEAL_SPAN
  const edge = useTransform(progress, [start, end], [-12, 112], { clamp: true })
  const mask = useTransform(
    edge,
    (e: number) => `linear-gradient(100deg, #000 ${e}%, transparent ${e + 9}%)`,
  )

  const renderWords = (tone: 'outline' | 'solid') =>
    words.map((word, i) => {
      const strong = i >= strongFrom
      return (
        <span
          key={`${word}-${i}`}
          className={
            tone === 'outline'
              ? `mr-[0.26em] inline-block text-background ${strong ? 'font-bold' : 'font-thin'}`
              : `mr-[0.26em] inline-block ${strong ? 'font-bold text-foreground' : 'font-thin text-foreground/50'}`
          }
        >
          {word}
        </span>
      )
    })

  if (settled) {
    return <span className="block">{renderWords('solid')}</span>
  }

  return (
    <span className="relative block">
      <span
        aria-hidden="true"
        className="block [-webkit-text-stroke:2px_color-mix(in_oklab,var(--foreground)_34%,transparent)] [paint-order:stroke_fill]"
      >
        {renderWords('outline')}
      </span>
      <motion.span
        style={{ maskImage: mask, WebkitMaskImage: mask }}
        className="absolute inset-0 block"
      >
        {renderWords('solid')}
      </motion.span>
    </span>
  )
}
