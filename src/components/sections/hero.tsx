import { StatusBadge } from '@/components/ui/badge'
import { HeroVisual } from '@/components/ui/hero-visual'
import { ReviewsMarquee } from '@/components/sections/reviews-marquee'
import { siteConfig } from '@/content/site'

/**
 * Home hero.
 *
 * Composition mirrors the reference exactly: the globe is full-bleed and
 * centred in the upper viewport with an ONLINE status pill riding its upper
 * limb; the headline sits low, overlapping the globe's lower third; a single
 * centred sub-line follows; and a review marquee closes the section. There are
 * deliberately no CTA buttons here — conversion lives in the nav pill, the
 * method close and the final CTA band, which is where the reference puts it.
 */
export function Hero() {
  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative overflow-hidden pt-28 pb-20 sm:pb-40"
    >
      <div
        className="pointer-events-none absolute inset-0 dot-grid mask-fade-radial opacity-70"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-48 left-1/2 h-[34rem] w-[70rem] -translate-x-1/2 bg-[var(--gradient-glow)] opacity-40 blur-3xl"
        aria-hidden="true"
      />

      {/* Globe: centred, sized off viewport width so the whole sphere reads. */}
      <HeroVisual className="pointer-events-none absolute top-[3%] left-1/2 aspect-square w-[min(88vw,46rem)] -translate-x-1/2" />

      {/* Presence pill riding the globe's upper-right limb. */}
      <div className="absolute top-[16%] right-[8%] z-10 hidden sm:block" aria-hidden="true">
        <StatusBadge tone="coral">Online · Colombo</StatusBadge>
      </div>

      <div className="relative z-10 container-page">
        <div className="mt-[54svh] text-center">
          <h1
            className="mx-auto max-w-5xl display-xl"
            style={{ animation: 'fade-up .8s cubic-bezier(.16,1,.3,1) both' }}
          >
            Software that earns its place.
          </h1>

          <p
            className="mx-auto mt-7 max-w-xl text-[15px] leading-relaxed text-muted-foreground"
            style={{ animation: 'fade-up .8s cubic-bezier(.16,1,.3,1) 120ms both' }}
          >
            {siteConfig.description}
          </p>
        </div>
      </div>

      <div
        className="relative z-10"
        style={{ animation: 'fade-up .8s cubic-bezier(.16,1,.3,1) 240ms both' }}
      >
        <ReviewsMarquee />
      </div>
    </section>
  )
}
