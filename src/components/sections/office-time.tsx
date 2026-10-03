'use client'

import * as React from 'react'

/**
 * Live office clock for the footer status strip.
 *
 * The current minute is read as external store state: a one-minute interval
 * notifies subscribers, and the server snapshot is null (rendered as "--:--").
 * That keeps the server markup deterministic while the client ticks — there is
 * no `setState`-in-effect and no render-time `Date.now()` to mismatch on.
 */
function subscribeToMinutes(onStoreChange: () => void) {
  const now = new Date()
  const msToNextMinute = 60_000 - (now.getSeconds() * 1000 + now.getMilliseconds())
  let interval = 0

  const timeout = setTimeout(() => {
    onStoreChange()
    interval = window.setInterval(onStoreChange, 60_000)
  }, msToNextMinute)

  return () => {
    clearTimeout(timeout)
    if (interval) clearInterval(interval)
  }
}

function getMinuteSnapshot() {
  return Math.floor(Date.now() / 60_000)
}

function getServerSnapshot() {
  return null
}

function formatMinute(minute: number | null, timeZone: string) {
  if (minute === null) return '--:--'
  try {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone,
    }).format(new Date(minute * 60_000))
  } catch {
    // Unknown zone: render the placeholder rather than throwing during render.
    return '--:--'
  }
}

export function OfficeTime({ timeZone }: { timeZone: string }) {
  const minute = React.useSyncExternalStore(
    subscribeToMinutes,
    getMinuteSnapshot,
    getServerSnapshot,
  )

  return <span className="tabular-nums">{formatMinute(minute, timeZone)}</span>
}
