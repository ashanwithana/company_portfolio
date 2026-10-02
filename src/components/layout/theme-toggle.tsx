'use client'

import { useTheme } from '@/components/providers/theme-provider'
import { cn } from '@/lib/utils'

/**
 * Two-tone theme toggle.
 *
 * `ThemeProvider` starts at `'dark'` on both server and client, so the markup
 * here is deterministic and hydration-safe. The persisted theme is applied by
 * the blocking script in `<head>` before paint, so the swap is never visible.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const label = `Switch to ${isDark ? 'light' : 'dark'} theme`

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      className={cn(
        'inline-flex size-10 items-center justify-center rounded-full border border-border bg-card/50 backdrop-blur-sm transition-colors hover:border-foreground/25 hover:bg-foreground/[0.04]',
        className,
      )}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}

function SunIcon() {
  return (
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
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  )
}
