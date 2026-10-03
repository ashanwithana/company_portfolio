'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import * as React from 'react'

import { BlockArt } from '@/components/ui/block-art'
import { useIsMounted } from '@/hooks/use-media-query'
import { ACCENT_BORDER, ACCENT_WASH } from '@/lib/accent'
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
const URL_CHANGE = 'northlight:url-change'

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
                'min-h-9 rounded-full border px-5 py-2 label transition-colors',
                isActive
                  ? 'border-coral bg-coral text-coral-foreground'
                  : 'border-border text-muted-foreground hover:border-border-strong hover:text-foreground',
              )}
            >
              {option.label}
            </button>
          )
        })}

        <span
          className="ml-auto label text-[0.6rem] text-muted-foreground tabular-nums"
          // Announce the result count so filter changes are perceivable.
          role="status"
          aria-live="polite"
        >
          {visible.length.toString().padStart(2, '0')} projects
        </span>
      </div>

      {/*
        Grid.

        `initial` is disabled until mount. On the server and during hydration
        that makes both sides render the settled `animate` state, so React has no
        attribute mismatch to reconcile. Only afterwards does the entrance
        transform switch on, which is when it actually matters: items appearing
        as the filter changes. The first paint has no entrance animation either
        way — it is already at the target state.
      */}
      <motion.ul layout={!reducedMotion} className="grid gap-5 md:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((study) => (
            <motion.li
              key={study.slug}
              layout
              initial={mounted ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={`/work/${study.slug}`}
                className={cn(
                  'group flex h-full flex-col gap-6 rounded-3xl border border-border bg-gradient-to-br p-5 transition-[border-color,transform] duration-500 hover:-translate-y-1',
                  ACCENT_WASH[study.tint],
                  ACCENT_BORDER[study.tint],
                )}
              >
                <BlockArt seed={study.slug} ratio="wide" className="w-full shrink-0" />

                <div className="flex flex-1 flex-col gap-3 px-2 pb-2">
                  <p className="label text-[0.55rem] text-muted-foreground">
                    {study.client} · {study.categoryLabel} · {study.year}
                  </p>

                  <h2 className="display-sm transition-colors group-hover:text-coral">
                    {study.title}
                  </h2>

                  <p className="leading-relaxed text-muted-foreground">{study.summary}</p>

                  <span className="mt-auto inline-flex min-h-8 items-center gap-2 pt-4 label text-[0.6rem]">
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
