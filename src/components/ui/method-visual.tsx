import { cn } from '@/lib/utils'

const OUTER_DOTS = [0, 72, 144, 216, 288]
const INNER_DOTS = [30, 150, 270]

/**
 * Decorative 3D orbit for the /method page gap.
 *
 * Two tilted rings in a perspective stage: five glowing nodes ride the outer
 * ring (one per phase, the first in pink), three drift the inner ring the
 * other way, and a pulsing core sits at the centre. Pure CSS — two keyframe
 * animations and static trigonometry, so it renders on the server, costs no
 * JavaScript, and freezes under reduced motion via the global reset.
 */
export function MethodVisual({ className }: { className?: string }) {
  return (
    <div
      className={cn('relative overflow-hidden', className)}
      aria-hidden="true"
      data-method-visual
    >
      <div className="absolute inset-0" style={{ perspective: '1000px' }}>
        <div className="absolute inset-0" style={{ transform: 'rotateX(58deg)' }}>
          {/* Outer ring: one node per phase. */}
          <div className="absolute inset-[10%] animate-orbit rounded-full border border-border-strong">
            {OUTER_DOTS.map((angle, i) => (
              <span
                key={angle}
                className={cn(
                  'absolute size-2 rounded-full',
                  i === 0
                    ? 'bg-coral shadow-[0_0_18px_0_var(--coral)]'
                    : 'bg-foreground shadow-[0_0_12px_0_color-mix(in_oklab,var(--foreground)_60%,transparent)]',
                )}
                style={{
                  left: `${50 + 50 * Math.cos((angle * Math.PI) / 180)}%`,
                  top: `${50 + 50 * Math.sin((angle * Math.PI) / 180)}%`,
                  translate: '-50% -50%',
                }}
              />
            ))}
          </div>

          {/* Inner ring, counter-rotating. */}
          <div className="absolute inset-[26%] animate-orbit-rev rounded-full border border-border">
            {INNER_DOTS.map((angle) => (
              <span
                key={angle}
                className="absolute size-1.5 rounded-full bg-muted-foreground"
                style={{
                  left: `${50 + 50 * Math.cos((angle * Math.PI) / 180)}%`,
                  top: `${50 + 50 * Math.sin((angle * Math.PI) / 180)}%`,
                  translate: '-50% -50%',
                }}
              />
            ))}
          </div>
        </div>

        {/* Core glow. */}
        <span className="absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-coral shadow-[0_0_28px_2px_var(--coral)]">
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-pulse-ring rounded-full bg-coral"
          />
        </span>
      </div>
    </div>
  )
}
