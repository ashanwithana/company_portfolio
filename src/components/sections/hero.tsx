import Link from 'next/link'

import { HeadlineReveal } from '@/components/ui/headline-reveal'
import { OfficeTime } from '@/components/sections/office-time'
import { SilkBackground } from '@/components/ui/silk-background'
import { siteConfig } from '@/content/site'

/**
 * Home hero.
 *
 * One viewport tall, three layers:
 *
 *   1. the silk field (the only image),
 *   2. a hairline grid: twelve columns on desktop (four on mobile) plus
 *      horizontal rules at a quarter and three quarters of the screen, which
 *      gives the headline a structure to sit on,
 *   3. the content, vertically centred in the space above the footer row.
 *
 * The headline is two lines at one size, thin over bold. Under it sit a short
 * uppercase mono sentence and a single outlined button whose fill wipes in from
 * the left on hover. The bottom row carries the studio's location and local
 * time. Reduced motion collapses the headline rise via the global reset.
 */
export function Hero() {
  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative flex h-[100svh] min-h-[600px] flex-col justify-between overflow-hidden pb-12"
    >
      <SilkBackground />

      {/* Hairline grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 mx-auto flex w-full max-w-[1600px] justify-center px-4 md:px-8"
      >
        <div className="grid h-full w-full grid-cols-4 gap-0 border-x border-foreground/5 md:grid-cols-12">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className={
                i < 4
                  ? 'h-full border-r border-foreground/5'
                  : 'hidden h-full border-r border-foreground/5 md:block'
              }
            />
          ))}
        </div>
        <div className="absolute top-[25vh] left-0 hidden h-px w-full bg-foreground/5 md:block" />
        <div className="absolute top-[75vh] left-0 hidden h-px w-full bg-foreground/5 md:block" />
      </div>

      {/* Content, centred in the space above the footer row */}
      <div className="relative z-20 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-center px-4 pt-24 md:px-8">
        <h1 className="text-[clamp(3rem,8vw,9rem)] leading-[0.85] font-thin tracking-tighter uppercase">
          <HeadlineReveal text={'Get it built right\nthe first time.'} emphasizeLast />
        </h1>

        <div className="mt-8 flex flex-col items-start gap-12 md:mt-16 md:pl-2">
          <p
            className="max-w-xl font-mono text-xs leading-relaxed tracking-widest text-muted-foreground uppercase md:text-sm"
            style={{ animation: 'fade-up .8s cubic-bezier(.16,1,.3,1) 620ms both' }}
          >
            {siteConfig.description}
          </p>

          <Link
            href="/start-a-project"
            className="group relative inline-flex items-center gap-4 overflow-hidden border border-foreground/20 px-8 py-4 transition-colors duration-500 hover:border-foreground/60"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 z-0 origin-left scale-x-0 bg-foreground transition-transform duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-x-100"
            />
            <span className="relative z-10 font-mono text-[10px] font-bold tracking-[0.2em] uppercase transition-colors duration-500 group-hover:text-background">
              Start a project
            </span>
            <span
              aria-hidden="true"
              className="relative z-10 text-sm transition-[color,transform] duration-500 group-hover:translate-x-1 group-hover:text-background"
            >
              →
            </span>
          </Link>
        </div>
      </div>

      {/* Footer row: location and local time on the left, scroll cue on the right */}
      <div className="relative z-20 mx-auto flex w-full max-w-[1600px] items-end justify-between px-4 md:px-8">
        <p className="label text-muted-foreground">
          {siteConfig.location}&nbsp;·&nbsp;
          <OfficeTime timeZone="Asia/Colombo" />
        </p>
        <a
          href="#manifesto"
          className="inline-flex items-center gap-3 label text-muted-foreground transition-colors hover:text-foreground"
        >
          Scroll
          <span aria-hidden="true" className="inline-block h-8 w-px bg-border-strong" />
        </a>
      </div>
    </section>
  )
}
