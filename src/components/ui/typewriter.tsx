'use client'

import * as React from 'react'

import { useReducedMotion } from '@/hooks/use-media-query'

type TypewriterProps = {
  words: readonly string[]
  className?: string
  /** Milliseconds between characters when typing. */
  typeSpeed?: number
  /** Milliseconds between characters when deleting. */
  deleteSpeed?: number
  /** Pause on a fully typed word. */
  holdTime?: number
}

/**
 * Rotating typewriter used for the hero role line.
 *
 * Every state transition happens inside a timer callback, never synchronously
 * in the effect body, which avoids the cascading-render pattern React 19 warns
 * about. Screen readers get a visually-hidden live region that mirrors the
 * visible text, so the animation isn't announced keystroke by keystroke.
 */
export function Typewriter({
  words,
  className,
  typeSpeed = 70,
  deleteSpeed = 34,
  holdTime = 1800,
}: TypewriterProps) {
  const reducedMotion = useReducedMotion()
  const [index, setIndex] = React.useState(0)
  const [text, setText] = React.useState('')
  const [deleting, setDeleting] = React.useState(false)

  const word = words.length > 0 ? (words[index % words.length] ?? '') : ''

  React.useEffect(() => {
    if (reducedMotion || words.length === 0) return

    const atEnd = text === word
    const atStart = text.length === 0

    // Fully typed → pause, then start deleting.
    if (atEnd) {
      const timer = setTimeout(() => setDeleting(true), holdTime)
      return () => clearTimeout(timer)
    }

    // Fully deleted → advance to the next word and start typing.
    if (deleting && atStart) {
      const timer = setTimeout(() => {
        setDeleting(false)
        setIndex((prev) => (prev + 1) % words.length)
      }, 120)
      return () => clearTimeout(timer)
    }

    const timer = setTimeout(
      () => {
        setText((prev) => (deleting ? prev.slice(0, -1) : word.slice(0, prev.length + 1)))
      },
      deleting ? deleteSpeed : typeSpeed,
    )

    return () => clearTimeout(timer)
  }, [text, deleting, index, word, words, reducedMotion, typeSpeed, deleteSpeed, holdTime])

  const shown = reducedMotion ? word : text

  return (
    <>
      {/* Visual output */}
      <span className={className} aria-hidden="true">
        {shown}
        {!reducedMotion ? <span className="animate-blink text-coral">▌</span> : null}
      </span>

      {/* Accessible equivalent */}
      <span className="sr-only" role="status" aria-live="polite">
        {shown}
      </span>
    </>
  )
}
