'use client'

import * as React from 'react'

import { useIsMounted, useReducedMotion } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'

type RevealProps = {
  children: React.ReactNode
  className?: string
  /** Delay in ms before the element animates in. */
  delay?: number
  /** Initial offset in px — the element travels from here to its natural spot. */
  y?: number
  as?: 'div' | 'section' | 'li' | 'article'
}

/**
 * Scroll-triggered entrance animation built on IntersectionObserver.
 *
 * Implemented without a scroll library so it stays dependency-light and never
 * forces layout on the scroll path. State is only ever written from the
 * observer callback (async by definition), and the reduced-motion /
 * no-IntersectionObserver branches are *derived* rather than pushed through
 * setState — avoiding the cascading render React 19 warns about.
 */
export function Reveal({ children, className, delay = 0, y = 24, as = 'div' }: RevealProps) {
  const Tag = as
  const reducedMotion = useReducedMotion()
  const mounted = useIsMounted()
  const ref = React.useRef<HTMLElement>(null)
  const [entered, setEntered] = React.useState(false)

  React.useEffect(() => {
    const node = ref.current
    if (!node) return

    // Bail out (leaving `entered` false) when we cannot or should not animate.
    if (reducedMotion || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setEntered(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [reducedMotion])

  // Reduced motion (or a browser without IO): render the settled state outright.
  //
  // `mounted` gates the IntersectionObserver check because `typeof
  // IntersectionObserver` differs between server (undefined) and client
  // (defined) — reading it during render is a hydration mismatch on every
  // page. Before mount we render the settled (visible) state, which also keeps
  // content readable when JavaScript never runs.
  const ioAvailable = mounted && typeof IntersectionObserver !== 'undefined'
  const settled = reducedMotion || !ioAvailable

  const style: React.CSSProperties =
    settled || entered
      ? { transitionDelay: `${delay}ms` }
      : { opacity: 0, transform: `translate3d(0, ${y}px, 0)`, transitionDelay: `${delay}ms` }

  return (
    <Tag
      // @ts-expect-error -- polymorphic ref across the allowed element union.
      ref={ref}
      style={style}
      className={cn(
        'transition-[opacity,transform] duration-700 ease-out',
        settled && 'motion-reduce:transition-none',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
