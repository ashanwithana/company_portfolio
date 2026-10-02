'use client'

import * as React from 'react'

import { Reveal } from '@/components/ui/reveal'
import { useSmoothScroll } from '@/hooks/use-smooth-scroll'
import { navSections } from '@/content/site'
import { cn } from '@/lib/utils'

const SECTION_IDS = navSections.map((s) => s.id)

export type SectionHeadingProps = {
  id: string
  index: string
  label: string
  title: string
  description?: string
  className?: string
}

/**
 * Numbered editorial section header used across About / Work / Skills / Path /
 * Contact. The description anchors the smooth-scroll controller so every call
 * site navigates with the same offset.
 */
export function SectionHeading({
  id,
  index,
  label,
  title,
  description,
  className,
}: SectionHeadingProps) {
  const { scrollTo } = useSmoothScroll({ watch: SECTION_IDS })

  const handleJump = (target: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    scrollTo(target)
    // Keep the URL shareable without triggering a Next.js route change.
    window.history.replaceState(null, '', target)
  }

  return (
    <header className={cn('mb-14 md:mb-20', className)}>
      <Reveal>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs tracking-[0.3em] text-muted-foreground tabular-nums">
            {index}
          </span>
          <span className="h-px w-10 bg-mint" aria-hidden="true" />
          <a
            href={`#${id}`}
            onClick={handleJump(`#${id}`)}
            className="inline-flex min-h-8 items-center font-mono text-xs tracking-[0.3em] text-mint uppercase transition-opacity hover:opacity-70"
          >
            {label}
          </a>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <h2 className="mt-6 max-w-5xl text-4xl leading-[1.05] text-balance sm:text-5xl lg:text-6xl">
          {title}
        </h2>
      </Reveal>

      {description ? (
        <Reveal delay={140}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
        </Reveal>
      ) : null}
    </header>
  )
}

/** Section wrapper providing consistent vertical rhythm and landmark semantics. */
export function Section({
  id,
  label,
  children,
  className,
}: {
  id: string
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      id={id}
      aria-label={label}
      className={cn('container-page scroll-mt-24 py-24 md:py-32', className)}
    >
      {children}
    </section>
  )
}
