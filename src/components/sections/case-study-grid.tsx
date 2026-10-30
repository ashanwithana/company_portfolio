'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import * as React from 'react'

import { useIsMounted } from '@/hooks/use-media-query'
import type { CaseStudy, CaseStudyCategory } from '@/content/case-studies'
import { cn } from '@/lib/utils'

type Filter = CaseStudyCategory | 'all'

export type CaseStudyGridProps = {
  studies: readonly CaseStudy[]
  filters: readonly { value: Filter; label: string }[]
}

const QUERY_KEY = 'category'

/**
 * Fired after this component writes the URL itself. `history.replaceState` does
 * not emit `popstate`, so the store would otherwise never learn about it.
 */
const URL_CHANGE = 'sketchlabs:url-change'

/**
 * Filterable case study grid.
 *
 * The active filter lives in the URL, so a filtered view is shareable and
 * back/forward work — but it is read through `useSyncExternalStore` over
 * `window.location` rather than via `useSearchParams`.
 *
 * That is a deliberate trade. `useSearchParams` forces this subtree behind a
 * Suspense boundary, so the server streams a skeleton and the client swaps in
 * the real grid: two different trees for the same content, which React reports
 * as a hydration mismatch. Treating the URL as an external store instead means
 * the server snapshot is always "no filter" and the client hydrates identical
 * markup, then re-reads. The cost is that the server always renders the
 * unfiltered list — which is also what a crawler sees, so every case study
 * stays linked in the DOM regardless of the query string.
 */
export function CaseStudyGrid({ studies, filters }: CaseStudyGridProps) {
  const reducedMotion = useReducedMotion()
  const mounted = useIsMounted()

  const subscribe = React.useCallback((onStoreChange: () => void) => {
    window.addEventListener('popstate', onStoreChange)
    window.addEventListener(URL_CHANGE, onStoreChange)
    return () => {
      window.removeEventListener('popstate', onStoreChange)
      window.removeEventListener(URL_CHANGE, onStoreChange)
    }
  }, [])

  // Server snapshot is always empty, which resolves to "all" — matching what
  // the server rendered.
  const getSnapshot = React.useCallback(
    () => new URLSearchParams(window.location.search).get(QUERY_KEY) ?? '',
    [],
  )
  const getServerSnapshot = React.useCallback(() => '', [])

  const requested = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const filter: Filter =
    requested && filters.some((f) => f.value === requested) ? (requested as Filter) : 'all'

  const visible = React.useMemo(
    () => (filter === 'all' ? studies : studies.filter((s) => s.category === filter)),
    [filter, studies],
  )

  const selectFilter = (value: Filter) => {
    // Update the URL without a full navigation, preserving scroll position.
    const params = new URLSearchParams(window.location.search)
    if (value === 'all') params.delete(QUERY_KEY)
    else params.set(QUERY_KEY, value)
    window.history.replaceState(null, '', `?${params}`)
    window.dispatchEvent(new Event(URL_CHANGE))
  }

  return (
    <div>
      {/* Filters */}
      <div
        className="mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-4"
        role="group"
        aria-label="Filter case studies by category"
      >
        <div className="flex flex-wrap gap-x-7 gap-y-2">
          {filters.map((option) => {
            const isActive = filter === option.value

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => selectFilter(option.value)}
                aria-pressed={isActive}
                className={cn(
                  'min-h-9 border-b pb-1 font-mono text-[10px] tracking-[0.25em] uppercase transition-colors',
                  isActive
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground',
                )}
              >
                {option.label}
              </button>
            )
          })}
        </div>

        <span
          className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase tabular-nums"
          // Announce the result count so filter changes are perceivable.
          role="status"
          aria-live="polite"
        >
          {visible.length.toString().padStart(2, '0')} projects
        </span>
      </div>

      {/*
        Index.

        `initial` is disabled until mount. On the server and during hydration
        that makes both sides render the settled `animate` state, so React has no
        attribute mismatch to reconcile. Only afterwards does the entrance
        transform switch on, which is when it actually matters: rows appearing
        as the filter changes.
      */}
      <motion.ul layout={!reducedMotion} className="border-t border-border-strong">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((study, position) => (
            <motion.li
              key={study.slug}
              layout
              initial={mounted ? { opacity: 0, y: 16 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="border-b border-border"
            >
              <Link
                href={`/work/${study.slug}`}
                className="group grid gap-x-8 gap-y-5 px-4 py-8 transition-colors duration-300 hover:bg-foreground hover:text-background focus-visible:bg-foreground focus-visible:text-background md:grid-cols-12 md:px-6 md:py-10"
              >
                <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground transition-colors group-hover:text-background/60 group-focus-visible:text-background/60 md:col-span-1 md:pt-3">
                  {String(position + 1).padStart(2, '0')}
                </span>

                <div className="md:col-span-6">
                  <h2 className="text-2xl leading-[1.05] font-light tracking-tight md:text-4xl">
                    {study.title}
                  </h2>
                  <p className="mt-4 max-w-xl leading-relaxed font-light text-muted-foreground transition-colors group-hover:text-background/70 group-focus-visible:text-background/70">
                    {study.summary}
                  </p>
                </div>

                <dl className="grid grid-cols-3 content-start gap-4 font-mono text-[10px] tracking-[0.22em] uppercase md:col-span-4 md:col-start-8 md:grid-cols-1 md:gap-2 md:pt-3">
                  <div>
                    <dt className="sr-only">Client</dt>
                    <dd>{study.client}</dd>
                  </div>
                  <div className="text-muted-foreground transition-colors group-hover:text-background/60 group-focus-visible:text-background/60">
                    <dt className="sr-only">Type</dt>
                    <dd>{study.categoryLabel}</dd>
                  </div>
                  <div className="text-muted-foreground transition-colors group-hover:text-background/60 group-focus-visible:text-background/60">
                    <dt className="sr-only">Year</dt>
                    <dd>{study.year}</dd>
                  </div>
                </dl>

                <span
                  aria-hidden="true"
                  className="hidden justify-self-end text-2xl font-thin transition-transform duration-300 group-hover:translate-x-1.5 md:col-span-1 md:block md:pt-1"
                >
                  →
                </span>
                <span className="sr-only">Read case study</span>
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  )
}
