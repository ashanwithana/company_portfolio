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
 * Page-level hero used at the top of every inner page.
 *
 * Plain on the page ground: no background effects, so inner pages stay quiet and
 * the type does the work.
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
    <header className={cn('relative overflow-hidden pt-36 pb-16 md:pt-44 md:pb-24', className)}>
      <div className="relative container-page">
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
