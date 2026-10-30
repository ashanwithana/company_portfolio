import Link from 'next/link'
import type { ReactNode } from 'react'

import { HairlineGrid } from '@/components/ui/hairline-grid'
import { HeadlineReveal } from '@/components/ui/headline-reveal'
import { cn } from '@/lib/utils'

export type Crumb = {
  label: string
  /** Omitted on the current page — the last crumb is rendered as plain text. */
  href?: string
}

/**
 * Breadcrumb trail.
 *
 * Rendered as an ordered list wrapped in a labelled `<nav>` so assistive
 * technology announces position, which is the whole point of a breadcrumb.
 * Emits a matching `BreadcrumbList` JSON-LD graph via `<script>` in the page.
 */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('min-w-0', className)}>
      <ol className="flex flex-wrap items-center gap-x-2.5 gap-y-1 label text-[0.6rem] text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={item.label} className="flex items-center gap-2.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="rounded transition-colors hover:text-brand">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined} className="text-foreground">
                  {item.label}
                </span>
              )}
              {!isLast ? (
                <span aria-hidden="true" className="text-muted-foreground/40">
                  /
                </span>
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/**
 * Emit BreadcrumbList structured data.
 *
 * Must be rendered by a Server Component — React only emits executable/
 * data scripts from server-rendered markup.
 */
export function BreadcrumbSchema({ items }: { items: Crumb[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: item.href } : {}),
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

/**
 * Splits a headline so its closing words are set bold under a thin lead, the
 * same pairing the Discipline hero uses. One-word titles are set bold whole.
 */
export function splitHeadline(title: string) {
  const words = title.split(' ')
  if (words.length < 2) return title
  const tail = words.length >= 5 ? 2 : 1
  return `${words.slice(0, -tail).join(' ')}\n${words.slice(-tail).join(' ')}`
}

/**
 * Page-level hero used at the top of every inner page.
 *
 * Left-aligned, on the hairline grid shared with the home and Discipline heroes:
 * a mono label with a rule, a thin-over-bold headline and a light lede. No
 * background effect, so the pages stay quiet and the type does the work.
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  children,
  className,
}: {
  eyebrow: string
  title: string
  lede?: string
  children?: ReactNode
  className?: string
}) {
  return (
    <header
      className={cn(
        'relative overflow-hidden border-b border-border pt-36 pb-16 md:pt-48 md:pb-24',
        className,
      )}
    >
      <HairlineGrid />

      <div className="relative z-20 mx-auto w-full max-w-[1600px] px-4 md:px-8">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
            {eyebrow}
          </span>
          <span aria-hidden="true" className="h-px max-w-[160px] flex-1 bg-border-strong" />
        </div>

        <h1 className="mt-8 max-w-[18ch] text-[clamp(2.5rem,5.6vw,6rem)] leading-[0.9] font-thin tracking-tighter uppercase md:mt-10 md:max-w-6xl">
          <HeadlineReveal
            text={splitHeadline(title)}
            emphasizeLast
            className={title.includes(' ') ? undefined : 'font-bold'}
          />
        </h1>

        {lede ? (
          <p
            className="mt-10 max-w-2xl text-base leading-relaxed font-light text-muted-foreground md:mt-14 md:text-lg"
            style={{ animation: 'fade-up .8s cubic-bezier(.16,1,.3,1) 620ms both' }}
          >
            {lede}
          </p>
        ) : null}

        {children}
      </div>
    </header>
  )
}

/** Consistent page body wrapper, also used by the footer CTA band. */
export function PageSection({
  children,
  className,
  tone = 'default',
}: {
  children: ReactNode
  className?: string
  tone?: 'default' | 'muted'
}) {
  return (
    <section className={cn('relative py-20 md:py-28', tone === 'muted' && 'bg-muted', className)}>
      <div className="relative container-page">{children}</div>
    </section>
  )
}
