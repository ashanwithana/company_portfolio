import Link from 'next/link'

import { GhostWord } from '@/components/ui/ghost-word'
import { Reveal } from '@/components/ui/reveal'
import { services } from '@/content/services'

/**
 * "What we do."
 *
 * The homepage's services snapshot between the discipline and the contact beat:
 * one ruled row per capability in the site's editorial voice — number, title,
 * summary, arrow. No cards, no colour washes; the hairline rules and hover
 * nudge match the rest of the page.
 */
export function ServicesSnapshot() {
  return (
    <section aria-label="What we do" className="relative overflow-hidden bg-muted py-24 md:py-32">
      <div
        className="pointer-events-none absolute inset-0 dot-grid mask-fade-radial opacity-60"
        aria-hidden="true"
      />

      <div className="relative container-page">
        <header className="@container relative text-center">
          <GhostWord word="Services" placement="center" className="-top-[0.14em]" />
          <p className="relative text-center label-wide text-muted-foreground">
            <span aria-hidden="true">[</span> <span className="text-foreground">Services</span>{' '}
            <span aria-hidden="true">]</span>
          </p>

          <h2 className="relative mx-auto mt-5 max-w-3xl display-lg">What we do.</h2>
        </header>

        <div className="mx-auto mt-14 max-w-4xl md:mt-20">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 50}>
              <Link
                href={service.canonicalHref ?? `/services/${service.slug}`}
                className="group grid items-baseline gap-2 border-t border-border py-7 transition-transform duration-500 ease-out last:border-b hover:translate-x-2 md:grid-cols-[minmax(0,4rem)_minmax(0,1fr)_minmax(0,1fr)_auto] md:gap-8 md:py-8"
              >
                <span className="label text-[0.6rem] text-brand tabular-nums">
                  {(i + 1).toString().padStart(2, '0')}
                </span>
                <span className="display-sm">{service.title}</span>
                <span className="max-w-md text-sm leading-relaxed text-muted-foreground">
                  {service.summary}
                </span>
                <span
                  aria-hidden="true"
                  className="hidden text-xl text-muted-foreground transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-foreground md:block"
                >
                  →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
