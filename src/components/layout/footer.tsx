import Link from 'next/link'
import type { ReactNode } from 'react'

import { NewsletterForm } from '@/components/sections/newsletter-form'
import { services } from '@/content/services'
import { footerContent, footerNav, siteConfig } from '@/content/site'

/** Site footer: brand lockup, sitemap columns, newsletter and legal line. */
export function Footer() {
  const year = new Date().getFullYear()

  const columns = [
    { heading: 'Company', links: footerNav.company },
    {
      heading: 'Services',
      links: services.slice(0, 5).map((s) => ({ href: `/services/${s.slug}`, label: s.title })),
    },
    { heading: 'Legal', links: footerNav.legal },
  ]

  return (
    <footer className="no-print container-page pt-20 pb-10">
      <div className="grid gap-12 border-t border-border pt-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]">
        {/* Brand + newsletter */}
        <div>
          <Link
            href="/"
            aria-label={`${siteConfig.name} — home`}
            className="inline-block font-display text-2xl font-semibold tracking-tight"
          >
            {siteConfig.name}
            <span className="text-coral">{siteConfig.logoSuffix}</span>
          </Link>

          <p className="mt-4 max-w-sm leading-relaxed text-muted-foreground">
            {siteConfig.tagline}
          </p>

          <div className="mt-8">
            <h2 className="font-mono text-[0.6rem] tracking-[0.3em] text-muted-foreground uppercase">
              Newsletter
            </h2>
            <NewsletterForm className="mt-4" />
          </div>
        </div>

        {/* Sitemap */}
        <nav aria-label="Footer" className="grid gap-10 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.heading}>
              <h2 className="font-mono text-[0.6rem] tracking-[0.3em] text-muted-foreground uppercase">
                {column.heading}
              </h2>

              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-8 items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="sm:col-span-3">
            <h2 className="font-mono text-[0.6rem] tracking-[0.3em] text-muted-foreground uppercase">
              Elsewhere
            </h2>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
              {Object.entries(siteConfig.socials).map(([network, href]) => (
                <li key={network}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-8 items-center font-mono text-[0.65rem] tracking-[0.15em] text-muted-foreground uppercase transition-colors hover:text-foreground"
                  >
                    {network}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      <div className="mt-14 flex flex-col gap-4 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
        <p className="font-mono text-[0.65rem] tracking-[0.15em] text-muted-foreground">
          © {year} {siteConfig.nameWithSuffix}. {footerContent.builtWith}
        </p>

        <p className="font-mono text-[0.65rem] tracking-[0.15em] text-muted-foreground uppercase">
          {siteConfig.address.city}, {siteConfig.address.countryName} · {footerContent.hint}
        </p>
      </div>
    </footer>
  )
}

/** Re-exported so pages can compose a footer-level note if needed. */
export type FooterSlot = ReactNode
