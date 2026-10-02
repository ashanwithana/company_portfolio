'use client'

import * as React from 'react'

type Options = {
  /** Scroll offset in px applied when scrolling to the target. */
  offset?: number
  /** Track which section is currently in view. */
  watch?: readonly string[]
}

/**
 * Lightweight smooth-scroll controller.
 *
 * Uses the native View Transitions API when the browser supports it and falls
 * back to `scrollIntoView` otherwise. Also drives an active-section observer for
 * the sticky navigation.
 */
export function useSmoothScroll({ offset = -72, watch = [] }: Options = {}) {
  const scrollTo = React.useCallback(
    (target: string) => {
      const el = document.querySelector<HTMLElement>(target)
      if (!el) return

      const top = el.getBoundingClientRect().top + window.scrollY + offset

      if (document.startViewTransition) {
        document.startViewTransition(() => {
          window.scrollTo({ top, behavior: 'auto' })
        })
      } else {
        window.scrollTo({
          top,
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth',
        })
      }
    },
    [offset],
  )

  const activeSection = useActiveSection(watch)

  return { scrollTo, activeSection }
}

/** Returns the id of the watched section that is closest to the top of the viewport. */
function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = React.useState<string | null>(ids[0] ?? null)
  const key = ids.join('|')

  React.useEffect(() => {
    const sectionIds = key.split('|').filter(Boolean)
    if (sectionIds.length === 0) return

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        const first = visible[0]
        if (first) setActive(first.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [key])

  return active
}
