'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import * as React from 'react'

import { BlockArt } from '@/components/ui/block-art'
import { ACCENT_BORDER, ACCENT_WASH } from '@/components/ui/cta-band'
import type { CaseStudy, CaseStudyCategory } from '@/content/case-studies'
import { cn } from '@/lib/utils'

type Filter = CaseStudyCategory | 'all'

/**
 * Filterable case study grid.
 *
 * Filtering is client-side over data that is already in the page payload, so the
 * initial render is server-rendered and complete — the grid works before
 * hydration and simply becomes interactive afterwards. Category links are plain
 * `?category=` queries so a filtered view stays shareable.
 */
export function CaseStudyGrid({
  studies,
  filters,
}: {
  studies: readonly CaseStudy[]
  filters: readonly { value: Filter; label: string }[]
}) {
  const [filter, setFilter] = React.useState<Filter>('all')
  const reducedMotion = useReducedMotion()

  // Keep state in sync when the URL changes (e.g. back/forward navigation).
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const requested = params.get('category') as Filter | null
    if (requested && filters.some((f) => f.value === requested)) {
      setFilter(requested)
    }
  }, [filters])

  const visible = React.useMemo(
    () => (filter === 'all' ? studies : studies.filter((s) => s.category === filter)),
    [filter, studies],
  )

  const selectFilter = (value: Filter) => {
    setFilter(value)

    // Update the URL without a navigation, so the view is shareable and
    // back/forward still work.
    const url = new URL(window.location.href)
    if (value === 'all') url.searchParams.delete('category')
    else url.searchParams.set('category', value)
    window.history.replaceState(null, '', url)
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
