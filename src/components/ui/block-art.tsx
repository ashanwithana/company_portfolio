/**
 * Placeholder block art.
 *
 * Every work image and article cover is generated from a deterministic seed, so
 * the site looks finished without shipping stock photography. Each tile takes a
 * `seed` and renders the same pattern every build — swap the component for
 * `next/image` when real assets exist.
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

const TINTS: readonly Tint[] = [
  { from: 'oklch(66% 0.21 274)', to: 'oklch(86% 0.15 162)', accent: 'oklch(74% 0.18 28)' },
  { from: 'oklch(74% 0.18 28)', to: 'oklch(66% 0.21 274)', accent: 'oklch(86% 0.15 162)' },
  { from: 'oklch(86% 0.15 162)', to: 'oklch(66% 0.21 274)', accent: 'oklch(66% 0.21 274)' },
  { from: 'oklch(66% 0.21 274)', to: 'oklch(74% 0.18 28)', accent: 'oklch(86% 0.15 162)' },
]

export function BlockArt({ seed, className, ratio = 'wide' }: BlockArtProps) {
  const random = makeRandom(seed)
  const tint = TINTS[hash(seed) % TINTS.length] ?? TINTS[0]!

  // A 6×4 lattice of offset circles reads as an abstract "data" motif.
  const cells = Array.from({ length: 24 }, (_, i) => {
    const column = i % 6
    const row = Math.floor(i / 6)
    const radius = 6 + random() * 22
    return {
      cx: 40 + column * 64 + random() * 24,
      cy: 36 + row * 56 + random() * 20,
      r: radius,
      opacity: 0.08 + random() * 0.3,
      isAccent: random() > 0.82,
    }
  })

  const gradientId = `bg-${hash(seed).toString(36)}`

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-border',
        RATIO_CLASS[ratio],
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" className="size-full">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={tint.from} stopOpacity="0.28" />
            <stop offset="100%" stopColor={tint.to} stopOpacity="0.12" />
          </linearGradient>
        </defs>

        <rect width="400" height="260" fill={`url(#${gradientId})`} />

        <g>
          {cells.map((cell, i) => (
            <circle
              key={i}
              cx={cell.cx}
              cy={cell.cy}
              r={cell.r}
              fill={cell.isAccent ? tint.accent : tint.from}
              opacity={cell.opacity}
            />
          ))}
        </g>

        {/* Fine grid overlay ties the composition together. */}
        <g stroke={tint.from} strokeOpacity="0.12" strokeWidth="1">
          {Array.from({ length: 7 }, (_, i) => (
            <line key={`v${i}`} x1={i * 64} y1="0" x2={i * 64} y2="260" />
          ))}
          {Array.from({ length: 5 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 64} x2="400" y2={i * 64} />
          ))}
        </g>
      </svg>

      {/* Bottom scrim so overlaid text stays legible. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
    </div>
  )
}

/** Small square mark used where an avatar-sized image is needed. */
export function InitialsAvatar({
  initials,
  className,
}: {
  initials: string
  className?: string
}) {
  const hue = hash(initials) % 360

  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex size-12 items-center justify-center rounded-full font-display text-sm font-semibold text-foreground',
        className,
      )}
      style={{
        background: `linear-gradient(135deg, oklch(70% 0.14 ${hue}), oklch(58% 0.16 ${(hue + 60) % 360}))`,
      }}
    >
      {initials}
    </span>
  )
}
