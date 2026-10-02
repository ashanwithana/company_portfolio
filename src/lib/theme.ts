/**
 * Shared theme constants.
 *
 * Deliberately in its own module with no `'use client'` directive: the root
 * layout is a Server Component and must be able to read this value at request
 * time. Importing it from a Client Component module would give the server a
 * client-reference proxy instead of the string literal.
 */

/** Cookie that persists the user's theme choice across visits. */
export const THEME_COOKIE = 'portfolio-theme'

export type Theme = 'light' | 'dark'

export const DEFAULT_THEME: Theme = 'dark'

export function parseTheme(value: string | undefined | null): Theme {
  return value === 'light' ? 'light' : 'dark'
}
