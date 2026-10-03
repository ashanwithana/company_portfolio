import { StatusBadge } from '@/components/ui/badge'
import { ButtonLink } from '@/components/ui/button'
import { HeroVisual } from '@/components/ui/hero-visual'
import { Reveal } from '@/components/ui/reveal'
import { Typewriter } from '@/components/ui/typewriter'
import { studioStats } from '@/content/services'
import { contactContent, siteConfig } from '@/content/site'

const headline = ['Software that', 'earns its', 'place.']

const rotatingPhrases = ['Odoo & ERP', 'RAG pipelines', 'interface design', 'platform migration']

/**
 * Home hero.
 *
 * Composition mirrors the reference: the globe is full-bleed and centred in the
 * upper two-thirds of the viewport, and the headline sits low, overlapping the
 * globe's lower edge. Stacking the type over the globe rather than beside it is
 * what keeps the hero reading as one image instead of two columns.
 */
export function Hero() {
  return (
    <section id="top" aria-label="Introduction" className="relative overflow-hidden pt-32 pb-20">
      <div
        className="pointer-events-none absolute inset-0 dot-grid mask-fade-radial opacity-70"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-48 left-1/2 h-[34rem] w-[70rem] -translate-x-1/2 bg-[var(--gradient-glow)] opacity-40 blur-3xl"
        aria-hidden="true"
      />

      {/*
        Globe: centred, sized off viewport width so the whole sphere reads as a
        sphere. Sized by height instead, the camera ends up inside it and the
        point cloud degenerates into scattered dots.
      */}
      <HeroVisual className="pointer-events-none absolute top-[3%] left-1/2 aspect-square w-[min(88vw,46rem)] -translate-x-1/2" />

      <div className="relative z-10 container-page">
        {/* Status pill sits above the globe's upper limb. */}
        <StatusBadge className="animate-fade-up">{contactContent.availability.badge}</StatusBadge>

        {/* Headline starts over the globe's lower third, as in the reference. */}
        <div className="mt-[56svh]">
          <h1 className="max-w-4xl display-xl">
            {headline.map((line, index) => (
              <span
                key={line}
                className={index === 1 ? 'block text-gradient' : 'block'}
                style={{ animation: `fade-up .8s cubic-bezier(.16,1,.3,1) ${index * 90}ms both` }}
              >
                {line}{' '}
              </span>
            ))}
          </h1>

          <p
            className="mt-8 max-w-xl text-lg tracking-[0.06em] text-foreground md:text-xl"
            style={{ animation: 'fade-up .8s cubic-bezier(.16,1,.3,1) 280ms both' }}
          >
            <span className="text-coral" aria-hidden="true">
              →
            </span>{' '}
            <Typewriter words={rotatingPhrases} />
          </p>

          <p
            className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
            style={{ animation: 'fade-up .8s cubic-bezier(.16,1,.3,1) 360ms both' }}
          >
            {siteConfig.description}
          </p>

          <div
            className="mt-10 flex flex-wrap items-center gap-4"
            style={{ animation: 'fade-up .8s cubic-bezier(.16,1,.3,1) 440ms both' }}
          >
            <ButtonLink href="/contact" size="lg">
              Start a project
              <span aria-hidden="true">→</span>
            </ButtonLink>
            <ButtonLink href="/work" variant="outline" size="lg">
              See our work
            </ButtonLink>
          </div>

          {/* Track record, stated plainly. */}
          <Reveal delay={440} className="mt-12 flex flex-wrap items-center gap-2">
            {[
              'Odoo partner',
              'Dynamics 365',
              'SAP Business One',
              'Salesforce',
              'RAG pipelines',
            ].map((item) => (
              <span
                key={item}
                className="inline-flex items-center rounded-full border border-border px-3.5 py-2 font-mono text-[0.6rem] tracking-[0.2em] text-muted-foreground uppercase"
              >
                <span aria-hidden="true" className="mr-2 text-coral">
                  ✦
                </span>
                {item}
              </span>
            ))}
          </Reveal>

          {/* Studio credibility, above the fold but out of the headline's way. */}
          <Reveal
            delay={520}
            className="mt-14 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-8 border-t border-border pt-8 sm:grid-cols-4"
          >
            {studioStats.map((stat) => (
              <div key={stat.label}>
                <p className="display-md tabular-nums">
                  {stat.value}
                  <span className="text-coral">{stat.suffix}</span>
                </p>
                <p className="mt-1.5 label text-[0.55rem] text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
