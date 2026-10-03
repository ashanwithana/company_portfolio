/**
 * Placeholder cover art.
 *
 * Every work image and article cover is generated from a deterministic seed, so
 * the site looks finished without shipping stock photography. Each tile takes a
 * `seed` and renders the same pattern every build — swap the component for
 * `next/image` when real assets exist.
 *
 * The motif is a halftone ramp over a dot matrix: dot radius grows along a
 * diagonal, echoing the hero's dotted globe and the page's dot-grid backdrop
 * rather than introducing a second visual language.
 */

import { cn } from '@/lib/utils'

export type BlockArtProps = {
  /** Any string; the same seed always produces the same artwork. */
  seed: string
  className?: string
  /** Declared so the tile reserves space before it paints. */
  ratio?: 'square' | 'wide' | 'portrait'
}

const RATIO_CLASS = {
  square: 'aspect-square',
  wide: 'aspect-16/10',
  portrait: 'aspect-4/5',
} as const

/** Small, stable string hash — FNV-1a. */
function hash(seed: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** Deterministic PRNG seeded from the hash, so output is stable across builds. */
function makeRandom(seed: string) {
  let state = hash(seed) || 1

  return () => {
    state ^= state << 13
    state ^= state >>> 17
    state ^= state << 5
    state >>>= 0
    return state / 0xffffffff
  }
}

type Tint = { from: string; to: string; accent: string }

/** Tints drawn from the site palette. */
const TINTS: readonly Tint[] = [
  { from: '#e4007c', to: '#7c5bff', accent: '#ff9f1c' },
  { from: '#7c5bff', to: '#e4007c', accent: '#f0f0f8' },
  { from: '#ff9f1c', to: '#e4007c', accent: '#7c5bff' },
  { from: '#e4007c', to: '#ff9f1c', accent: '#7c5bff' },
]

/*
 * Tile resolution.
 *
 * Deliberately coarse: the ramp reads as a halftone at ~16px pitch, and every
 * circle is a real DOM node that ships in the SSR payload and is walked during
 * hydration. A denser grid costs kilobytes per tile for no visible gain — at
 * 6 tiles on /work this was the single largest thing in the HTML.
 */
const COLS = 15
const ROWS = 9
const CELL = 16

/** Trim float noise: 17 significant digits per attribute is not a visual feature. */
const round = (n: number) => Math.round(n * 100) / 100

export function BlockArt({ seed, className, ratio = 'wide' }: BlockArtProps) {
  const random = makeRandom(seed)
  const tint = TINTS[hash(seed) % TINTS.length] ?? TINTS[0]!

  // The ramp runs along an arbitrary direction so tiles do not all read as the
  // same top-left-to-bottom-right gradient.
  const angle = random() * Math.PI * 2
  const ax = Math.cos(angle)
  const ay = Math.sin(angle)
  const bias = 0.25 + random() * 0.5

  const gradientId = `bg-${hash(seed).toString(36)}`

  const cells: { cx: number; cy: number; r: number; fill: string; opacity: number }[] = []

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      // Projection onto the ramp axis, normalised to 0..1.
      const u = (col / (COLS - 1) - 0.5) * ax + (row / (ROWS - 1) - 0.5) * ay + 0.5
      // Squared for a faster falloff, then jittered so the ramp has texture
      // rather than reading as a clean gradient.
      const ramp = Math.min(1, Math.max(0, (u - bias) / (1 - bias)))
      const t = ramp * ramp * 0.85 + random() * 0.22

      const isAccent = t > 0.72 && random() > 0.72

      cells.push({
        cx: round(8 + col * CELL + (random() - 0.5) * 3),
        cy: round(8 + row * CELL + (random() - 0.5) * 3),
        r: round(1.1 + t * 5.4),
        fill: isAccent ? tint.accent : tint.from,
        opacity: round(0.12 + t * 0.6),
      })
    }
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-border bg-card',
        RATIO_CLASS[ratio],
        className,
      )}
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${COLS * CELL + 16} ${ROWS * CELL + 16}`}
        preserveAspectRatio="xMidYMid slice"
        className="size-full"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={tint.from} stopOpacity="0.16" />
            <stop offset="100%" stopColor={tint.to} stopOpacity="0.06" />
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill={`url(#${gradientId})`} />

        <g>
          {cells.map((cell, i) => (
            <circle
              key={i}
              cx={cell.cx}
              cy={cell.cy}
              r={cell.r}
              fill={cell.fill}
              opacity={cell.opacity}
            />
          ))}
        </g>
      </svg>

      {/* Bottom scrim so overlaid text stays legible. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
    </div>
  )
}

/** Small square mark used where an avatar-sized image is needed. */
export function InitialsAvatar({ initials, className }: { initials: string; className?: string }) {
  const pick = TINTS[hash(initials) % TINTS.length] ?? TINTS[0]!

  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex size-12 items-center justify-center rounded-full border border-border text-sm font-semibold text-foreground',
        className,
      )}
      style={{
        background: `linear-gradient(135deg, ${pick.from}33, ${pick.to}1a)`,
      }}
    >
      {initials}
    </span>
  )
}
