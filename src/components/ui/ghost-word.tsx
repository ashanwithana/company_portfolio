import { cn } from '@/lib/utils'

/**
 * Approximate glyph advance width of the display face, as a fraction of the
 * font size, for a typical mixed-case word. Used only to pick a font size that
 * fits — never for measuring anything that must be exact.
 */
const ADVANCE = 0.62

/** Ceiling so a short word does not become absurd on a wide screen. */
const MAX_REM = 18

export type GhostWordProps = {
  word: string
  /** Positioning for the parent section — `left` anchors to the content edge. */
  placement?: 'left' | 'center'
  className?: string
}

/**
 * Oversized decorative type behind a heading.
 *
 * Sized in `cqw` — the parent section's own inline size — so the word scales
 * with the container instead of the viewport. The previous version sized it in
 * `vh`, which tracked height while the text ran horizontally: on intermediate
 * widths a long word like "Enterprise" overflowed the container and got
 * cropped mid-letter. Deriving the size from the character count keeps the word
 * inside the box at every width.
 *
 * The parent must be a container (`@container`) for `cqw` to resolve.
 * Decorative only: every section it sits behind is already named by its label
 * and title, so it is hidden from assistive technology.
 */
export function GhostWord({ word, placement = 'left', className }: GhostWordProps) {
  // Width needed = character count × advance. Inverting that gives the font
  // size at which the word exactly fills 100cqw.
  const fill = 100 / (Math.max(word.length, 1) * ADVANCE)

  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute font-display text-ghost leading-none whitespace-nowrap select-none',
        placement === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0',
        className,
      )}
      style={{ fontSize: `min(${fill.toFixed(1)}cqw, ${MAX_REM}rem)` }}
    >
      {word}
    </span>
  )
}
