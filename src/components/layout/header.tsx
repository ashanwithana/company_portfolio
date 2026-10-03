'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'

import { CommandPalette } from '@/components/layout/command-palette'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { siteConfig } from '@/content/site'
import { services } from '@/content/services'
import { publishedCaseStudies } from '@/content/case-studies'
import { cn } from '@/lib/utils'

type NavChild = { href: string; label: string; hint?: string }
type NavEntry = { href: string; label: string; children?: readonly NavChild[] }

/**
 * Desktop navigation with dropdowns, mirroring the reference's structure:
 * a services index, a plain method anchor, a work index and a "more" bucket.
 * The lists are derived from the same content modules as the pages, so a
 * dropdown can never offer a route that does not exist.
 */
const navEntries: readonly NavEntry[] = [
  {
    href: '/services',
    label: 'Services',
    children: [
      ...services.map((service) => ({
        href: service.canonicalHref ?? `/services/${service.slug}`,
        label: service.title,
        hint: service.summary.slice(0, 72),
      })),
    ],
  },
  { href: '/method', label: 'Method' },
  {
    href: '/work',
    label: 'Work',
    children: [
      { href: '/work', label: 'All case studies', hint: 'Every engagement, with the numbers.' },
      ...publishedCaseStudies()
        .filter((study) => study.featured)
        .slice(0, 3)
        .map((study) => ({
          href: `/work/${study.slug}`,
          label: study.title,
          hint: `${study.client} · ${study.year}`,
        })),
    ],
  },
  {
    href: '/about',
    label: 'More',
    children: [
      { href: '/about', label: 'About', hint: 'The studio, the team, the beliefs.' },
      { href: '/insights', label: 'Blog', hint: 'Notes from the work.' },
      { href: '/careers', label: 'Careers', hint: 'Open roles at the studio.' },
      { href: '/contact', label: 'Contact', hint: 'Start a project.' },
    ],
  },
  { href: '/contact', label: 'Contact' },
]

/**
 * Floating pill navigation.
 *
 * The bar is a single rounded-full island that floats over the page rather than
 * sitting in a bordered header strip. The scroll state only tightens its padding
 * and shadow — it never changes what is rendered, so there is no layout shift as
 * the page moves underneath it.
 *
 * Active state comes from `usePathname` rather than a scroll observer, so the
 * highlight is correct the moment a route changes — and correct without
 * JavaScript too, since every item is a real link.
 */
