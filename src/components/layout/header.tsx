'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'

import { CommandPalette } from '@/components/layout/command-palette'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { siteConfig } from '@/content/site'
import { services } from '@/content/services'
import { cn } from '@/lib/utils'

type NavChild = { href: string; label: string; hint?: string }
type NavEntry = { href: string; label: string; children?: readonly NavChild[] }

/**
 * Desktop navigation with dropdowns, mirroring the reference's structure:
 * a services index, a plain discipline anchor, a work index and a "more" bucket.
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
  { href: '/discipline', label: 'Discipline' },
  // No dropdown here by design: the work index lists every case study, and a
  // dropdown would duplicate it while growing without bound as studies are
  // added. One link, one page.
  { href: '/work', label: 'Work' },
  {
    href: '/about',
    label: 'More',
    children: [
      { href: '/about', label: 'About', hint: 'The studio, the team, the beliefs.' },
      { href: '/insights', label: 'Blog', hint: 'Notes from the work.' },
      { href: '/careers', label: 'Careers', hint: 'Open roles at the studio.' },
    ],
  },
  { href: '/faq', label: 'FAQ' },
]

/**
 * Floating text navigation.
 *
 * Over the hero the bar has no fill at all: just the wordmark, the links and
 * the call to action on the ground. Once the page scrolls it picks up a blurred
 * ground and a hairline underneath. The scroll state only changes those paint
 * properties, never what is rendered, so there is no layout shift.
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
    <header
      className={cn(
        'no-print fixed inset-x-0 top-0 z-50 border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]',
        scrolled && 'border-border bg-background/70 backdrop-blur-[24px]',
      )}
    >
      <div className="mx-auto w-full max-w-[1600px] px-4 md:px-8">
        <div
          className={cn(
            'relative flex items-center justify-between gap-4 transition-[height] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]',
            scrolled ? 'h-16' : 'h-20 md:h-24',
          )}
        >
          <Link
            href="/"
            aria-label={`${siteConfig.name} — home`}
            className="flex shrink-0 items-center gap-3"
          >
            <span className="text-base font-light tracking-tight">
              {siteConfig.name}
              <span className="text-amber">{siteConfig.logoSuffix}</span>
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden xl:absolute xl:left-1/2 xl:block xl:-translate-x-1/2"
          >
            <ul className="flex items-center gap-4 px-2 lg:gap-6">
              {navEntries.map((entry) => (
                <li key={entry.label} className="group relative">
                  <Link
                    href={entry.href}
                    aria-current={isActive(entry.href) ? 'page' : undefined}
                    aria-haspopup={entry.children ? 'true' : undefined}
                    className={cn(
                      // min-h keeps the hit area at 32px+ despite small type.
                      'relative flex min-h-9 items-center gap-1 text-sm font-normal tracking-tight transition-colors duration-300',
                      isActive(entry.href)
                        ? 'text-foreground'
                        : 'text-foreground/70 group-hover:text-foreground hover:text-foreground',
                    )}
                  >
                    {entry.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute right-0 -bottom-2 left-0 h-px origin-left bg-foreground transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-x-100',
                        isActive(entry.href) ? 'scale-x-100' : 'scale-x-0',
                      )}
                    />
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
                      <ul className="w-64 overflow-hidden rounded-xl border border-border bg-popover p-2 shadow-elegant">
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
              href="/start-a-project"
              className="hidden h-10 items-center bg-foreground px-6 text-[13px] font-medium tracking-tight text-background transition-opacity duration-300 hover:opacity-85 md:inline-flex"
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
        className="mx-auto w-full max-w-[1600px] px-4 pt-2 md:px-8 xl:hidden"
      >
        <nav
          aria-label="Mobile"
          className="overflow-hidden rounded-xl border border-border bg-popover p-2 shadow-elegant"
        >
          <ul className="flex flex-col">
            {navEntries.map((entry) => (
              <li key={entry.label}>
                <Link
                  href={entry.href}
                  aria-current={isActive(entry.href) ? 'page' : undefined}
                  className={cn(
                    'flex min-h-12 items-center justify-between rounded-lg px-4 text-xs tracking-[0.18em] uppercase transition-colors',
                    isActive(entry.href)
                      ? 'bg-accent text-foreground'
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
