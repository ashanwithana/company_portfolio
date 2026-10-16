import { HeadlineReveal } from '@/components/ui/headline-reveal'
import { HeroVisual } from '@/components/ui/hero-visual'
import { OfficeTime } from '@/components/sections/office-time'
import { Starfield } from '@/components/ui/starfield'
import { siteConfig } from '@/content/site'

/**
 * Home hero — the galaxy centrepiece.
 *
 * Behind the globe: a twinkling starfield with an occasional meteor, plus two
 * faint drifting nebulas, all CSS and all theme-aware. Around the sphere: the
 * mist halo, the circling moon with its glow, and neighbours Venus and Mars.
 * The headline overlaps the globe's lower limb so its first line clears the
 * fold. Everything pauses for reduced motion via the global reset.
 */
export function Hero() {
  return (
    <section id="top" aria-label="Introduction" className="relative overflow-hidden pt-20 pb-24">
      <div
        className="pointer-events-none absolute inset-0 dot-grid mask-fade-radial opacity-60"
        aria-hidden="true"
      />
      {/* Starfield + nebulas: the galaxy behind everything. Edge-masked like
          the dot grid so no hard boundary ever shows. */}
      <Starfield parallax count={150} className="mask-fade-radial opacity-90" />
      {/* Aurora ribbons sweeping behind the globe — wide colour flow, drifting
          vertical rays, and a flickering bright core. Top-masked so they
          dissolve before the headline. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[62%] overflow-hidden opacity-70"
        style={{
          maskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
        }}
      >
        <div
          className="absolute -inset-x-[10%] top-[-30%] h-[70%] rotate-[-14deg] blur-2xl"
          style={{
            background:
              'linear-gradient(to right, transparent 5%, color-mix(in oklab, var(--brand) 16%, transparent) 30%, color-mix(in oklab, var(--primary) 20%, transparent) 55%, color-mix(in oklab, var(--brand) 10%, transparent) 75%, transparent 95%)',
            backgroundSize: '220% 100%',
            animation:
              'aurora-sway 14s ease-in-out infinite alternate, aurora-flow 11s ease-in-out infinite alternate',
          }}
        />
        <div
          className="absolute -inset-x-[20%] top-[-25%] h-[65%] rotate-[-10deg] blur-xl"
          style={{
            background:
              'repeating-linear-gradient(100deg, transparent 0 34px, color-mix(in oklab, var(--brand) 9%, transparent) 34px 62px, transparent 62px 112px, color-mix(in oklab, var(--primary) 11%, transparent) 112px 142px)',
            animation: 'aurora-rays 12s ease-in-out infinite alternate',
          }}
        />
        <div
          className="absolute -inset-x-[10%] top-[-8%] h-[38%] rotate-[-12deg] blur-xl"
          style={{
            background:
              'linear-gradient(to right, transparent 20%, color-mix(in oklab, var(--brand) 22%, transparent) 42%, color-mix(in oklab, var(--primary) 24%, transparent) 58%, transparent 82%)',
            backgroundSize: '200% 100%',
            animation:
              'aurora-sway 9s ease-in-out infinite alternate-reverse, aurora-flow 7s ease-in-out infinite alternate, aurora-flicker 5s ease-in-out infinite',
          }}
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-40 size-[30rem] animate-mist rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--primary) 13%, transparent) 0%, transparent 70%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 size-[26rem] animate-mist rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--brand) 10%, transparent) 0%, transparent 70%)',
          animationDelay: '-5s',
        }}
      />
      <div
        className="pointer-events-none absolute -top-44 left-1/2 h-[28rem] w-[64rem] -translate-x-1/2 bg-[var(--gradient-glow)] opacity-35 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 container-page">
        {/* Globe. Sized so the headline's first line just clears the fold
            while the second line stays below it. */}
        <div className="relative mx-auto aspect-square w-[min(84vw,32rem)] sm:w-[min(54vw,32rem)]">
          <HeroVisual />

          {/* Mist halo — circular only, fading to transparent well inside
              its own box so no rectangular edge ever shows. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[-14%] animate-mist rounded-full blur-xl"
            style={{
              background:
                'radial-gradient(circle, transparent 58%, color-mix(in oklab, var(--foreground) 3%, transparent) 69%, color-mix(in oklab, var(--foreground) 1.5%, transparent) 79%, transparent 87%)',
            }}
          />

          {/* Moon — a small cratered sphere circling the globe. No path
              line, just the body, on a slow 48s loop kept tight to the globe
              so it passes in the middle, clear of Venus and Mars.
              The soft glow rides with it, so the mist brightens locally
              as the moon passes by. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[-3%] animate-lunar"
          >
            <span className="absolute top-0 left-1/2 -translate-x-1/2">
              <span
                className="absolute top-1/2 left-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl"
                style={{
                  background:
                    'radial-gradient(circle, color-mix(in oklab, var(--foreground) 16%, transparent) 0%, color-mix(in oklab, var(--foreground) 7%, transparent) 45%, transparent 70%)',
                }}
              />
              <span
                className="relative block size-3.5 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle at 35% 32%, #f4f4fa 0%, #cfcfda 42%, #9a9aa6 72%, #6e6e7a 100%)',
                  boxShadow:
                    '0 0 14px 3px rgba(205,205,225,0.35), 0 0 3px 1px rgba(205,205,225,0.5)',
                }}
              />
            </span>
          </div>

          {/* Neighbours — Venus before Earth (left) and Mars after it (right),
              each hovering just off the limb with its own faint glow.
              Sizes follow real diameters — Venus 12,104 km, Mars 6,779 km,
              Moon 3,474 km — at one shared scale (Moon 14px : Mars 28px :
              Venus 48px). Earth itself is the hero and intentionally oversized;
              at true scale Venus would nearly match it and wreck the layout.
              Both sit outside the moon's tightened orbit, and stay off on
              small screens where there is no room to clear them. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-[30%] -left-[12%] hidden animate-float-soft sm:-left-[15%] sm:block"
          >
            <span
              className="block size-12 rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 35% 32%, #fdf3d8 0%, #e8c97a 45%, #b98a3e 75%, #7a5423 100%)',
                boxShadow: '0 0 16px 4px rgba(232,201,122,0.28), 0 0 4px 1px rgba(232,201,122,0.4)',
              }}
            />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[11%] bottom-[20%] hidden animate-float-soft sm:-right-[14%] sm:block"
            style={{ animationDelay: '-3.2s' }}
          >
            <span
              className="block size-7 rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 35% 32%, #ffd9c2 0%, #e07b4f 45%, #a03e22 75%, #5f1f10 100%)',
                boxShadow: '0 0 16px 4px rgba(224,123,79,0.28), 0 0 4px 1px rgba(224,123,79,0.4)',
              }}
            />
          </div>

          <div className="absolute top-[7%] right-[0%] z-10 hidden sm:block">
            <span className="relative inline-flex items-center gap-2.5 rounded-full border border-border bg-card/70 px-4 py-2.5 label backdrop-blur-sm">
              <span className="relative flex size-2 items-center justify-center" aria-hidden="true">
                <span className="absolute size-2 animate-pulse-ring rounded-full text-brand" />
                <span className="size-1.5 rounded-full bg-brand" />
              </span>
              Colombo&nbsp;·&nbsp;
              <OfficeTime timeZone="Asia/Colombo" />
            </span>
          </div>
        </div>

        {/* Sits below the globe — just the first line clears
            the fold on a typical viewport. */}
        <div className="relative z-10 mt-8 text-center sm:mt-10">
          <h1 className="mx-auto max-w-5xl display-xl">
            <HeadlineReveal text={'Get it built right\nthe first time.'} />
          </h1>

          <p
            className="mx-auto mt-7 max-w-xl text-[15px] leading-relaxed text-muted-foreground"
            style={{ animation: 'fade-up .8s cubic-bezier(.16,1,.3,1) 620ms both' }}
          >
            {siteConfig.description}
          </p>
        </div>
      </div>
    </section>
  )
}
