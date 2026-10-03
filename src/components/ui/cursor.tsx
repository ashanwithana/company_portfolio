'use client'

import * as React from 'react'

import { useHasFinePointer, useReducedMotion } from '@/hooks/use-media-query'

/**
 * Custom cursor dot.
 *
 * Only mounts on devices with a fine pointer, and is skipped entirely when the
 * user prefers reduced motion. The dot tracks the pointer exactly and grows
 * slightly over interactive elements. Interaction state is derived from the DOM
 * element under the pointer via `closest()` rather than per-element listeners,
 * so it stays O(1) regardless of how many hoverable nodes exist.
 */
export function Cursor() {
  const hasFinePointer = useHasFinePointer()
  const reducedMotion = useReducedMotion()
  const enabled = hasFinePointer && !reducedMotion

  const dotRef = React.useRef<HTMLDivElement>(null)
  const [visible, setVisible] = React.useState(false)
  const [interactive, setInteractive] = React.useState(false)

  React.useEffect(() => {
    if (!enabled) return

    document.body.dataset.customCursor = 'true'

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    let frame = 0

    const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, [data-cursor-hover]'

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
      setVisible(true)
      setInteractive(Boolean((event.target as Element | null)?.closest?.(INTERACTIVE)))

      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        dotRef.current?.style.setProperty(
          'transform',
          `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%)`,
        )
      })
    }

    const onLeave = () => setVisible(false)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      delete document.body.dataset.customCursor
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      className="no-print pointer-events-none fixed inset-0 z-[80] hidden md:block"
      aria-hidden="true"
    >
      <div
        ref={dotRef}
        className="absolute top-0 left-0 rounded-full bg-brand transition-[opacity,width,height] duration-200 will-change-transform"
        style={{
          opacity: visible ? 1 : 0,
          width: interactive ? 12 : 8,
          height: interactive ? 12 : 8,
        }}
      />
    </div>
  )
}
