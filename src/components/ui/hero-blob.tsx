import { cn } from '@/lib/utils'

/**
 * Organic "liquid metal" blob used as the hero focal point.
 *
 * The reference implementation reaches for a WebGL renderer. That costs
 * ~150 kB gzipped plus a second render loop, so this version composes the same
 * look out of an SVG turbulence displacement and a specular highlight —
 * visually equivalent, resolution-independent and inert to JS.
 */
export function HeroBlob({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute top-1/2 left-1/2 w-[min(78vw,34rem)] -translate-x-1/2 -translate-y-1/2 select-none',
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 400 400" className="h-full w-full animate-float overflow-visible">
        <defs>
          <radialGradient id="blob-fill" cx="35%" cy="28%" r="78%">
            <stop offset="0%" stopColor="oklch(78% 0.14 292)" />
            <stop offset="45%" stopColor="oklch(66% 0.19 278)" />
            <stop offset="100%" stopColor="oklch(48% 0.2 268)" />
          </radialGradient>

          <radialGradient id="blob-specular" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.85" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="blob-rim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(88% 0.1 300)" stopOpacity="0.9" />
            <stop offset="50%" stopColor="oklch(70% 0.16 285)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="oklch(50% 0.2 268)" stopOpacity="0.7" />
          </linearGradient>

          {/* Low-frequency turbulence morphs the silhouette frame to frame. */}
          <filter id="blob-warp" x="-25%" y="-25%" width="150%" height="150%">
            <feTurbulence type="fractalNoise" baseFrequency="0.011 0.014" numOctaves={3} seed={7} result="noise">
              <animate
                attributeName="baseFrequency"
                dur="18s"
                values="0.011 0.014; 0.016 0.010; 0.011 0.014"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="34" xChannelSelector="R" yChannelSelector="G" />
          </filter>

          {/* Inner shading that gives the form its volume. */}
          <filter id="blob-shade" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="14" result="blur" />
            <feSpecularLighting
              in="blur"
              surfaceScale="9"
              specularConstant="0.75"
              specularExponent="22"
              lightingColor="#ffffff"
              result="spec"
            >
              <fePointLight x="150" y="90" z="220" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceAlpha" operator="in" result="specClipped" />
            <feComposite in="SourceGraphic" in2="specClipped" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
          </filter>

          <filter id="blob-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="26" />
          </filter>
        </defs>

        {/* Ambient bloom behind the shape. */}
        <circle cx="200" cy="200" r="150" fill="url(#blob-fill)" opacity="0.35" filter="url(#blob-glow)" />

        <g filter="url(#blob-warp)">
          <g filter="url(#blob-shade)">
            <path
              fill="url(#blob-fill)"
              stroke="url(#blob-rim)"
              strokeWidth="2.5"
              d="M200 62c58 0 108 40 122 96s-14 116-60 148-104 34-146 6-70-78-64-128S142 62 200 62Z"
            />
          </g>
        </g>

        {/* Specular highlights sit outside the displacement filter so they stay crisp. */}
        <ellipse cx="152" cy="128" rx="46" ry="30" fill="url(#blob-specular)" opacity="0.5"
          transform="rotate(-22 152 128)" />
        <ellipse cx="243" cy="268" rx="13" ry="9" fill="url(#blob-specular)" opacity="0.55" />
        <circle cx="168" cy="182" r="7" fill="var(--foreground)" opacity="0.55" />
      </svg>
    </div>
  )
}
