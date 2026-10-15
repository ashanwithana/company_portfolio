import Link from 'next/link'

import { OfficeTime } from '@/components/sections/office-time'
import { services } from '@/content/services'
import { siteConfig } from '@/content/site'

/**
 * Site footer, mirroring the reference's structure: link columns, a status
 * strip with the office clock and the studio's numbers, then the legal bar.
 */
export function Footer() {
  const year = new Date().getFullYear()

  const columns = [
    {
      heading: 'Services',
      links: services.slice(0, 5).map((s) => ({ href: `/services/${s.slug}`, label: s.title })),
    },
    {
      heading: 'Company',
      links: [
        { href: '/services', label: 'Services' },
        { href: '/work', label: 'Case studies' },
        { href: '/insights', label: 'Blog' },
        { href: '/#discipline', label: 'Discipline' },
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' },
      ],
    },
    {
      heading: 'Explore',
      links: [
        { href: '/about', label: 'About' },
        { href: '/careers', label: 'Careers' },
        { href: '/enterprise', label: 'Enterprise systems' },
        { href: '/sitemap.xml', label: 'Sitemap' },
      ],
    },
  ]

  return (
    <footer className="no-print relative overflow-hidden border-t border-border">
      <div
        className="pointer-events-none absolute inset-0 dot-grid mask-fade-radial opacity-50"
        aria-hidden="true"
      />

      {/* Write-to-us card, mirroring the reference's footer email panel. */}
      <div className="relative container-page pt-12 sm:pt-14">
        <a
          href={`mailto:${siteConfig.email}`}
          className="group flex flex-col gap-1 rounded-[12px] border border-border bg-foreground/[0.015] px-6 py-5 transition-colors hover:border-border-strong"
        >
          <span className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
            email
          </span>
          <span className="text-base text-foreground">
            email us · {siteConfig.email}
            <span
              aria-hidden="true"
              className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand"
            >
              →
            </span>
          </span>
        </a>
      </div>

      <div className="relative container-page grid gap-12 py-12 sm:grid-cols-3 sm:py-16">
        {columns.map((column) => (
          <nav key={column.heading} aria-label={column.heading}>
            <h2 className="font-mono text-[11px] leading-[1.4] font-normal tracking-[0.12em] text-muted-foreground">
              {column.heading}
            </h2>
            <ul className="mt-5 space-y-3">
              {column.links.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-8 items-center text-sm text-muted-foreground transition-colors hover:text-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="relative container-page flex flex-col gap-10 pb-12">
        <div>
          <Link
            href="/"
            aria-label={`${siteConfig.name} — home`}
            className="inline-block text-xl font-bold tracking-tight"
          >
            {siteConfig.name}
            <span className="text-brand">{siteConfig.logoSuffix}</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {siteConfig.tagline}
          </p>
        </div>

        {/* Status strip */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-border px-4 py-2.5 font-mono text-[11px] tracking-[0.08em] uppercase">
            <span className="relative flex size-2 items-center justify-center" aria-hidden="true">
              <span className="absolute size-2 animate-pulse-ring rounded-full bg-brand" />
              <span className="size-1.5 rounded-full bg-brand" />
            </span>
            Colombo · Sri Lanka · HQ · <OfficeTime timeZone="Asia/Colombo" />
          </span>

          <span className="inline-flex items-center rounded-full border border-border px-4 py-2.5 font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase">
            6+ years · 25+ projects · 7 people
          </span>

          {Object.entries(siteConfig.socials).map(([network, href]) => (
            <a
              key={network}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-border px-4 py-2.5 font-mono text-[11px] tracking-[0.08em] uppercase transition-colors hover:border-brand hover:text-brand"
            >
              {network}
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase">
            © {year} {siteConfig.nameWithSuffix} · Built with care.
          </p>

          <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              { href: '/privacy', label: 'Privacy policy' },
              { href: '/accessibility', label: 'Accessibility' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase transition-colors hover:text-brand"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
