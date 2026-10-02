'use client'

import { Tag } from '@/components/ui/badge'
import { Reveal } from '@/components/ui/reveal'
import { marqueeItems, skillGroups } from '@/content/skills'
import { cn } from '@/lib/utils'

/** Oversized running ticker that acts as the section's visual anchor. */
function SkillMarquee() {
  return (
    <div className="mask-fade-x overflow-hidden py-6" aria-hidden="true">
      <div className="animate-marquee flex w-max whitespace-nowrap">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0">
            {marqueeItems.map((item) => (
              <span key={`${copy}-${item}`} className="flex items-center">
                <span className="px-6 font-display text-5xl font-semibold tracking-tight text-foreground/10 uppercase select-none sm:text-6xl lg:text-7xl">
                  {item}
                </span>
                <span className="text-coral" aria-hidden="true">
                  ✦
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/** Toolkit section: grouped skill chips with per-group counts. */
export function Skills() {
  return (
    <div>
      <SkillMarquee />

      <dl className="mt-12 space-y-12">
        {skillGroups.map((group, index) => (
          <Reveal key={group.name} delay={index * 70} as="div" className="border-b border-border pb-12 last:border-0 last:pb-0">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <dt className="font-display text-3xl font-semibold tracking-tight text-muted-foreground sm:text-4xl">
                {group.name}
              </dt>
              <dd className="font-mono text-[0.7rem] tracking-[0.2em] text-muted-foreground tabular-nums">
                {group.items.length} tools
              </dd>
            </div>

            <ul className="mt-6 flex flex-wrap gap-2.5">
              {group.items.map((item) => (
                <li key={item}>
                  <Tag className={cn('px-4 py-2 text-[0.7rem]')}>{item}</Tag>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </dl>
    </div>
  )
}
