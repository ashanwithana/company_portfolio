import Link from 'next/link'
import type { ReactNode } from 'react'

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
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={item.label} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link href={item.href} className="rounded transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined} className="text-foreground">
                  {item.label}
                </span>
              )}
              {!isLast ? (
                <span aria-hidden="true" className="text-muted-foreground/50">
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

/** Page-level hero used at the top of every inner page. */
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
    <header className={cn('container-page pt-32 pb-14 md:pt-40 md:pb-20', className)}>
      <p className="font-mono text-[0.7rem] tracking-[0.3em] text-mint uppercase">{eyebrow}</p>

      <h1 className="mt-6 max-w-4xl text-4xl leading-[1.05] text-balance sm:text-5xl lg:text-6xl">
        {title}
      </h1>

      {lede ? (
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{lede}</p>
      ) : null}

      {children}
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
    <section
      className={cn(
        'py-20 md:py-28',
        tone === 'muted' && 'border-y border-border bg-muted/20',
        className,
      )}
    >
      <div className="container-page">{children}</div>
    </section>
  )
}
