import { ButtonLink } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/** Sets the last two words bold against the thin lead, as the page heroes do. */
function emphasize(title: string) {
  const words = title.split(' ')
  if (words.length < 4) return title
  return (
    <>
      {words.slice(0, -2).join(' ')} <span className="font-bold">{words.slice(-2).join(' ')}</span>
    </>
  )
}

/**
 * Closing call to action, reused at the bottom of most marketing pages.
 *
 * A numbered-style label with a rule, a thin-over-bold headline on the left and
 * the supporting copy and buttons on the right, all inside the page column.
 * `href` should point at a real route so it works without JavaScript; the
 * optional action renders a secondary link beside it.
 */
export function CtaBand({
  eyebrow,
  title,
  body,
  href = '/start-a-project',
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
    <section className={cn('border-t border-border py-20 md:py-28', className)}>
      <div className="container-page">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
            {eyebrow}
          </span>
          <span aria-hidden="true" className="h-px max-w-[160px] flex-1 bg-border-strong" />
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <h2 className="text-[clamp(2rem,4.6vw,4.5rem)] leading-[0.98] font-thin tracking-tighter text-balance uppercase lg:col-span-8">
            {emphasize(title)}
          </h2>

          <div className="lg:col-span-4 lg:self-end">
            <p className="leading-relaxed font-light text-muted-foreground md:text-lg">{body}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href={href} size="lg">
                {actionLabel}
                <span aria-hidden="true">→</span>
              </ButtonLink>

              {secondary ? (
                <ButtonLink href={secondary.href} variant="outline" size="lg">
                  {secondary.label}
                </ButtonLink>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