export function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = React.useState(false)
  const [menuOpen, setMenuOpen] = React.useState(false)
  const menuPanelRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile sheet on Escape and on outside clicks.
  React.useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (!menuPanelRef.current?.contains(target)) setMenuOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [menuOpen])

  // Lock body scroll while the sheet is open.
  React.useEffect(() => {
    if (!menuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [menuOpen])

  // Close the sheet whenever the route changes. Derived during render using the
  // documented "adjust state when an input changes" pattern, which avoids the
  // extra effect pass on every navigation.
  const [lastPathname, setLastPathname] = React.useState(pathname)
  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    if (menuOpen) setMenuOpen(false)
  }

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <header className="no-print fixed inset-x-0 top-0 z-50">
      {/*
        Compact centred island: capped well inside the page container so it
        reads as a floating control rather than a second header bar.
      */}
      <div className="mx-auto w-full max-w-[64rem] px-4 pt-3 sm:px-6">
        <div
          className={cn(
            // Full-width floating island: 32px inset, 32px radius, near-black at
            // 70% over a 24px blur so the page reads through it.
            // The pill floats over both grounds, so its fill comes from the token rather
            // than a fixed near-black: a hardcoded dark fill left the logo
            // unreadable in the light theme.
            'flex h-16 items-center justify-between gap-4 rounded-full border border-border bg-background/80 px-5 backdrop-blur-[24px] transition-shadow duration-500',
            scrolled && 'border-border-strong shadow-[0_18px_50px_-28px_rgba(0,0,0,0.95)]',
          )}
        >
          <Link
            href="/"
            aria-label={`${siteConfig.name} — home`}
            className="flex shrink-0 items-center gap-3 rounded-full"
          >
            <span className="text-base font-bold tracking-tight">
              {siteConfig.name}
              <span className="text-coral">{siteConfig.logoSuffix}</span>
            </span>
            {/* Route dots — decorative, mirroring the pill's shape. */}
            <span className="hidden items-center gap-1.5 sm:flex" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={cn(
                    'size-1.5 rounded-full transition-colors duration-500',
                    i === 3 ? 'bg-coral' : 'bg-foreground/40',
                  )}
                />
              ))}
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden xl:block">
            <ul className="flex items-center gap-2">
              {navEntries.map((entry) => (
                <li key={entry.label} className="group relative">
                  <Link
                    href={entry.href}
                    aria-current={isActive(entry.href) ? 'page' : undefined}
                    aria-haspopup={entry.children ? 'true' : undefined}
                    className={cn(
                      // min-h keeps the hit area at 32px+ despite small type.
                      'flex min-h-9 items-center gap-1.5 rounded-full px-3 label transition-colors',
                      isActive(entry.href)
                        ? 'text-coral'
                        : 'text-muted-foreground group-hover:text-foreground hover:text-foreground',
                    )}
                  >
                    {entry.label}
                    {entry.children ? (
                      <span
                        aria-hidden="true"
                        className="text-[8px] transition-transform duration-300 group-focus-within:rotate-180 group-hover:rotate-180"
                      >
                        ▾
                      </span>
                    ) : null}
                  </Link>

                  {entry.children ? (
                    <div className="invisible absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 transition-[opacity,visibility] duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                      <ul className="w-64 overflow-hidden rounded-[22px] border border-border bg-popover p-2 shadow-elegant">
                        {entry.children.map((child) => (
                          <li key={child.href + child.label}>
                            <Link
                              href={child.href}
                              className="flex min-h-11 items-center justify-between gap-3 rounded-2xl px-4 py-2.5 transition-colors hover:bg-accent"
                            >
                              <span>
                                <span className="block text-[13px] text-foreground">
                                  {child.label}
                                </span>
                                {child.hint ? (
                                  <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                                    {child.hint}
                                  </span>
                                ) : null}
                              </span>
                              <span
                                aria-hidden="true"
                                className="shrink-0 text-[11px] text-muted-foreground"
                              >
                                →
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <CommandPalette />
            <ThemeToggle />

            <Link
              href="/contact"
              className="hidden h-9 items-center rounded-full border border-border-strong px-4 font-mono text-[12px] font-medium tracking-[-0.01em] transition-colors hover:border-coral hover:text-coral sm:inline-flex"
            >
              Start a project
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              className="inline-flex size-10 items-center justify-center rounded-full border border-border transition-colors hover:border-border-strong hover:bg-accent xl:hidden"
            >
              <span className="sr-only">Toggle navigation</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                {menuOpen ? (
                  <path d="M18 6 6 18M6 6l12 12" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        id="mobile-nav"
        ref={menuPanelRef}
        hidden={!menuOpen}
        className="mx-auto w-full max-w-[64rem] px-4 pt-2 sm:px-6 xl:hidden"
      >
        <nav
          aria-label="Mobile"
          className="overflow-hidden rounded-3xl border border-border bg-popover p-2 shadow-elegant"
        >
          <ul className="flex flex-col">
            {navEntries.map((entry) => (
              <li key={entry.label}>
                <Link
                  href={entry.href}
                  aria-current={isActive(entry.href) ? 'page' : undefined}
                  className={cn(
                    'flex min-h-12 items-center justify-between rounded-2xl px-4 font-mono text-xs tracking-[0.18em] uppercase transition-colors',
                    isActive(entry.href)
                      ? 'bg-accent text-coral'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                  )}
                >
                  {entry.label}
                  <span aria-hidden="true" className="text-muted-foreground/60">
                    ↗
                  </span>
                </Link>

                {entry.children ? (
                  <ul className="mb-1 ml-4 flex flex-col border-l border-border pl-2">
                    {entry.children.slice(0, 5).map((child) => (
                      <li key={child.href + child.label}>
                        <Link
                          href={child.href}
                          className="flex min-h-10 items-center rounded-xl px-3 text-[13px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
