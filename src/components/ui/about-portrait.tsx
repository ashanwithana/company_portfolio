import { cn } from '@/lib/utils'

/**
 * Stylised portrait used in the About section.
 *
 * Kept as inline SVG rather than a raster asset: it stays crisp at any DPI,
 * adapts to the theme via `currentColor`/CSS variables, adds no network
 * request, and costs a few hundred bytes instead of ~200 kB.
 *
 * Replace with `<Image>` (or a photo) when real artwork is available — the
 * wrapper below is already sized for a 4:5 aspect ratio.
 */
export function AboutPortrait({ className }: { className?: string }) {
  return (
    <div className={cn('relative overflow-hidden rounded-xl border border-border', className)}>
      <svg
        viewBox="0 0 400 500"
        role="img"
        aria-label="Illustrated portrait"
        className="block h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="portrait-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(62% 0.16 255)" />
            <stop offset="55%" stopColor="oklch(58% 0.14 300)" />
            <stop offset="100%" stopColor="oklch(70% 0.12 20)" />
          </linearGradient>

          <linearGradient id="portrait-hair" x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor="oklch(42% 0.12 295)" />
            <stop offset="60%" stopColor="oklch(34% 0.11 290)" />
            <stop offset="100%" stopColor="oklch(28% 0.09 288)" />
          </linearGradient>

          <linearGradient id="portrait-skin" x1="0.3" y1="0" x2="0.7" y2="1">
            <stop offset="0%" stopColor="oklch(84% 0.06 60)" />
            <stop offset="100%" stopColor="oklch(74% 0.07 45)" />
          </linearGradient>

          <linearGradient id="portrait-shirt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(26% 0.03 265)" />
            <stop offset="100%" stopColor="oklch(18% 0.02 265)" />
          </linearGradient>

          <filter id="portrait-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={3} seed={3} />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.06" />
            </feComponentTransfer>
          </filter>
        </defs>

        {/* Backdrop */}
        <rect width="400" height="500" fill="url(#portrait-bg)" />
        <g opacity="0.14" fill="none" stroke="#fff" strokeWidth="2">
          <path d="M-20 120 L420 40" />
          <path d="M-20 190 L420 110" />
          <path d="M-20 400 L420 320" />
        </g>
        <circle cx="318" cy="98" r="58" fill="oklch(86% 0.15 162)" opacity="0.22" />

        {/* Shoulders */}
        <path
          d="M200 336c-72 0-124 44-136 108-3 16-4 32-4 56h280c0-24-1-40-4-56-12-64-64-108-136-108Z"
          fill="url(#portrait-shirt)"
        />
        {/* Collar */}
        <path
          d="M200 336c-18 0-34 4-48 11 14 34 30 52 48 52s34-18 48-52c-14-7-30-11-48-11Z"
          fill="oklch(32% 0.03 265)"
        />

        {/* Neck */}
        <path
          d="M170 268h60v56c0 12-14 22-30 22s-30-10-30-22v-56Z"
          fill="url(#portrait-skin)"
        />
        <path d="M170 268h60v18c-20 14-40 14-60 0v-18Z" fill="oklch(66% 0.07 40)" opacity="0.5" />

        {/* Face */}
        <path
          d="M200 118c46 0 78 34 78 84 0 56-34 106-78 106s-78-50-78-106c0-50 32-84 78-84Z"
          fill="url(#portrait-skin)"
        />

        {/* Ears */}
        <ellipse cx="123" cy="212" rx="12" ry="18" fill="url(#portrait-skin)" />
        <ellipse cx="277" cy="212" rx="12" ry="18" fill="url(#portrait-skin)" />

        {/* Hair back mass */}
        <path
          d="M200 78c-58 0-96 40-96 96 0 34 6 60 4 84-2 22-10 40-10 40 14 8 30 6 40-6 4-20-2-46 0-70 2-24 10-40 26-52 14-10 24-6 36-6s22-4 36 6c16 12 24 28 26 52 2 24-4 50 0 70 10 12 26 14 40 6 0 0-8-18-10-40-2-24 4-50 4-84 0-56-38-96-96-96Z"
          fill="url(#portrait-hair)"
        />

        {/* Fringe */}
        <path
          d="M200 78c-58 0-96 40-96 96 0 10 1 19 3 27 6-42 22-64 44-74 20 22 54 30 82 24 18-4 34-14 44-28 8 14 14 34 16 78 2-8 3-17 3-27 0-56-38-96-96-96Z"
          fill="url(#portrait-hair)"
        />
        <path
          d="M152 150c22-30 66-38 96-16-26 6-58 4-78 22-8 8-14 18-18 30-2-14-2-28 0-36Z"
          fill="oklch(46% 0.13 296)"
          opacity="0.65"
        />

        {/* Brows */}
        <path d="M148 196c12-8 30-9 42-2" stroke="oklch(30% 0.1 290)" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M210 194c12-7 30-6 42 2" stroke="oklch(30% 0.1 290)" strokeWidth="6" strokeLinecap="round" fill="none" />

        {/* Eyes */}
        <ellipse cx="170" cy="220" rx="15" ry="11" fill="#fbf7f4" />
        <ellipse cx="231" cy="220" rx="15" ry="11" fill="#fbf7f4" />
        <circle cx="172" cy="221" r="7.5" fill="oklch(32% 0.07 285)" />
        <circle cx="233" cy="221" r="7.5" fill="oklch(32% 0.07 285)" />
        <circle cx="172" cy="221" r="3.5" fill="oklch(18% 0.04 285)" />
        <circle cx="233" cy="221" r="3.5" fill="oklch(18% 0.04 285)" />
        <circle cx="169" cy="218" r="2" fill="#fff" />
        <circle cx="230" cy="218" r="2" fill="#fff" />
        <path d="M155 220c8-6 22-6 30 0" stroke="oklch(24% 0.08 290)" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M216 220c8-6 22-6 30 0" stroke="oklch(24% 0.08 290)" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Nose + mouth */}
        <path d="M200 236v22c0 4-4 6-8 6" stroke="oklch(66% 0.08 40)" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M182 282c11 9 25 9 36 0" stroke="oklch(58% 0.13 25)" strokeWidth="5" fill="none" strokeLinecap="round" />

        {/* Grain overlay for depth */}
        <rect width="400" height="500" filter="url(#portrait-grain)" opacity="0.5" />
      </svg>

      {/* Bottom scrim so the identity plate stays legible */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent"
        aria-hidden="true"
      />
    </div>
  )
}
