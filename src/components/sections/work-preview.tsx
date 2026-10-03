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
            className="group flex h-full flex-col gap-6 rounded-3xl border border-border bg-card/40 p-7 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-border-strong"
          >
            <BlockArt seed={study.slug} ratio="wide" className="w-full shrink-0" />

            <div className="flex flex-1 flex-col gap-3 px-2 pb-2">
              <p className="label text-[0.55rem] text-muted-foreground">
                {study.client} · {study.year}
              </p>

              <h3 className="text-xl leading-snug transition-colors group-hover:text-coral">
                {study.title}
              </h3>

              <p className="leading-relaxed text-muted-foreground">{study.summary}</p>

              <span className="mt-auto inline-flex min-h-8 items-center gap-2 pt-4 label text-[0.6rem]">
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
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-3 lg:grid-cols-6">
        {clients.map((client) => (
          <li
            key={client.name}
            className="flex flex-col items-center justify-center gap-1.5 bg-background px-4 py-9 text-center"
          >
            <span className="text-base font-semibold tracking-tight">{client.name}</span>
            <span className="label text-[0.5rem] text-muted-foreground">{client.sector}</span>
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
            <span className="block display-md tabular-nums">{item.value}</span>
            <span className="mt-2 block label text-[0.55rem] text-muted-foreground">
              {item.label}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  )
}
