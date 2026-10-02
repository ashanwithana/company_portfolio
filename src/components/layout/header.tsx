'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'

import { CommandPalette } from '@/components/layout/command-palette'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { primaryNav, siteConfig } from '@/content/site'
import { cn } from '@/lib/utils'

/**
 * Sticky site header: brand, primary nav, ⌘K trigger, theme toggle, mobile menu.
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

  // Close the sheet whenever the route changes.
  React.useEffect(() => setMenuOpen(false), [pathname])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className={cn('no-print fixed inset-x-0 top-0 z-50', scrolled && 'py-2')}>
      <div className="container-page">
        <div
          className={cn(
            'flex items-center justify-between gap-4 rounded-full border border-transparent px-2 py-3 transition-all duration-500',
            scrolled &&
              'border-border bg-background/70 shadow-[0_10px_40px_-24px_rgba(0,0,0,0.6)] backdrop-blur-xl',
          )}
        >
          <Link
            href="/"
            aria-label={`${siteConfig.name} — home`}
            className="rounded-lg px-2 font-display text-lg font-semibold tracking-tight"
          >
            {siteConfig.name}
            <span className="text-coral">{siteConfig.logoSuffix}</span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1 rounded-full border border-border bg-card/40 px-2 py-1.5 backdrop-blur-sm">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={cn(
                      // min-h keeps the hit area at 32px+ despite small type.
                      'flex min-h-8 items-center rounded-full px-4 font-mono text-[0.7rem] tracking-[0.2em] uppercase transition-colors',
                      isActive(item.href)
                        ? 'bg-foreground/[0.06] text-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <CommandPalette />
            <ThemeToggle />

            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card/50 backdrop-blur-sm transition-colors hover:border-foreground/25 lg:hidden"
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
      <div id="mobile-nav" ref={menuPanelRef} hidden={!menuOpen} className="container-page mt-2 lg:hidden">
        <nav
          aria-label="Mobile"
          className="overflow-hidden rounded-2xl border border-border bg-background/95 p-2 shadow-elegant backdrop-blur-xl"
        >
          <ul className="flex flex-col">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'flex min-h-11 items-center justify-between rounded-xl px-4 font-mono text-xs tracking-[0.2em] uppercase transition-colors',
                    isActive(item.href)
                      ? 'bg-foreground/[0.06] text-foreground'
                      : 'text-muted-foreground hover:bg-foreground/[0.03] hover:text-foreground',
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

import * as React from 'react'
