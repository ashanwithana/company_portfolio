'use client'

import { Reveal } from '@/components/ui/reveal'
import { timeline } from '@/content/timeline'
import { cn } from '@/lib/utils'

const DOT_TONE = {
  work: 'bg-mint',
  edu: 'bg-foreground/40',
} as const

/** Vertical career timeline with a gradient spine. */
export function Timeline() {
  return (
    <ol className="relative pl-10 sm:pl-16">
      {/* Spine */}
      <span
        className="absolute top-2 bottom-2 left-[0.3rem] w-px bg-gradient-to-b from-mint via-primary to-coral sm:left-[0.55rem]"
        aria-hidden="true"
      />

      {timeline.map((entry, index) => (
        <Reveal key={entry.id} as="li" delay={index * 90} className="relative pb-14 last:pb-0">
          {/* Node */}
          <span
            className="absolute top-1.5 -left-10 flex size-3 items-center justify-center sm:-left-16"
            aria-hidden="true"
          >
            {entry.current ? (
              <>
                <span className={cn('absolute size-3 rounded-full animate-pulse-ring', DOT_TONE[entry.kind])} />
                <span className={cn('relative size-3 rounded-full ring-4 ring-background', DOT_TONE[entry.kind])} />
              </>
            ) : (
              <span
                className={cn(
                  'relative size-2.5 rounded-full ring-4 ring-background',
                  DOT_TONE[entry.kind],
                )}
              />
            )}
          </span>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase tabular-nums">
              {entry.period}
            </p>
            {entry.current ? (
              <span className="flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.2em] text-mint uppercase">
                <span className="size-1.5 rounded-full bg-mint" aria-hidden="true" />
                Currently
              </span>
            ) : null}
            <span className="rounded-full border border-border px-3 py-1 font-mono text-[0.6rem] tracking-[0.2em] text-muted-foreground uppercase">
              {entry.kindLabel}
            </span>
          </div>

          <h3 className="mt-4 text-3xl leading-tight sm:text-4xl">{entry.title}</h3>
          <p className="mt-2 font-mono text-[0.7rem] tracking-[0.2em] text-coral uppercase">
            {entry.org}
          </p>
          <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">{entry.body}</p>
        </Reveal>
      ))}
    </ol>
  )
}
