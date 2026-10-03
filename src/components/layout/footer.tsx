import Link from 'next/link'
import type { ReactNode } from 'react'

import { NewsletterForm } from '@/components/sections/newsletter-form'
import { services } from '@/content/services'
import { footerContent, footerNav, siteConfig } from '@/content/site'

/**
 * Site footer.
 *
 * Four tracked columns over a status strip, capped by a marquee band. The columns
 * are laid out as an even grid rather than a brand-plus-sitemap split, because at
 * this type size a ragged left edge reads as broken rather than editorial.
 */
export function Footer() {
  const year = new Date().getFullYear()

  const columns = [
    { heading: 'Company', links: footerNav.company },
    {
      heading: 'Services',
      links: services.slice(0, 5).map((s) => ({ href: `/services/${s.slug}`, label: s.title })),
    },
    {
      heading: 'Practice',
      links: [...footerNav.practices, { href: '/careers', label: 'Careers' }],
    },
    { heading: 'Legal', links: footerNav.legal },
  ]

  return (
    <footer className="no-print relative overflow-hidden border-t border-border">
      <div
        className="pointer-events-none absolute inset-0 dot-grid mask-fade-radial opacity-50"
        aria-hidden="true"
      />

      {/* Marquee band — the site's closing rhythm. Duplicated so the loop is seamless. */}
      <div className="relative overflow-hidden border-y border-border py-5">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex gap-10" aria-hidden={copy === 1}>
              {[
                'Odoo partner',
                'Dynamics 365',
                'SAP Business One',
                'Salesforce',
                'RAG pipelines',
                'Design systems',
                'Accessibility',
              ].map((item) => (
                <span
                  key={item}
                  className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase"
                >
                  {item}
                  <span className="ml-10 text-coral">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="relative container-page pt-16 pb-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,1.5fr)]">
          {columns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="label text-muted-foreground">{column.heading}</h2>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-8 items-center text-sm text-muted-foreground transition-colors hover:text-coral"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Brand + newsletter */}
          <div>
            <Link
              href="/"
              aria-label={`${siteConfig.name} — home`}
              className="inline-block text-xl font-bold tracking-tight"
            >
              {siteConfig.name}
              <span className="text-coral">{siteConfig.logoSuffix}</span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {siteConfig.tagline}
            </p>

            <h2 className="mt-8 label text-muted-foreground">Newsletter</h2>
            <NewsletterForm className="mt-4" />
          </div>
        </div>

        {/* Status strip: office, reach and socials as pills. */}
        <div className="mt-14 flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-border px-4 py-2.5 font-mono text-[0.6rem] tracking-[0.2em] uppercase">
            <span className="relative flex size-2 items-center justify-center" aria-hidden="true">
              <span className="absolute size-2 animate-pulse-ring rounded-full bg-coral" />
              <span className="size-1.5 rounded-full bg-coral" />
            </span>
            {siteConfig.location} · HQ
          </span>

          {Object.entries(siteConfig.socials).map(([network, href]) => (
            <a
              key={network}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-border px-4 py-2.5 font-mono text-[0.6rem] tracking-[0.2em] uppercase transition-colors hover:border-coral hover:text-coral"
            >
              {network}
            </a>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <p className="label text-[0.55rem] text-muted-foreground">
            © {year} {siteConfig.nameWithSuffix}. {footerContent.builtWith}
          </p>

          <p className="label text-[0.55rem] text-muted-foreground">{footerContent.hint}</p>
        </div>
      </div>
    </footer>
  )
}

/** Re-exported so pages can compose a footer-level note if needed. */
export type FooterSlot = ReactNode
