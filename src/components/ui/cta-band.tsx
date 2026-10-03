import { cn } from '@/lib/utils'

/**
 * Closing call to action, reused at the bottom of most marketing pages.
 *
 * `href` should point at a real route so it works without JavaScript; the
 * optional action renders a secondary link beside it.
 */
export function CtaBand({
  eyebrow,
  title,
  body,
  ghost,
  href = '/contact',
  actionLabel = 'Start a project',
  secondary,
  className,
}: {
  eyebrow: string
  title: string
  body: string
  ghost?: string
  href?: string
  actionLabel?: string
  secondary?: { href: string; label: string }
  className?: string
}) {
  return (
    <section
      className={cn('relative overflow-hidden border-t border-border py-28 md:py-36', className)}
    >
      <div
        className="pointer-events-none absolute inset-0 dot-grid opacity-70 mask-fade-radial"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[60rem] -translate-x-1/2 bg-[var(--gradient-glow)] opacity-50 blur-3xl"
        aria-hidden="true"
      />

      {ghost ? (
        <span
          aria-hidden="true"
          className="text-ghost pointer-events-none absolute -bottom-[0.12em] left-1/2 -translate-x-1/2 font-display text-[clamp(5rem,19vw,17rem)] leading-[0.8] font-bold tracking-[-0.06em] whitespace-nowrap select-none"
        >
          {ghost}
        </span>
      ) : null}

      <div className="relative container-page">
        <div className="max-w-3xl">
          <p className="label flex items-center gap-3 text-muted-foreground">
            <span aria-hidden="true">[</span>
            <span className="text-coral">{eyebrow}</span>
            <span aria-hidden="true">]</span>
          </p>

          <h2 className="mt-7 display-lg">{title}</h2>

          <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {body}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={href}
              className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-coral px-8 font-mono text-xs tracking-[0.2em] text-coral-foreground uppercase shadow-[0_10px_30px_-12px_var(--coral)] transition-shadow hover:shadow-[0_16px_44px_-12px_var(--coral)]"
            >
              {actionLabel}
              <span aria-hidden="true">→</span>
            </a>

            {secondary ? (
              <a
                href={secondary.href}
                className="inline-flex h-14 items-center justify-center rounded-full border border-border-strong px-8 font-mono text-xs tracking-[0.2em] uppercase transition-colors hover:border-coral hover:text-coral"
              >
                {secondary.label}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}