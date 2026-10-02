'use client'

import * as React from 'react'

/**
 * SSR-safe media query hook.
 *
 * Built on `useSyncExternalStore` rather than `useState` + `useEffect`: a media
 * query list *is* an external store, and this lets React read a consistent
 * snapshot during hydration instead of re-rendering on mount. The server
 * snapshot is always `false`, so markup stays deterministic on both the server
 * and the first client paint.
 */
export function useMediaQuery(query: string) {
  const subscribe = React.useCallback(
    (onStoreChange: () => void) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onStoreChange)
      return () => list.removeEventListener('change', onStoreChange)
    },
    [query],
  )

  const getSnapshot = React.useCallback(() => window.matchMedia(query).matches, [query])

  return React.useSyncExternalStore(subscribe, getSnapshot, () => false)
}

/** True when the user has asked the OS to reduce motion. */
export function useReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

/** True on devices with a precise pointer (mouse / trackpad). */
export function useHasFinePointer() {
  return useMediaQuery('(pointer: fine)')
}

// A module-level store so every consumer shares one subscription.
const emptySubscribe = () => () => {}

/**
 * `false` on the server and during hydration, `true` afterwards.
 *
 * Use to defer UI that genuinely cannot be known on the server (the resolved
 * theme, locale-dependent formatting) without risking a hydration mismatch.
 */
export function useIsMounted() {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )
}
