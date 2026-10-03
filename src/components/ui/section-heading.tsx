import { cn } from '@/lib/utils'

/**
 * Section wrapper providing consistent vertical rhythm and landmark semantics.
 * Used by the home page sections, which are not routes.
 */
export function Section({
  id,
  label,
  children,
  className,
  tone = 'default',
}: {
  id: string
  label: string
  children: React.ReactNode
  className?: string
  tone?: 'default' | 'muted'
}) {
  return (
    <section
      id={id}
      aria-label={label}
      className={cn(
        'container-page scroll-mt-24 py-20 md:py-28',
        tone === 'muted' && 'border-y border-border bg-muted/20',
        className,
      )}
    >
      {children}
    </section>
  )
}

export type SectionHeadingProps = {
  /** Two-digit ordinal shown before the label, e.g. "01". */
  index: string
  label: string
  title: string
  description?: string
  className?: string
}

/**
 * Numbered editorial section header used across the home page.
 *
 * Purely presentational — a server component, since there is no interactivity.
 * The label is a real anchor so the section is linkable, and `scroll-mt` on the
 * section itself handles the sticky-header offset natively.
 */
export function SectionHeading({
  index,
  label,
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <header className={cn('mb-14 md:mb-20', className)}>
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs tracking-[0.3em] text-muted-foreground tabular-nums">
          {index}
        </span>
        <span className="h-px w-10 bg-mint" aria-hidden="true" />
        <span className="font-mono text-xs tracking-[0.3em] text-mint uppercase">{label}</span>
      </div>

      <h2 className="mt-6 max-w-5xl text-4xl leading-[1.05] text-balance sm:text-5xl lg:text-6xl">
        {title}
      </h2>

      {description ? (
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </header>
  )
}
