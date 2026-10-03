import Link from 'next/link'
import type { ReactNode } from 'react'

import { Eyebrow } from '@/components/ui/badge'
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
                <Link href={item.href} className="rounded transition-colors hover:text-coral">
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
 * Page-level hero used at the top of every inner page.
 *
 * `ghost` repeats the eyebrow as oversized background type, which ties every
 * inner page to the home page's visual language without a bespoke illustration.
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  ghost,
  children,
  className,
}: {
  eyebrow: string
  title: string
  lede?: string
  ghost?: string
  children?: ReactNode
  className?: string
}) {
  return (
    <header className={cn('relative overflow-hidden pt-36 pb-16 md:pt-44 md:pb-24', className)}>
      <div
        className="pointer-events-none absolute inset-0 dot-grid mask-fade-radial opacity-50"
        aria-hidden="true"
      />

      <div className="relative container-page">
        {/*
          Ghost word sits behind the title rather than behind the section's top
          padding — anchored to the content box so it lands on the headline at
          every viewport width instead of bleeding off the top of the document.
        */}
        {ghost ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-[0.1em] left-0 font-display text-[clamp(8rem,48vh,28rem)] text-ghost"
          >
            {ghost}
          </span>
        ) : null}

        <Eyebrow accent className="relative">
          {eyebrow}
        </Eyebrow>

        <h1 className="mt-7 max-w-5xl display-lg">{title}</h1>

        {lede ? (
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
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
  dotGrid = false,
}: {
  children: ReactNode
  className?: string
  tone?: 'default' | 'muted' | 'paper'
  dotGrid?: boolean
}) {
  return (
    <section
      className={cn(
        'relative py-20 md:py-28',
        tone === 'muted' && 'bg-muted',
        tone === 'paper' && 'tone-paper',
        className,
      )}
    >
      {dotGrid ? (
        <div
          className="pointer-events-none absolute inset-0 dot-grid mask-fade-radial opacity-60"
          aria-hidden="true"
        />
      ) : null}

      <div className="relative container-page">{children}</div>
    </section>
  )
}
