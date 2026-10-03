import { StatusBadge } from '@/components/ui/badge'
import { ButtonLink } from '@/components/ui/button'
import { HeroVisual } from '@/components/ui/hero-visual'
import { Reveal } from '@/components/ui/reveal'
import { Typewriter } from '@/components/ui/typewriter'
import { studioStats } from '@/content/services'
import { contactContent, siteConfig } from '@/content/site'

const headline = ['Software that', 'earns its', 'place.']

const rotatingPhrases = [
  'Odoo & ERP',
  'RAG pipelines',
  'interface design',
  'platform migration',
]

export function Hero() {
  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-32 pb-24"
    >
      <div
        className="pointer-events-none absolute inset-0 dot-grid opacity-70 mask-fade-radial"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-48 left-1/2 h-[34rem] w-[70rem] -translate-x-1/2 bg-[var(--gradient-glow)] opacity-40 blur-3xl"
        aria-hidden="true"
      />
      {/*
        Reading scrim. On narrow screens the globe sits behind the copy, so this
        gradient guarantees headline and body contrast regardless of what the
        globe is doing underneath. Fades out once the globe moves to the gutter.
      */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent lg:hidden"
        aria-hidden="true"
      />

      {/*
        Dotted globe. Absolutely positioned so it sits behind the copy on narrow
        screens and beside it from `xl` up.
      */}
      {/*
        Dotted globe. Centred behind the copy on small screens, where the
        headline is short enough to clear it; from `lg` up it moves to the right
        gutter so the two never compete for the same space.
      */}
      <HeroVisual className="pointer-events-none absolute top-[42%] left-1/2 aspect-square w-[min(78vw,24rem)] -translate-x-1/2 -translate-y-1/2 opacity-80 lg:top-1/2 lg:right-[3%] lg:left-auto lg:w-[min(38vw,30rem)] lg:translate-x-0 lg:-translate-y-1/2 lg:opacity-100" />

      {/* Copy paints above the globe so it never washes out the headline. */}
      <div className="relative z-10 container-page">
        <div className="max-w-3xl">
          <StatusBadge className="animate-fade-up">{contactContent.availability.badge}</StatusBadge>

          {/*
            Each line is a block so the gradient sits on one line. The trailing
            space keeps the accessible name readable rather than
            "Software thatearns itsplace."
          */}
          <h1 className="mt-9 display-xl">
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
                <p className="mt-1.5 font-mono text-[0.55rem] tracking-[0.2em] text-muted-foreground uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>

      <a
        href="#services"
        className="no-print absolute inset-x-0 bottom-8 mx-auto flex w-fit flex-col items-center gap-2.5 font-mono text-[0.6rem] tracking-[0.3em] text-muted-foreground uppercase transition-colors hover:text-coral"
      >
        <span>scroll</span>
        <span className="h-10 w-px bg-gradient-to-b from-coral to-transparent" aria-hidden="true" />
      </a>
    </section>
  )
}