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
        {/*
          Outline ghost heading, hidden from assistive tech — the sub-line
          below is the readable heading. The reference renders this line as a
          giant stroke-only backdrop.
        */}
        <p
          aria-hidden="true"
          className="font-display text-[clamp(2.75rem,8.5vw,6.9375rem)] leading-[1] font-extrabold tracking-[-0.04em] whitespace-nowrap text-transparent select-none"
          style={{
            WebkitTextStroke: '1.5px color-mix(in oklab, var(--foreground) 30%, transparent)',
          }}
        >
          What&apos;s slowing you down?
        </p>
        <h2 className="mx-auto mt-6 max-w-2xl font-mono text-xl font-normal tracking-normal md:text-2xl">
          You name the friction. We map the fix.
        </h2>

        <p className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-border px-4 py-2.5 font-mono text-[11px] tracking-[0.08em] uppercase">
          <span className="relative flex size-2 items-center justify-center" aria-hidden="true">
            <span className="absolute size-2 animate-pulse-ring rounded-full bg-coral" />
            <span className="size-1.5 rounded-full bg-coral" />
          </span>
          <span className="tabular-nums">{String(items.length).padStart(2, '0')}</span>
          <span className="text-muted-foreground">· frictions we fix</span>
        </p>
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
        className="relative mt-20 -rotate-3 overflow-hidden border-y border-border py-4"
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
