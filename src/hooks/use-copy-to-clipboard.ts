'use client'

import * as React from 'react'

/** Copy text to the clipboard and reset the "copied" flag after `timeout`ms. */
export function useCopyToClipboard(timeout = 2000) {
  const [copied, setCopied] = React.useState(false)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  React.useEffect(() => () => clearTimeout(timerRef.current), [])

  const copy = React.useCallback(
    async (value: string) => {
      try {
        await navigator.clipboard.writeText(value)
      } catch {
        // Clipboard API can be blocked (insecure context, permissions).
        return false
      }

      setCopied(true)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCopied(false), timeout)
      return true
    },
    [timeout],
  )

  return { copied, copy }
}
