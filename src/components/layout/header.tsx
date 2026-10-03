'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'

import { CommandPalette } from '@/components/layout/command-palette'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { primaryNav, siteConfig } from '@/content/site'
import { cn } from '@/lib/utils'

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
      <div className="px-4 pt-3">
        <div
          className={cn(
            // Full-width floating island: 32px inset, 32px radius, near-black at
            // 70% over a 24px blur so the page reads through it.
            'flex h-16 items-center justify-between gap-4 rounded-full border border-border bg-[#080808]/70 px-5 backdrop-blur-[24px] transition-shadow duration-500',
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
            <ul className="flex items-center gap-1">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={cn(
                      // min-h keeps the hit area at 32px+ despite small type.
                      'flex min-h-9 items-center rounded-full px-3.5 label transition-colors',
                      isActive(item.href)
                        ? 'text-coral'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <CommandPalette />
            <ThemeToggle />

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
      <div id="mobile-nav" ref={menuPanelRef} hidden={!menuOpen} className="px-4 pt-2 xl:hidden">
        <nav
          aria-label="Mobile"
          className="overflow-hidden rounded-3xl border border-border bg-popover p-2 shadow-elegant"
        >
          <ul className="flex flex-col">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'flex min-h-12 items-center justify-between rounded-2xl px-4 font-mono text-xs tracking-[0.18em] uppercase transition-colors',
                    isActive(item.href)
                      ? 'bg-accent text-coral'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                  )}
                >
                  {item.label}
                  <span aria-hidden="true" className="text-muted-foreground/60">
                    ↗
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
