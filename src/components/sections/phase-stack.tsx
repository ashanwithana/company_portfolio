import type { CSSProperties } from 'react'

import type { MethodStep } from '@/components/sections/method'

/**
 * The discipline as a stack of tall cards.
 *
 * Each card is `position: sticky` with a top offset that grows with its index,
 * so as you scroll the next card slides up over the previous one and leaves
 * that card's header strip showing above it. By the last card the six strips
 * read as a running index of where you are. It is pure CSS: no scroll
 * listeners, nothing to disable for reduced motion, and the content is plain
 * server-rendered markup, readable without JavaScript.
 *
 * The strip height and the per-card offset step must match (3.25rem), since the
 * strip is exactly what peeks out. The stacking only applies under the `stack`
 * variant (see globals.css): on smaller screens a card is taller than the room
 * left beneath the stuck strips, so it would be unreadable. There the cards are
 * an ordinary vertical list.
 *
 * Cards need an opaque ground so the card beneath is hidden as it is covered.
 */
export function PhaseStack({ steps }: { steps: readonly MethodStep[] }) {
  const total = String(steps.length).padStart(2, '0')

  return (
    <ol className="relative flex list-none flex-col gap-5 stack:gap-[18vh]">
      {steps.map((step, index) => (
        <li
          key={step.numeral}
          id={`phase-${step.numeral}`}
          style={{ '--k': index } as CSSProperties}
          className="scroll-mt-28 stack:sticky stack:top-[calc(5.5rem+var(--k)*3.25rem)]"
        >
          <article
            aria-label={`Phase ${step.numeral}: ${step.word}`}
            className="border border-border-strong bg-background"
          >
            {/* Header strip: the part that stays visible once covered. */}
            <header className="flex h-12 items-center justify-between gap-6 border-b border-border px-5 md:h-[3.25rem] md:px-8">
              <span className="font-mono text-[10px] tracking-[0.24em] text-muted-foreground tabular-nums">
                {step.numeral} / {total}
              </span>
              <span className="text-xs tracking-[0.2em] text-foreground/80 uppercase">
                {step.word}
              </span>
            </header>

            <div className="grid gap-10 p-6 md:grid-cols-12 md:gap-12 md:p-10 lg:p-14">
              <div className="md:col-span-5">
                <h3 className="text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.9] font-thin tracking-tighter uppercase">
                  {step.word}
                </h3>
                <p className="mt-6 max-w-[34ch] text-lg leading-relaxed font-light text-foreground/80">
                  {step.lead}
                </p>
              </div>

              <div className="md:col-span-7">
                <p className="max-w-2xl text-[15px] leading-[1.75] font-light text-muted-foreground">
                  {step.detail}
                </p>

                <ul className="mt-8 border-t border-border">
                  {step.points.map((point, pointIndex) => (
                    <li
                      key={point}
                      className="flex items-baseline gap-4 border-b border-border py-3"
                    >
                      <span
                        aria-hidden="true"
                        className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground tabular-nums"
                      >
                        {String(pointIndex + 1).padStart(2, '0')}
                      </span>
                      <span className="block text-sm font-light text-foreground/80 first-letter:uppercase">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 border border-border-strong px-5 py-4">
                  <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
                    Ends with
                  </p>
                  <p className="mt-2 text-base font-normal first-letter:uppercase">
                    {step.endsWith}
                  </p>
                </div>
              </div>
            </div>
          </article>
        </li>
      ))}
    </ol>
  )
}
