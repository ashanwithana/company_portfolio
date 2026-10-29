import { Eyebrow } from '@/components/ui/badge'
import { ButtonLink } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Closing call to action, reused at the bottom of most marketing pages.
 *
 * Centred like the reference's closing sections. `href` should point at a real
 * route so it works without JavaScript; the optional action renders a
 * secondary link beside it.
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
    <section
      className={cn('relative overflow-hidden border-t border-border py-28 md:py-36', className)}
    >
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[60rem] -translate-x-1/2 bg-[var(--gradient-glow)] opacity-50 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative container-page text-center">
        <div className="mx-auto max-w-3xl">
          <Eyebrow accent className="justify-center">
            {eyebrow}
          </Eyebrow>

          <h2 className="mt-5 display-lg">{title}</h2>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {body}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
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
    </section>
  )
}
