import Link from 'next/link'

export type PainPoint = {
  text: string
  count: number
  href: string
  /** Scatter position on desktop: percent offsets inside the field. */
  x: number
  y: number
  rotate: number
}

const DEFAULT_PAIN_POINTS: readonly PainPoint[] = [
  {
    text: 'our ERP data never reconciles',
    count: 14,
    href: '/enterprise',
    x: 8,
    y: 12,
    rotate: -2,
  },
  {
    text: 'we retype orders into three systems',
    count: 9,
    href: '/enterprise',
    x: 62,
    y: 6,
    rotate: 1.5,
  },
  {
    text: 'nobody trusts the sales forecast',
    count: 11,
    href: '/enterprise',
    x: 30,
    y: 34,
    rotate: 1,
  },
  {
    text: 'the AI demo never reached production',
    count: 22,
    href: '/ai',
    x: 66,
    y: 38,
    rotate: -1.5,
  },
  {
    text: 'support answers from memory, not docs',
    count: 17,
    href: '/ai',
    x: 12,
    y: 58,
    rotate: 2,
  },
  { text: 'our site keeps slowing down', count: 28, href: '/services', x: 48, y: 62, rotate: -1 },
  {
    text: 'redesigns stall in stakeholder loops',
    count: 7,
    href: '/work',
    x: 76,
    y: 66,
    rotate: 2,
  },
]

/**
 * "What's slowing you down?" — the reference's dark scatter section.
 *
 * Real client complaints float scattered across a tall field, each with a
 * count and an arrow, each linking to the practice that fixes it. The slight
 * rotations keep the field from reading as a list. On narrow screens the field
 * collapses to a plain reading order — absolute scatter needs room to breathe.
 */
export function PainPoints({ items = DEFAULT_PAIN_POINTS }: { items?: readonly PainPoint[] }) {
  return (
    <section
      aria-label="What's slowing you down?"
      className="relative overflow-hidden py-24 md:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 dot-grid mask-fade-radial opacity-60"
        aria-hidden="true"
      />

      <div className="relative container-page text-center">
        <h2 className="mx-auto max-w-3xl display-lg">What&apos;s slowing you down?</h2>
        <p className="mt-6 label text-muted-foreground">You name it — we&apos;ve fixed it</p>
      </div>

      {/* Scattered field (desktop). */}
      <div
        className="relative container-page mt-6 hidden min-h-[26rem] md:block"
        aria-hidden="false"
      >
        {items.map((item) => (
          <Link
            key={item.text}
            href={item.href}
            className="group absolute max-w-[17rem] text-[13px] leading-relaxed text-muted-foreground transition-colors hover:text-foreground"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              rotate: `${item.rotate}deg`,
            }}
          >
            {item.text}
            <span className="ml-2 text-foreground tabular-nums">{item.count}</span>
            <span
              aria-hidden="true"
              className="ml-1.5 inline-block transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-coral"
            >
              ↗
            </span>
          </Link>
        ))}
      </div>

      {/* Reading order (mobile). */}
      <ul className="relative container-page mt-10 space-y-4 md:hidden">
        {items.map((item) => (
          <li key={item.text}>
            <Link
              href={item.href}
              className="group flex items-baseline justify-between gap-4 border-b border-border py-4 text-[13px] text-muted-foreground"
            >
              <span>
                {item.text}
                <span className="ml-2 text-foreground tabular-nums">{item.count}</span>
              </span>
              <span aria-hidden="true" className="shrink-0 group-hover:text-coral">
                ↗
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Tilted ticker closing the section. */}
      <div
        className="relative mt-20 -rotate-2 overflow-hidden border-y border-border py-4"
        aria-hidden="true"
      >
        <div className="flex w-max animate-marquee gap-8 whitespace-nowrap">
          {[0, 1].map((copy) => (
            <p key={copy} className="display-md text-ghost">
              Software should earn its place · Your processes don&apos;t have to be the bottleneck ·
              Measured, not promised ·
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
