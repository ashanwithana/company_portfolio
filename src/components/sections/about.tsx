'use client'

import * as React from 'react'

import { AboutPortrait } from '@/components/ui/about-portrait'
import { aboutContent, type Stat } from '@/content/site'
import { marqueeItems } from '@/content/skills'
import { useCountUp } from '@/hooks/use-count-up'
import { useReducedMotion } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'

/** Animated counter. Isolated in its own component so each has its own rAF loop. */
function StatCounter({ value, suffix, label, decimals = 0 }: Stat) {
  const current = useCountUp(value, 1600, decimals)
  return (
    <div className="flex flex-col gap-1">
      <span className="font-display text-4xl font-semibold tabular-nums sm:text-5xl">
        {current}
        <span className="text-coral">{suffix}</span>
      </span>
      <span className="font-mono text-[0.65rem] tracking-[0.25em] text-muted-foreground uppercase">
        {label}
      </span>
    </div>
  )
}

/** Infinite horizontal ticker of technologies. */
function TechMarquee() {
  const reducedMotion = useReducedMotion()

  return (
    <div className="mask-fade-x relative overflow-hidden py-2" aria-hidden="true">
      <div className={cn('flex w-max gap-10 whitespace-nowrap', !reducedMotion && 'animate-marquee')}>
        {/* Rendered twice so the -50% translate loops seamlessly. */}
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center gap-10">
            {marqueeItems.map((item) => (
              <span
                key={`${copy}-${item}`}
                className="font-mono text-sm tracking-[0.2em] text-muted-foreground uppercase"
              >
                {item}
                <span className="text-coral">/</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/** About section: portrait, bio, animated stats and the tech ticker. */
export function About() {
  return (
    <>
      <div className="grid gap-14 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-20">
        {/* Portrait */}
        <div className="relative">
          <AboutPortrait className="aspect-4/5 w-full" />

          {/* Identity plate */}
          <div className="absolute -right-3 -bottom-5 rounded-xl border border-border bg-card/90 px-4 py-3 backdrop-blur-md">
            <p className="font-mono text-xs tracking-[0.25em] text-foreground uppercase">
              {aboutContent.name}
            </p>
            <p className="mt-1 font-mono text-[0.65rem] tracking-[0.2em] text-mint uppercase">
              {aboutContent.status}
            </p>
          </div>
        </div>

        {/* Bio + stats */}
        <div className="flex flex-col gap-10">
          <p className="text-2xl leading-snug text-foreground sm:text-3xl">
            {aboutContent.lead.map((line, index) => (
              <React.Fragment key={line}>
                {index === 1 ? <span className="text-gradient"> {line}</span> : line}
              </React.Fragment>
            ))}
          </p>

          <p className="max-w-xl leading-relaxed text-muted-foreground">{aboutContent.body}</p>

          <dl className="grid grid-cols-2 gap-x-8 gap-y-10 border-t border-border pt-10 sm:grid-cols-4">
            {aboutContent.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <StatCounter {...stat} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Ticker */}
      <div className="mt-16">
        <TechMarquee />
      </div>
    </>
  )
}
