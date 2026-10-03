import { Eyebrow } from '@/components/ui/badge'
import { GhostWord } from '@/components/ui/ghost-word'
import { cn } from '@/lib/utils'

/**
 * Section wrapper providing consistent vertical rhythm and landmark semantics.
 * Used by the home page sections, which are not routes.
 *
 * `tone="muted"` lays a subtle band behind the section while staying on the
 * page ground in both themes — the site is dark-first and sections never
 * flip to a light ground.
 */
export function Section({
  id,
  label,
  children,
  className,
  tone = 'default',
  dotGrid = false,
}: {
  id: string
  label: string
  children: React.ReactNode
  className?: string
  tone?: 'default' | 'muted'
  dotGrid?: boolean
}) {
  return (
    <section
      id={id}
      aria-label={label}
      className={cn(
        'relative scroll-mt-28 py-24 md:py-32',
        tone === 'muted' && 'bg-muted',
        className,
      )}
    >
      {dotGrid ? (
        <div
          className="pointer-events-none absolute inset-0 dot-grid mask-fade-radial opacity-60"
          aria-hidden="true"
        />
      ) : null}

      <div className="relative container-page">{children}</div>
    </section>
  )
}

export type SectionHeadingProps = {
  /** Two-digit ordinal shown before the label, e.g. "01". */
  index: string
  label: string
  title: string
  description?: string
  /** Decorative oversized type behind the heading. Never the only section name. */
  ghost?: string
  className?: string
}

/**
 * Numbered editorial section header.
 *
 * A server component — there is no interactivity here. The section is named
 * by its label and title; no oversized background type sits behind it.
 */
export function SectionHeading({
  index,
  label,
  title,
  description,
  ghost,
  className,
}: SectionHeadingProps) {
  return (
    <header className={cn('@container relative mb-14 text-center md:mb-20', className)}>
      {ghost ? <GhostWord word={ghost} placement="center" className="-top-[0.14em]" /> : null}

      <div className="relative">
        <Eyebrow
          className="justify-center"
          leading={<span className="text-brand tabular-nums">{index}</span>}
        >
          {label}
        </Eyebrow>

        <h2 className="mx-auto mt-5 max-w-4xl display-lg">{title}</h2>

        {description ? (
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {description}
          </p>
        ) : null}
      </div>
    </header>
  )
}
