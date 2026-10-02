'use client'

import * as React from 'react'

import { THEME_COOKIE, type Theme } from '@/lib/theme'

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365

/**
 * Cross-tab sync channel.
 *
 * The `storage` event is the usual choice, but `document.cookie` writes do not
 * emit it for same-document code paths we care about, so a `BroadcastChannel`
 * gives us a reliable notification without the cookie round-trip.
 */
const channel =
  typeof window !== 'undefined' && 'BroadcastChannel' in window
    ? new BroadcastChannel(THEME_COOKIE)
    : null

function applyThemeToDocument(next: Theme) {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(next)
  root.style.colorScheme = next
}

/**
 * Theme provider.
 *
 * `initialTheme` is resolved on the server from a cookie in the root layout, so
 * the class React renders is already correct in the first byte of HTML. That is
 * what makes the theme flash-free *and* hydration-clean — the usual "blocking
 * script sets the class" trick fights React, which reconciles attributes on
 * `<html>` during hydration and reverts the script's change.
 *
 * This provider therefore only tracks state and broadcasts changes; it never
 * needs to correct the DOM on mount.
 */
export function ThemeProvider({
  initialTheme,
  children,
}: {
  initialTheme: Theme
  children: React.ReactNode
}) {
  const [theme, setThemeState] = React.useState<Theme>(initialTheme)

  React.useEffect(() => {
    if (!channel) return

    const onMessage = (event: MessageEvent<unknown>) => {
      const next = event.data
      if (next !== 'light' && next !== 'dark') return
      applyThemeToDocument(next)
      setThemeState(next)
    }

    channel.addEventListener('message', onMessage)
    return () => channel.removeEventListener('message', onMessage)
  }, [])

  const setTheme = React.useCallback((next: Theme) => {
    applyThemeToDocument(next)
    document.cookie = `${THEME_COOKIE}=${next}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`
    channel?.postMessage(next)
    setThemeState(next)
  }, [])

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  const value = React.useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme() must be called inside <ThemeProvider>')
  }
  return context
}
