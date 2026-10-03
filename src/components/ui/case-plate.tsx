import { ACCENT_GLOW, ACCENT_RULE, ACCENT_MONOGRAM } from '@/lib/accent'
import type { Tint } from '@/lib/accent'
import { cn } from '@/lib/utils'

export type CasePlateProps = {
  /** Client name — the monogram is derived from it. */
  client: string
  /** Position on the grid, 1-indexed. Shown as a hairline index. */
  index: number
  tint: Tint
  className?: string
  /** Declared so the plate reserves its box before the glyph renders. */
  ratio?: 'wide' | 'square' | 'portrait'
}

const RATIO_CLASS = {
  square: 'aspect-square',
  wide: 'aspect-16/10',
  portrait: 'aspect-4/5',
} as const

/** First letters of up to two words — "Meridian" → M, "Fieldnote" → F. */
function monogram(client: string): string {
  const words = client
    .trim()
    .split(/[\s-]+/)
    .filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) return words[0]!.slice(0, 2).toUpperCase()
  return (words[0]![0]! + words[1]![0]!).toUpperCase()
}

/**
 * Case study plate.
 *
 * Replaces the generated dot artwork with something deliberately plain: a flat
 * tinted ground, one oversized monogram, and a hairline index. It carries no
 * invented imagery — the card says who the work was for and what it was, and
 * stops there. When real photography or screenshots arrive, this is the
 * component to replace with `next/image`.
 *
 * The monogram is the only visual element, so it is decorative: the client's
 * name is already in the card's text label one line below.
 */
export function CasePlate({ client, index, tint, className, ratio = 'wide' }: CasePlateProps) {
  return (
    <div
      className={cn(
        // `@container` is what lets the monogram scale with the plate's own
        // width via cqw, so it stays proportional from the /work grid (wide,
        // two-up) down to the /ai page (small, square) without magic numbers.
        '@container relative isolate overflow-hidden rounded-2xl border border-border',
        ACCENT_GLOW[tint],
        RATIO_CLASS[ratio],
        className,
      )}
      aria-hidden="true"
    >
      {/* Monogram: cropped against the bottom-left corner, oversized so it
          reads as a shape rather than as a letter. */}
      <span
        className={cn(
          'absolute -bottom-[0.18em] -left-[0.06em] font-display leading-none tracking-[-0.06em] select-none',
          ACCENT_MONOGRAM[tint],
        )}
        style={{ fontSize: 'min(46cqw, 15rem)' }}
      >
        {monogram(client)}
      </span>

      {/* Index, top-left, in the rule colour. */}
      <span
        className={cn('absolute top-4 left-5 text-[0.6rem] tracking-[0.2em]', ACCENT_RULE[tint])}
      >
        {String(index).padStart(2, '0')}
      </span>
    </div>
  )
}
