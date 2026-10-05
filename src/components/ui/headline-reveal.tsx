import { Fragment } from 'react'

import { cn } from '@/lib/utils'

export type HeadlineRevealProps = {
  /** Split on whitespace and revealed in order. */
  text: string
  className?: string
  /** Stagger between words, in milliseconds. */
  stagger?: number
  /** Delay before the first word, in milliseconds. */
  delay?: number
}

/**
 * Word-by-word headline reveal.
 *
 * Each word sits in its own overflow mask and rises from below it, so the type
 * appears to be drawn from behind a curtain rather than simply fading in. The
 * stagger is what sells it — a single fade reads as nothing happening.
 *
 * `\n` in `text` forces a line break: each line renders as its own block so
 * the break holds at every viewport width.
 *
 * Three details that matter:
 *
 *   - The mask carries `padding-bottom` and a matching negative margin. Without
 *     it the descenders on words like "place." are clipped by the mask.
 *   - Word-separating spaces are rendered outside the masks. Inside one they get
 *     trimmed, which collapses the spacing and breaks line wrapping.
 *   - Nothing is hidden from assistive technology. `overflow: hidden` is purely
 *     visual, and inline spans separated by real whitespace read as ordinary
 *     prose, so the h1 exposes its text exactly once.
 *   - It is pure CSS with inline delays, so it renders on the server and needs
 *     no JavaScript. The global reduced-motion reset collapses the duration, so
 *     the headline is simply present for anyone who asks for less motion.
 */
export function HeadlineReveal({
  text,
  className,
  stagger = 85,
  delay = 260,
}: HeadlineRevealProps) {
  const lines = text.split('\n')
  let order = 0

  return (
    <span className={cn('inline-block', className)}>
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} className="block">
          {line.split(' ').map((word, index, words) => {
            const at = delay + order++ * stagger
            return (
              <Fragment key={`${word}-${index}`}>
                <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
                  <span
                    className="inline-block will-change-transform"
                    style={{
                      animation: `word-rise .9s cubic-bezier(.16,1,.3,1) ${at}ms both`,
                    }}
                  >
                    {word}
                  </span>
                </span>
                {/* Real whitespace between masks, outside the overflow box. */}
                {index < words.length - 1 ? ' ' : null}
              </Fragment>
            )
          })}
        </span>
      ))}
    </span>
  )
}
