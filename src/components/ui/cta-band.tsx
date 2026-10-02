import { cn } from '@/lib/utils'

export type Accent = 'primary' | 'mint' | 'coral'

export const ACCENT_TEXT: Record<Accent, string> = {
  primary: 'text-primary',
  mint: 'text-mint',
  coral: 'text-coral',
}

export const ACCENT_BORDER: Record<Accent, string> = {
  primary: 'border-primary/35',
  mint: 'border-mint/35',
  coral: 'border-coral/35',
}

export const ACCENT_WASH: Record<Accent, string> = {
  primary: 'from-primary/12 via-primary/5 to-transparent',
  mint: 'from-mint/12 via-mint/5 to-transparent',
  coral: 'from-coral/12 via-coral/5 to-transparent',
}

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
  href = '/contact',
  actionLabel = 'Start a project',
  secondary,
  className,
}: {
  eyebrow: string
  title: string
  body: string
  href?: string
  actionLabel?: string
  secondary?: { href: string; label: string }
  className?: string
}) {
  return (
    <section
      className={cn(
        'relative overflow-hidden border-t border-border bg-muted/20 py-24 md:py-32',
        className,
      )}
    >
      <div
        className="grid-bg pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[52rem] -translate-x-1/2 bg-[var(--gradient-glow)] opacity-40 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-page relative">
        <div className="max-w-3xl">
          <p className="font-mono text-[0.7rem] tracking-[0.3em] text-mint uppercase">{eyebrow}</p>

          <h2 className="mt-6 text-3xl leading-[1.1] text-balance sm:text-4xl lg:text-5xl">
            {title}
          </h2>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{body}</p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={href}
              className="inline-flex h-14 items-center justify-center rounded-full bg-coral px-8 font-mono text-sm tracking-[0.2em] text-white uppercase shadow-[0_10px_30px_-12px_var(--coral)] transition-shadow hover:shadow-[0_16px_40px_-10px_var(--coral)]"
            >
              {actionLabel}
              <span aria-hidden="true">→</span>
            </a>

            {secondary ? (
              <a
                href={secondary.href}
                className="inline-flex h-14 items-center justify-center rounded-full border border-border px-8 font-mono text-sm tracking-[0.2em] uppercase transition-colors hover:border-foreground/25"
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
