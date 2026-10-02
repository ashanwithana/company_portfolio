'use client'

import * as React from 'react'

import { StatusBadge } from '@/components/ui/badge'
import { ButtonLink } from '@/components/ui/button'
import { HeroBlob } from '@/components/ui/hero-blob'
import { Typewriter } from '@/components/ui/typewriter'
import { heroContent, navSections, siteConfig } from '@/content/site'
import { useSmoothScroll } from '@/hooks/use-smooth-scroll'

const SECTION_IDS = navSections.map((s) => s.id)

/** Above-the-fold hero: headline, rotating role, CTAs and the blob focal point. */
export function Hero() {
  const { scrollTo } = useSmoothScroll({ watch: SECTION_IDS })

  const go = (href: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    scrollTo(href)
  }

  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20"
    >
      {/* Ambient backdrop */}
      <div
        className="grid-bg pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[34rem] w-[70rem] -translate-x-1/2 bg-[var(--gradient-glow)] opacity-50 blur-3xl"
        aria-hidden="true"
      />

      <HeroBlob className="opacity-90 md:right-[6%] md:left-auto md:w-[30rem] md:translate-x-0 md:-translate-y-1/2" />

      <div className="container-page relative">
        <div className="max-w-3xl">
          <StatusBadge className="animate-fade-up">{siteConfig.availability.badge}</StatusBadge>

          {/*
            Each line is its own block so the gradient can sit on a single line.
            The trailing `{' '}` keeps the accessible name and any copy-paste
            readable — without it the three lines run together as
            "Builds weirdand usefulstuff.".
          */}
          <h1 className="mt-8 text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
            {heroContent.headline.map((line, index) => (
              <span
                key={line}
                className={index === 1 ? 'block text-gradient' : 'block'}
                style={{ animation: `fade-up .8s cubic-bezier(.16,1,.3,1) ${index * 90}ms both` }}
              >
                {line}
                {' '}
              </span>
            ))}
          </h1>

          <p
            className="mt-8 font-mono text-lg tracking-[0.12em] text-foreground sm:text-xl"
            style={{ animation: 'fade-up .8s cubic-bezier(.16,1,.3,1) 280ms both' }}
          >
            <span className="text-coral" aria-hidden="true">
              →
            </span>{' '}
            <Typewriter words={heroContent.roles} />
          </p>

          <p
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
            style={{ animation: 'fade-up .8s cubic-bezier(.16,1,.3,1) 360ms both' }}
          >
            {heroContent.body}
          </p>

          <div
            className="mt-10 flex flex-wrap items-center gap-4"
            style={{ animation: 'fade-up .8s cubic-bezier(.16,1,.3,1) 440ms both' }}
          >
            <ButtonLink
              href={heroContent.primaryCta.href}
              size="lg"
              onClick={go(heroContent.primaryCta.href)}
            >
              {heroContent.primaryCta.label}
              <span aria-hidden="true">→</span>
            </ButtonLink>
            <ButtonLink
              href={heroContent.secondaryCta.href}
              variant="outline"
              size="lg"
              onClick={go(heroContent.secondaryCta.href)}
            >
              {heroContent.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#about"
        onClick={go('#about')}
        className="no-print absolute inset-x-0 bottom-8 mx-auto flex w-fit flex-col items-center gap-2 font-mono text-[0.65rem] tracking-[0.3em] text-muted-foreground uppercase transition-colors hover:text-foreground"
      >
        <span>↓ Scroll</span>
        <span
          className="h-8 w-px bg-gradient-to-b from-foreground/50 to-transparent"
          aria-hidden="true"
        />
      </a>
    </section>
  )
}
