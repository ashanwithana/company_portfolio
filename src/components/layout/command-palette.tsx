'use client'

import { Command } from 'cmdk'
import * as React from 'react'

import { useTheme } from '@/components/providers/theme-provider'
import { navSections, siteConfig, socialLinks } from '@/content/site'
import { projects } from '@/content/projects'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { useSmoothScroll } from '@/hooks/use-smooth-scroll'
import { cn } from '@/lib/utils'

const SECTION_IDS = navSections.map((s) => s.id)

/** No external store to watch — the platform never changes within a session. */
const subscribeToNothing = () => () => {}

/**
 * ⌘K / Ctrl+K command palette.
 *
 * Wraps `cmdk`, which already handles focus trapping, roving focus and
 * `aria-activedescendant`. We layer on:
 *  - a global hotkey listener,
 *  - scroll-to-section commands,
 *  - "copy email" with a transient confirmation row,
 *  - external links that open safely in a new tab.
 */
export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const { theme, setTheme } = useTheme()
  const { scrollTo } = useSmoothScroll({ watch: SECTION_IDS })
  const { copied, copy } = useCopyToClipboard(1800)

  // Global hotkey. `navigator.platform` is deprecated, so feature-detect the
  // modifier instead of branching on the OS string.
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

  const runCommand = React.useCallback(
    (action: () => void) => {
      setOpen(false)
      // Let the dialog close before scrolling to avoid fighting the exit transition.
      requestAnimationFrame(action)
    },
    [],
  )

  const jumpTo = (id: string) => () =>
    runCommand(() => {
      scrollTo(`#${id}`)
      window.history.replaceState(null, '', `#${id}`)
    })

  /**
   * Platform-dependent shortcut label.
   *
   * `navigator.userAgent` doesn't exist on the server, so branching on it during
   * render is a hydration mismatch. `useSyncExternalStore` is the clean fix: the
   * server snapshot is a fixed `"Ctrl K"`, the client reads the real platform,
   * and React swaps it in after hydration without a cascading render.
   */
  const isMac = React.useSyncExternalStore(
    subscribeToNothing,
    () => /mac|iphone|ipad/i.test(navigator.userAgent),
    () => false,
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
        aria-keyshortcuts="Meta+K Control+K"
        className={cn(
          'inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card/50 px-3 font-mono text-xs text-muted-foreground backdrop-blur-sm transition-colors hover:border-foreground/25 hover:text-foreground',
        )}
      >
        <CommandGlyph />
        <kbd className="hidden sm:inline">{isMac ? '⌘' : 'Ctrl'} K</kbd>
      </button>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Command palette"
        shouldFilter
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
            onClick={() => setOpen(false)}
            aria-label="Close command palette"
            className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <CloseGlyph />
          </button>
        </div>

        <Command.List className="max-h-[22rem] overflow-y-auto overscroll-contain p-2">
          <Command.Empty className="px-3 py-8 text-center text-sm text-muted-foreground">
            No results found.
          </Command.Empty>

          <Command.Group
            heading="Navigate"
            className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-2 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[0.65rem] [&_[cmdk-group-heading]]:tracking-[0.2em] [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:uppercase"
          >
            <PaletteItem label="Home" shortcut="G H" onSelect={() => jumpTo('top')()} />
            {navSections.map((section) => (
              <PaletteItem
                key={section.id}
                label={section.label}
                shortcut={`G ${section.label[0]}`}
                onSelect={jumpTo(section.id)}
              />
            ))}
          </Command.Group>

          <Command.Group
            heading="Projects"
            className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-2 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[0.65rem] [&_[cmdk-group-heading]]:tracking-[0.2em] [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:uppercase"
          >
            {projects.map((project) => (
              <PaletteItem
                key={project.slug}
                label={project.title}
                keywords={[project.description, ...project.tech].join(' ')}
                onSelect={() =>
                  runCommand(() => {
                    window.open(project.href, '_blank', 'noopener,noreferrer')
                  })
                }
              />
            ))}
          </Command.Group>

          <Command.Group
            heading="Actions"
            className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-2 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[0.65rem] [&_[cmdk-group-heading]]:tracking-[0.2em] [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:uppercase"
          >
            <PaletteItem
              label={copied ? 'Email copied!' : 'Copy email'}
              shortcut="C E"
              onSelect={() => {
                void copy(siteConfig.email)
              }}
            />
            <PaletteItem
              label={`Toggle theme (${theme === 'dark' ? 'light' : 'dark'})`}
              shortcut="T"
              onSelect={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            />
          </Command.Group>

          <Command.Group
            heading="Socials"
            className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-2 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[0.65rem] [&_[cmdk-group-heading]]:tracking-[0.2em] [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:uppercase"
          >
            {socialLinks.map((social) => (
              <PaletteItem
                key={social.href}
                label={social.label}
                keywords={social.handle}
                onSelect={() =>
                  runCommand(() => {
                    window.open(social.href, '_blank', 'noopener,noreferrer')
                  })
                }
              />
            ))}
          </Command.Group>
        </Command.List>
      </Command.Dialog>
    </>
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
