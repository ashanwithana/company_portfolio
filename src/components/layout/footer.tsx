import Link from 'next/link'

import { OfficeTime } from '@/components/sections/office-time'
import { SilkBackground } from '@/components/ui/silk-background'
import { services } from '@/content/services'
import { siteConfig } from '@/content/site'

/**
 * Site footer: a full-width invitation to write, link columns, a status row
 * with the office clock and the studio's numbers, then the legal bar. Hairline
 * rules separate the bands; nothing is boxed or filled.
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
        { href: '/faq', label: 'FAQ' },
      ],
    },
    {
      heading: 'Explore',
      links: [
        { href: '/about', label: 'About' },
        { href: '/careers', label: 'Careers' },
        { href: '/start-a-project', label: 'Start a project' },
        { href: '/sitemap.xml', label: 'Sitemap' },
      ],
    },
  ]

  return (
    <footer className="no-print relative overflow-hidden border-t border-border">
      {/* The hero's silk field, dissolving upward into the page. Dimmed so
          the link columns stay legible over it. */}
      <SilkBackground fadeEdge="top" className="opacity-70" />

      {/* Invitation: the email address set as display type. */}
      <div className="relative container-page pt-20 pb-14 sm:pt-28 sm:pb-20">
        <p className="label text-muted-foreground">
          <span className="text-foreground">04</span> / Contact
        </p>
        <a href={`mailto:${siteConfig.email}`} className="group mt-8 block">
          <span className="block display-md text-muted-foreground">Write to us</span>
          <span className="mt-3 block text-[clamp(1.5rem,5.2vw,4.5rem)] leading-[1] font-extralight tracking-[-0.035em] break-words">
            {siteConfig.email}
            <span
              aria-hidden="true"
              className="ml-3 inline-block transition-transform duration-500 group-hover:translate-x-2"
            >
              →
            </span>
          </span>
        </a>
      </div>

      <div className="relative container-page grid gap-12 border-t border-border py-12 sm:grid-cols-3 sm:py-16">
        {columns.map((column) => (
          <nav key={column.heading} aria-label={column.heading}>
            <h2 className="label font-sans text-muted-foreground">{column.heading}</h2>
            <ul className="mt-5 space-y-3">
              {column.links.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-8 items-center text-sm font-light text-muted-foreground transition-colors hover:text-foreground"
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
            className="inline-block text-xl font-light tracking-tight"
          >
            {siteConfig.name}
            <span className="text-amber">{siteConfig.logoSuffix}</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {siteConfig.tagline}
          </p>
        </div>

        {/* Status strip */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border pt-8">
          <span className="inline-flex items-center gap-2.5 label">
            <span className="relative flex size-2 items-center justify-center" aria-hidden="true">
              <span className="absolute size-2 animate-pulse-ring rounded-full bg-amber" />
              <span className="size-1.5 rounded-full bg-amber" />
            </span>
            Colombo · Sri Lanka · HQ · <OfficeTime timeZone="Asia/Colombo" />
          </span>

          <span className="inline-flex items-center label text-muted-foreground">
            6+ years · 25+ projects · 7 people
          </span>

          {Object.entries(siteConfig.socials).map(([network, href]) => (
            <a
              key={network}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center label text-muted-foreground transition-colors hover:text-foreground"
            >
              {network}
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <p className="label text-muted-foreground">
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
                className="label text-muted-foreground transition-colors hover:text-foreground"
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
