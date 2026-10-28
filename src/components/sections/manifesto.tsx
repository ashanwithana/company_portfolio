'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import * as React from 'react'

type ManifestoProps = {
  /** The statement. Split on whitespace; each word lights up in turn. */
  text: string
  /** Small ordinal + label above the statement, e.g. "02 / Manifesto". */
  label?: string
}

/**
 * Scroll-pinned manifesto.
 *
 * A tall track holds a sticky, viewport-high stage. As the track scrolls past,
 * the statement's words go from dim to full ink one after another, so reading
 * speed is set by scroll speed. The text is real, selectable DOM the whole
 * time (only opacity changes), so it is readable without JavaScript and by
 * assistive technology. With reduced motion the statement is shown at full
 * strength and the track collapses to a normal section.
 */
export function Manifesto({ text, label = '02 / Manifesto' }: ManifestoProps) {
  const track = React.useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: track,
    offset: ['start start', 'end end'],
  })

  const words = text.split(/\s+/).filter(Boolean)

  return (
    <section
      id="manifesto"
      ref={track}
      aria-label="Manifesto"
      className={reduced ? 'relative border-t border-border py-24' : 'relative h-[250vh]'}
    >
      <div
        className={
          reduced
            ? 'container-page'
            : 'sticky top-0 flex h-[100svh] items-center border-t border-border'
        }
      >
        <div className={reduced ? '' : 'container-page'}>
          <p className="mb-10 label text-muted-foreground">{label}</p>

          <p className="max-w-6xl text-[clamp(1.75rem,4.4vw,4rem)] leading-[1.08] font-extralight tracking-[-0.03em]">
            {words.map((word, index) => (
              <Word
                key={`${word}-${index}`}
                progress={scrollYProgress}
                index={index}
                total={words.length}
                settled={Boolean(reduced)}
              >
                {word}
              </Word>
            ))}
          </p>
        </div>
      </div>
    </section>
  )
}

function Word({
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
  // Reveal across the first 80% of the track so the last words finish before
  // the stage unpins and the reader has a beat with the full statement.
  const span = 0.8
  const start = (index / total) * span
  const end = start + span / total
  const opacity = useTransform(progress, [start, end], [0.14, 1])

  return (
    <>
      <motion.span style={settled ? undefined : { opacity }}>{children}</motion.span>{' '}
    </>
  )
}
