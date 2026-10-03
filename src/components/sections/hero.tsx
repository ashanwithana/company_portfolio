import { StatusBadge } from '@/components/ui/badge'
import { HeroVisual } from '@/components/ui/hero-visual'
import { siteConfig } from '@/content/site'

/**
 * Home hero.
 *
 * The globe sits in normal flow, centred and scaled to roughly a third of the
 * viewport, with the ONLINE status pill riding its upper-right limb. The
 * headline follows underneath in its own block rather than overlapping the
 * sphere — the two used to collide, and the smaller globe plus a stacked
 * layout reads more calmly at every breakpoint.
 *
 * The globe keeps its load sequence (CSS dotted fallback fading out as the
 * WebGL canvas scales and fades in), and the headline/sub-line fade up behind
 * it on the same easing curve. There are deliberately no CTA buttons here —
 * conversion lives in the nav pill, the method close and the final CTA band.
 */
export function Hero() {
  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative overflow-hidden pt-24 pb-24 sm:pb-28"
    >
      <div
        className="pointer-events-none absolute inset-0 dot-grid mask-fade-radial opacity-70"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-48 left-1/2 h-[34rem] w-[70rem] -translate-x-1/2 bg-[var(--gradient-glow)] opacity-40 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 container-page">
        {/* Globe. Wrapper is the positioning context for the presence pill,
            so the pill tracks the sphere instead of the viewport. */}
        <div className="relative mx-auto aspect-square w-[min(70vw,22rem)]">
          <HeroVisual />

          <div className="absolute top-[8%] right-[2%] z-10 hidden sm:block" aria-hidden="true">
            <StatusBadge tone="coral">Online · Colombo</StatusBadge>
          </div>
        </div>

        <div className="mt-12 text-center sm:mt-14">
          <h1
            className="mx-auto max-w-5xl display-xl"
            style={{ animation: 'fade-up .8s cubic-bezier(.16,1,.3,1) 120ms both' }}
          >
            Software that earns its place.
          </h1>

          <p
            className="mx-auto mt-7 max-w-xl text-[15px] leading-relaxed text-muted-foreground"
            style={{ animation: 'fade-up .8s cubic-bezier(.16,1,.3,1) 240ms both' }}
          >
            {siteConfig.description}
          </p>
        </div>
      </div>
    </section>
  )
}
