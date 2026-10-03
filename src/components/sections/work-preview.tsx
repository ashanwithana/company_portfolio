import Link from 'next/link'

import { Reveal } from '@/components/ui/reveal'
import { BlockArt } from '@/components/ui/block-art'
import { publishedCaseStudies } from '@/content/case-studies'
import { clients } from '@/content/company'
import { cn } from '@/lib/utils'

/** Case study teaser — the three most recent featured projects. */
export function WorkPreview() {
  const featured = publishedCaseStudies()
    .filter((study) => study.featured)
    .slice(0, 3)

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {featured.map((study, index) => (
        <Reveal key={study.slug} delay={index * 70} as="article" className="h-full">
          <Link
            href={`/work/${study.slug}`}
            className="group flex h-full flex-col gap-6 rounded-2xl border border-border bg-card/40 p-5 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-foreground/25"
          >
            <BlockArt seed={study.slug} ratio="wide" className="w-full shrink-0" />

            <div className="flex flex-1 flex-col gap-3 px-2 pb-2">
              <p className="font-mono text-[0.6rem] tracking-[0.25em] text-muted-foreground uppercase">
                {study.client} · {study.year}
              </p>

              <h3 className="text-xl leading-snug transition-colors group-hover:text-mint">
                {study.title}
              </h3>

              <p className="leading-relaxed text-muted-foreground">{study.summary}</p>

              <span className="mt-auto inline-flex min-h-8 items-center gap-2 pt-4 font-mono text-[0.65rem] tracking-[0.2em] uppercase">
                Read case study
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  )
}

/** Client roster strip. */
export function ClientLogos() {
  return (
    <Reveal>
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3 lg:grid-cols-6">
        {clients.map((client) => (
          <li
            key={client.name}
            className="flex flex-col items-center justify-center gap-1 bg-background px-4 py-8 text-center"
          >
            <span className="font-display text-base font-semibold tracking-tight">
              {client.name}
            </span>
            <span className="font-mono text-[0.55rem] tracking-[0.2em] text-muted-foreground uppercase">
              {client.sector}
            </span>
          </li>
        ))}
      </ul>
    </Reveal>
  )
}

/** Single-line proof point, used between home page sections. */
export function StatStrip({
  items,
  className,
}: {
  items: readonly { value: string; label: string }[]
  className?: string
}) {
  return (
    <dl className={cn('grid grid-cols-2 gap-8 md:grid-cols-4', className)}>
      {items.map((item) => (
        <div key={item.label}>
          <dt className="sr-only">{item.label}</dt>
          <dd>
            <span className="font-display text-3xl font-semibold tabular-nums sm:text-4xl">
              {item.value}
            </span>
            <span className="mt-1 block font-mono text-[0.6rem] tracking-[0.2em] text-muted-foreground uppercase">
              {item.label}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  )
}
