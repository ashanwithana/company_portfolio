'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import * as React from 'react'

import { BlockArt } from '@/components/ui/block-art'
import { ACCENT_BORDER, ACCENT_WASH } from '@/components/ui/cta-band'
import type { CaseStudy, CaseStudyCategory } from '@/content/case-studies'
import { cn } from '@/lib/utils'

type Filter = CaseStudyCategory | 'all'

/**
 * Filterable case study grid.
 *
 * Filtering happens client-side over data already present in the page payload,
 * so the initial render is server-rendered and complete — the grid is fully
 * readable before hydration and becomes interactive afterwards.
 *
 * `useSearchParams` requires a Suspense boundary, which is why this is split:
 * the page renders the static shell and the interactive grid streams in.
 */
export function CaseStudyGrid(props: CaseStudyGridProps) {
  return (
    <React.Suspense fallback={<CaseStudyGridSkeleton {...props} />}>
      <CaseStudyGridInner {...props} />
    </React.Suspense>
  )
}

export type CaseStudyGridProps = {
  studies: readonly CaseStudy[]
  filters: readonly { value: Filter; label: string }[]
}

/**
 * Server-rendered placeholder.
 *
 * Shows every study rather than a fixed count, so the fallback height matches
 * what hydration will produce and the layout does not jump.
 */
function CaseStudyGridSkeleton({ studies }: CaseStudyGridProps) {
  return (
    <div>
      <ul className="grid gap-5 md:grid-cols-2" aria-busy="true" aria-label="Loading case studies">
        {studies.map((study) => (
          <li
            key={study.slug}
            className="flex flex-col gap-6 rounded-2xl border border-border bg-card/40 p-5"
          >
            <div
              className="aspect-16/10 w-full animate-pulse rounded-xl bg-muted"
              aria-hidden="true"
            />
            <div className="flex flex-col gap-3 px-2 pb-2">
              <div className="h-3 w-32 animate-pulse rounded bg-muted" aria-hidden="true" />
              <div className="h-6 w-3/4 animate-pulse rounded bg-muted" aria-hidden="true" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" aria-hidden="true" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CaseStudyGridInner({ studies, filters }: CaseStudyGridProps) {
  const reducedMotion = useReducedMotion()

  /**
   * The URL is the single source of truth for the active filter, so a filtered
   * view is shareable and back/forward work with no extra state to reconcile.
   */
  const searchParams = useSearchParams()
  const requested = searchParams.get('category') as Filter | null
  const filter: Filter = requested && filters.some((f) => f.value === requested) ? requested : 'all'

  const visible = React.useMemo(
    () => (filter === 'all' ? studies : studies.filter((s) => s.category === filter)),
    [filter, studies],
  )

  const selectFilter = (value: Filter) => {
    // Update the URL without a full navigation, preserving scroll position.
    const params = new URLSearchParams(window.location.search)
    if (value === 'all') params.delete('category')
    else params.set('category', value)
    window.history.replaceState(null, '', `?${params}`)
  }

  return (
    <div>
      {/* Filters */}
      <div
        className="mb-10 flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Filter case studies by category"
      >
        {filters.map((option) => {
          const isActive = filter === option.value

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => selectFilter(option.value)}
              aria-pressed={isActive}
              className={cn(
                'min-h-9 rounded-full border px-5 py-2 font-mono text-[0.7rem] tracking-[0.25em] uppercase transition-colors',
                isActive
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border text-muted-foreground hover:border-foreground/25 hover:text-foreground',
              )}
            >
              {option.label}
            </button>
          )
        })}

        <span
          className="ml-auto font-mono text-[0.7rem] tracking-[0.2em] text-muted-foreground tabular-nums"
          // Announce the result count so filter changes are perceivable.
          role="status"
          aria-live="polite"
        >
          {visible.length.toString().padStart(2, '0')} projects
        </span>
      </div>

      {/* Grid */}
      <motion.ul layout={!reducedMotion} className="grid gap-5 md:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((study) => (
            <motion.li
              key={study.slug}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={`/work/${study.slug}`}
                className={cn(
                  'group flex h-full flex-col gap-6 rounded-2xl border border-border bg-gradient-to-br p-5 transition-[border-color,transform] duration-500 hover:-translate-y-1',
                  ACCENT_WASH[study.tint],
                  ACCENT_BORDER[study.tint],
                )}
              >
                <BlockArt seed={study.slug} ratio="wide" className="w-full shrink-0" />

                <div className="flex flex-1 flex-col gap-3 px-2 pb-2">
                  <p className="font-mono text-[0.6rem] tracking-[0.25em] text-muted-foreground uppercase">
                    {study.client} · {study.categoryLabel} · {study.year}
                  </p>

                  <h2 className="text-2xl leading-snug transition-colors group-hover:text-mint">
                    {study.title}
                  </h2>

                  <p className="leading-relaxed text-muted-foreground">{study.summary}</p>

                  <span className="mt-auto inline-flex min-h-8 items-center gap-2 pt-4 font-mono text-[0.65rem] tracking-[0.2em] uppercase">
                    Read case study
                    <span
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  )
}
