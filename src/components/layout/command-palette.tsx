'use client'

import { Command } from 'cmdk'
import { usePathname, useRouter } from 'next/navigation'
import * as React from 'react'

import { useTheme } from '@/components/providers/theme-provider'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { aiPrinciples } from '@/content/ai'
import { publishedCaseStudies } from '@/content/case-studies'
import { platforms } from '@/content/enterprise'
import { getAllPosts } from '@/content/posts-index'
import { services } from '@/content/services'
import { allRoutes, siteConfig } from '@/content/site'
import { roles } from '@/content/roles'

/** No external store to watch — the platform never changes in a session. */
const subscribeToNothing = () => () => {}

function capitalise(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

/**
 * ⌘K / Ctrl+K command palette.
 *
 * Wraps `cmdk`, which handles focus trapping, roving focus and
 * `aria-activedescendant`. We layer on the global hotkey, router-aware
 * navigation, and "copy email" with a transient confirmation.
 *
 * The command list is derived from the same data the pages use, so it can never
 * offer a route that does not exist. It ships in the client bundle because it is
 * interactive by nature — the pages themselves remain server components.
 */
export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { copied, copy } = useCopyToClipboard(1800)

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  /**
   * The platform never changes within a session, so this needs no store
   * subscription — and the server snapshot keeps the first render identical,
   * avoiding a hydration mismatch from reading `navigator.userAgent`.
   */
  const isMac = React.useSyncExternalStore(
    subscribeToNothing,
    () => /mac|iphone|ipad/i.test(navigator.userAgent),
    () => false,
  )

  const close = React.useCallback(() => setOpen(false), [])

  const go = React.useCallback(
    (href: string) => {
      close()
      // Let the dialog finish closing before navigating, otherwise the exit
      // transition and the route change fight each other.
      requestAnimationFrame(() => router.push(href))
    },
    [close, router],
  )

  // Close the palette after a navigation completes. Done during render via the
  // documented "adjust state when an input changes" pattern rather than in an
  // effect, which avoids a cascading render on every route change.
  const [lastPathname, setLastPathname] = React.useState(pathname)
  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    if (open) setOpen(false)
  }

  const posts = getAllPosts()

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
        aria-keyshortcuts="Meta+K Control+K"
        className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card/50 px-3 font-mono text-xs text-muted-foreground backdrop-blur-sm transition-colors hover:border-foreground/25 hover:text-foreground"
      >
        <CommandGlyph />
        <kbd className="hidden sm:inline">{isMac ? '⌘' : 'Ctrl'} K</kbd>
      </button>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Command palette"
        className="w-[min(36rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-popover/95 shadow-elegant backdrop-blur-xl"
        overlayClassName="fixed inset-0 z-[60] bg-background/70 backdrop-blur-sm"
        contentClassName="outline-none"
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <SearchGlyph />
          <Command.Input
            autoFocus
            placeholder="Type a command or search…"
            className="h-14 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={close}
            aria-label="Close command palette"
            className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <CloseGlyph />
          </button>
        </div>

        <Command.List className="max-h-[24rem] overflow-y-auto overscroll-contain p-2">
          <Command.Empty className="px-3 py-8 text-center text-sm text-muted-foreground">
            No results found.
          </Command.Empty>

          <CommandGroup heading="Navigate">
            {allRoutes.map((item) => (
              <PaletteItem
                key={item.href}
                label={item.label}
                shortcut={item.shortcut}
                onSelect={() => go(item.href)}
              />
            ))}
          </CommandGroup>

          <CommandGroup heading="Services">
            {services.map((service) => (
              <PaletteItem
                key={service.slug}
                label={service.title}
                keywords={service.summary}
                onSelect={() => go(service.canonicalHref ?? `/services/${service.slug}`)}
              />
            ))}
          </CommandGroup>

          <CommandGroup heading="Enterprise">
            {platforms.map((platform) => (
              <PaletteItem
                key={platform.name}
                label={platform.name}
                keywords={platform.focus.join(' ')}
                onSelect={() => go('/enterprise')}
              />
            ))}
          </CommandGroup>

          <CommandGroup heading="AI">
            {aiPrinciples.map((principle) => (
              <PaletteItem
                key={principle.title}
                label={principle.title}
                keywords="AI engineering practice commitment"
                onSelect={() => go('/ai')}
              />
            ))}
          </CommandGroup>

          <CommandGroup heading="Case studies">
            {publishedCaseStudies().map((study) => (
              <PaletteItem
                key={study.slug}
                label={study.title}
                keywords={[study.client, study.summary].join(' ')}
                onSelect={() => go(`/work/${study.slug}`)}
              />
            ))}
          </CommandGroup>

          <CommandGroup heading="Insights">
            {posts.map((post) => (
              <PaletteItem
                key={post.slug}
                label={post.title}
                keywords={post.tags.join(' ')}
                onSelect={() => go(`/insights/${post.slug}`)}
              />
            ))}
          </CommandGroup>

          <CommandGroup heading="Careers">
            {roles.map((role) => (
              <PaletteItem
                key={role.slug}
                label={role.title}
                keywords={`${role.department} ${role.employment}`}
                onSelect={() => go(`/careers/${role.slug}`)}
              />
            ))}
          </CommandGroup>

          <CommandGroup heading="Actions">
            <PaletteItem
              label={copied ? 'Email copied!' : 'Copy email address'}
              shortcut="C E"
              onSelect={() => void copy(siteConfig.email)}
            />
            <PaletteItem
              label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              shortcut="T"
              onSelect={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            />
          </CommandGroup>

          <CommandGroup heading="Socials">
            {Object.entries(siteConfig.socials).map(([network, href]) => (
              <PaletteItem
                key={network}
                label={capitalise(network)}
                onSelect={() => {
                  close()
                  window.open(href, '_blank', 'noopener,noreferrer')
                }}
              />
            ))}
          </CommandGroup>
        </Command.List>
      </Command.Dialog>
    </>
  )
}

function CommandGroup({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <Command.Group
      heading={heading}
      className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[0.65rem] [&_[cmdk-group-heading]]:tracking-[0.2em] [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:uppercase"
    >
      {children}
    </Command.Group>
  )
}

type PaletteItemProps = {
  label: string
  onSelect: () => void
  shortcut?: string
  keywords?: string
}

function PaletteItem({ label, onSelect, shortcut, keywords }: PaletteItemProps) {
  return (
    <Command.Item
      value={label}
      keywords={keywords ? [keywords] : undefined}
      onSelect={onSelect}
      className="flex cursor-pointer items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-sm transition-colors data-[selected=true]:bg-foreground/[0.06] data-[selected=true]:text-foreground"
    >
      <span className="truncate">{label}</span>
      {shortcut ? (
        <kbd className="shrink-0 font-mono text-[0.65rem] tracking-[0.15em] text-muted-foreground">
          {shortcut}
        </kbd>
      ) : null}
    </Command.Item>
  )
}

function CommandGlyph() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M15 6a3 3 0 1 1 6 0a3 3 0 0 1-6 0M9 6a3 3 0 1 1-6 0a3 3 0 0 1 6 0M15 18a3 3 0 1 0 6 0a3 3 0 0 0-6 0M9 18a3 3 0 1 0-6 0a3 3 0 0 0 6 0" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
    </svg>
  )
}

function SearchGlyph() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="shrink-0 text-muted-foreground"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

function CloseGlyph() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}
