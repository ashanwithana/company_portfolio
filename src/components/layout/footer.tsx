import Link from 'next/link'

import { BackToTop } from '@/components/layout/back-to-top'
import { OfficeTime } from '@/components/sections/office-time'
import { TalkToUs } from '@/components/sections/talk-to-us'
import { SilkBackground } from '@/components/ui/silk-background'
import { services } from '@/content/services'
import { siteConfig } from '@/content/site'
import { cn } from '@/lib/utils'

const EASE = 'ease-[cubic-bezier(0.19,1,0.22,1)]'

function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}

/**
 * Footer link with a vertical text roll: the label slides up and out while an
 * identical bright copy slides up into its place. The second copy is
 * aria-hidden so the name is announced once.
 */
function FooterLink({
  href,
  children,
  external = false,
}: {
  href: string
  children: string
  external?: boolean
}) {
  const className =
    'group relative inline-flex items-center gap-2 overflow-hidden text-xs font-medium tracking-[0.15em] uppercase'
  const label = (
    <>
      <span className="relative block leading-none">
        <span
          className={cn(
            'block text-foreground/60 transition-transform duration-500 group-hover:-translate-y-full',
            EASE,
          )}
        >
          {children}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            'absolute top-0 left-0 block translate-y-full text-foreground transition-transform duration-500 group-hover:translate-y-0',
            EASE,
          )}
        >
          {children}
        </span>
      </span>
      <ArrowUpRight className="text-[11px] text-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </>
  )

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {label}
    </a>
  ) : (
    <Link href={href} className={className}>
      {label}
    </Link>
  )
}

function ColumnLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[10px] tracking-[0.24em] text-muted-foreground uppercase">
      {children}
    </span>
  )
}

/**
 * Site footer, in two parts:
 *
 *  1. the "Talk to us" cards (email, and start a project),
 *  2. a bar of four hairline-divided columns (services, company, the studio,
 *     the record).
 *
 * It fills at least a screen, with the cards taking the slack, and sits on the
 * hero's silk field (dissolving upward into the page). The bar is a
 * translucent ground over the silk so the links stay legible.
 */
export function Footer() {
  const year = new Date().getFullYear()

  const serviceLinks = services.map((service) => ({
    href: service.canonicalHref ?? `/services/${service.slug}`,
    label: service.title,
  }))

  const companyLinks = [
    { href: '/work', label: 'Work' },
    { href: '/discipline', label: 'Discipline' },
    { href: '/insights', label: 'Blog' },
    { href: '/about', label: 'About' },
    { href: '/careers', label: 'Careers' },
    { href: '/faq', label: 'FAQ' },
  ]

  // The tagline's closing sentence takes the heavier weight, as DAQ sets
  // "Intelligence Architects." with its second word emphasised. A one-sentence
  // tagline falls back to emphasising its last two words.
  const sentences = siteConfig.tagline.split(/(?<=[.!?])\s+/)
  const taglineWords = siteConfig.tagline.split(' ')
  const taglineLead =
    sentences.length > 1 ? sentences.slice(0, -1).join(' ') : taglineWords.slice(0, -2).join(' ')
  const taglineTail =
    sentences.length > 1 ? (sentences.at(-1) ?? '') : taglineWords.slice(-2).join(' ')

  return (
    <footer className="no-print relative isolate flex min-h-svh flex-col overflow-hidden border-t border-border selection:bg-foreground selection:text-background">
      {/* The hero's silk field, dissolving upward into the page. */}
      <SilkBackground fadeEdge="top" className="-z-10 opacity-70" />

      {/* 1. Talk to us: the email and start-a-project cards. */}
      <section
        aria-label="Talk to us"
        className="relative flex w-full flex-1 flex-col justify-center py-10 md:py-12"
      >
        <TalkToUs />
      </section>

      {/* 2. Bar */}
      <div className="relative z-10 bg-background/55">
        <div className="relative mx-auto w-full max-w-[1600px] px-4 md:px-8">
          <span
            aria-hidden="true"
            className="absolute top-0 right-4 left-4 h-px bg-border md:right-8 md:left-8"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12">
            <nav
              aria-label="Services"
              className="flex flex-col gap-4 border-b border-border py-5 sm:border-r sm:pr-6 md:gap-4 md:py-6 lg:col-span-3 lg:border-b-0 lg:py-8 lg:pr-8"
            >
              <ColumnLabel>01 / Services</ColumnLabel>
              <ul className="flex flex-col gap-2.5 md:gap-3.5">
                {serviceLinks.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>

            <nav
              aria-label="Company"
              className="flex flex-col gap-4 border-b border-border py-5 sm:border-b-0 sm:pl-6 md:gap-4 md:py-6 lg:col-span-2 lg:border-r lg:px-8 lg:py-8"
            >
              <ColumnLabel>02 / Company</ColumnLabel>
              <ul className="flex flex-col gap-2.5 md:gap-3.5">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex flex-col gap-4 border-b border-border py-5 sm:col-span-2 sm:border-t sm:border-b-0 md:gap-4 md:py-6 lg:col-span-4 lg:border-t-0 lg:border-r lg:px-8 lg:py-8">
              <ColumnLabel>03 / {siteConfig.name}</ColumnLabel>

              <Link
                href="/"
                aria-label={`${siteConfig.name} — home`}
                className="inline-block self-start text-xl font-light tracking-tight"
              >
                {siteConfig.name}
                <span className="text-amber">{siteConfig.logoSuffix}</span>
              </Link>

              <h3 className="text-xl leading-snug font-light tracking-tight text-foreground/85 md:text-2xl">
                {taglineLead} <span className="font-medium text-foreground/70">{taglineTail}</span>
              </h3>

              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground [@media(max-height:820px)]:hidden">
                {siteConfig.description}
              </p>

              <p className="flex items-center gap-2.5 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                <span
                  className="relative flex size-2 items-center justify-center"
                  aria-hidden="true"
                >
                  <span className="absolute size-2 animate-pulse-ring rounded-full bg-amber" />
                  <span className="size-1.5 rounded-full bg-amber" />
                </span>
                Colombo · Sri Lanka · <OfficeTime timeZone="Asia/Colombo" />
              </p>

              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {Object.entries(siteConfig.socials).map(([network, href]) => (
                  <li key={network}>
                    <FooterLink href={href} external>
                      {network}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4 py-5 sm:col-span-2 md:gap-4 md:py-6 lg:col-span-3 lg:py-8 lg:pl-8">
              <ColumnLabel>04 / Record</ColumnLabel>
              <ul className="flex flex-col gap-3.5 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                <li>
                  © {year} {siteConfig.nameWithSuffix}
                </li>
                <li>
                  <Link href="/privacy" className="transition-colors hover:text-foreground">
                    Privacy policy
                  </Link>
                </li>
                <li>
                  <Link href="/accessibility" className="transition-colors hover:text-foreground">
                    Accessibility
                  </Link>
                </li>
                <li>
                  <Link href="/sitemap.xml" className="transition-colors hover:text-foreground">
                    Sitemap
                  </Link>
                </li>
                <li>
                  <BackToTop />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
