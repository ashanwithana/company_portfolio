import { Eyebrow } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

/**
 * Section wrapper providing consistent vertical rhythm and landmark semantics.
 *
 * `tone="paper"` inverts the whole block to the opposite ground (see
 * `.tone-paper` in globals.css), which is what produces the page's alternating
 * dark/paper rhythm. Because the inversion redefines the token set rather than
 * overriding individual colours, components inside stay theme-agnostic.
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
  tone?: 'default' | 'muted' | 'paper'
  dotGrid?: boolean
}) {
  return (
    <section
      id={id}
      aria-label={label}
      className={cn(
        'relative scroll-mt-28 py-24 md:py-32',
        tone === 'muted' && 'bg-muted',
        tone === 'paper' && 'tone-paper',
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
  /**
   * Word rendered as oversized ghost type behind the heading, bleeding off the
   * edge. Decorative — never the only place the section is named.
   */
  ghost?: string
  className?: string
}

/**
 * Numbered editorial section header.
 *
 * A server component — there is no interactivity here. The oversized ghost word
 * sits behind the content and is hidden from assistive technology, since the
 * `title` already names the section.
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
    <header className={cn('relative mb-14 md:mb-20', className)}>
      {ghost ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-[0.12em] -left-[0.03em] font-sans text-[clamp(9rem,54vh,32rem)] text-ghost"
        >
          {ghost}
        </span>
      ) : null}

      <div className="relative">
        <Eyebrow leading={<span className="text-coral tabular-nums">{index}</span>}>
          {label}
        </Eyebrow>

        <h2 className="mt-7 max-w-4xl display-lg">{title}</h2>

        {description ? (
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {description}
          </p>
        ) : null}
      </div>
    </header>
  )
}
