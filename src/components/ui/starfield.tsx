'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Small deterministic PRNG so the starfield is identical on every render.
 * Stability matters here — a reshuffle on each render would read as flicker.
 */
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Star = {
  left: number
  top: number
  size: number
  duration: number
  delay: number
}

function buildStars(count: number): Star[] {
  const rand = mulberry32(0x57a9)
  return Array.from({ length: count }, () => {
    // Mostly dust, a visible middle band, a few bright points.
    const roll = rand()
    return {
      left: rand() * 100,
      top: rand() * 100,
      size: roll < 0.68 ? 1 : roll < 0.93 ? 2 : 3,
      duration: 2.5 + rand() * 4,
      // Negative delays desync the field from page load.
      delay: -rand() * 7,
    }
  })
}

/**
 * Twinkling starfield plus a single occasional shooting star.
 *
 * Pure CSS twinkle with per-star duration and delay, so the field breathes
 * instead of blinking in unison. Dots use the foreground ink, so they read as
 * starlight on the dark ground and fade to faint dust on the cream ground.
 * With `parallax`, the whole layer drifts gently against the pointer for
 * depth — eased in a rAF loop that only runs while visible, writing straight
 * to the DOM so React never re-renders. The global reduced-motion reset
 * stills everything, leaving a static field behind.
 */
export function Starfield({
  count = 120,
  parallax = false,
  className,
}: {
  count?: number
  parallax?: boolean
  className?: string
}) {
  const stars = React.useMemo(() => buildStars(count), [count])
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!parallax || !el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let running = false
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0

    const onMove = (event: PointerEvent) => {
      tx = (event.clientX / window.innerWidth - 0.5) * 2
      ty = (event.clientY / window.innerHeight - 0.5) * 2
    }
    const loop = () => {
      if (!running) return
      raf = requestAnimationFrame(loop)
      cx += (tx - cx) * 0.04
      cy += (ty - cy) * 0.04
      el.style.transform = `translate3d(${(cx * -14).toFixed(2)}px, ${(cy * -10).toFixed(2)}px, 0) scale(1.04)`
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = entry?.isIntersecting ?? true
        if (visible && !running) {
          running = true
          raf = requestAnimationFrame(loop)
        } else if (!visible && running) {
          running = false
          cancelAnimationFrame(raf)
        }
      },
      { threshold: 0 },
    )
    io.observe(el)
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      running = false
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
    }
  }, [parallax])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      {stars.map((star, i) => (
        <span
          key={i}
          className="absolute animate-twinkle rounded-full bg-foreground"
          style={{
            left: `${star.left.toFixed(2)}%`,
            top: `${star.top.toFixed(2)}%`,
            width: star.size,
            height: star.size,
            animationDuration: `${star.duration.toFixed(2)}s`,
            animationDelay: `${star.delay.toFixed(2)}s`,
          }}
        />
      ))}

      {/* Lone meteor: invisible almost the whole loop, one quick streak. */}
      <span
        aria-hidden="true"
        className="absolute top-[10%] right-[6%] h-px w-28 animate-shoot"
        style={{
          background:
            'linear-gradient(to left, color-mix(in oklab, var(--foreground) 80%, transparent), transparent)',
        }}
      />
    </div>
  )
}
