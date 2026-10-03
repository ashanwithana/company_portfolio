import type { ComponentProps, ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * Availability pill with a pulsing dot.
 *
 * The pulse ring is decorative and sits behind the solid dot, so the status
 * reads from the solid mark alone — colour is never the only signal.
 */
export function StatusBadge({
  children,
  className,
  tone = 'coral',
}: {
  children: ReactNode
  className?: string
  tone?: 'coral' | 'primary' | 'amber'
}) {
  const toneClass = {
    coral: 'text-coral',
    primary: 'text-primary',
    amber: 'text-amber',
  }[tone]

  return (
    <span
      className={cn(
        'relative inline-flex items-center gap-2.5 rounded-full border border-border bg-card/70 px-4 py-2.5 label backdrop-blur-sm',
        className,
      )}
    >
      <span className="relative flex size-2 items-center justify-center" aria-hidden="true">
        <span className={cn('absolute size-2 animate-pulse-ring rounded-full', toneClass)} />
        <span className={cn('size-1.5 rounded-full bg-current', toneClass)} />
      </span>
      {children}
    </span>
  )
}

/**
 * Bracketed section label — `[ LABEL ]`.
 *
 * The one way a section announces itself. It was previously hand-written in
 * three places with slightly different markup, which is how two spellings of
 * the same component end up coexisting.
 *
 * `accent` colours the label text (used where the label is the accent, e.g. a
 * page eyebrow); otherwise it stays muted.
 */
export function Eyebrow({
  children,
  className,
  accent = false,
  leading,
}: {
  children: ReactNode
  className?: string
  accent?: boolean
  /** Optional leading element, e.g. a section ordinal. */
  leading?: ReactNode
}) {
  return (
    <p
      className={cn(
        'flex items-center gap-3 label',
        accent ? 'text-coral' : 'text-muted-foreground',
        className,
      )}
    >
      {leading}
      <span aria-hidden="true">[</span>
      <span className={accent ? undefined : 'text-foreground'}>{children}</span>
      <span aria-hidden="true">]</span>
    </p>
  )
}

/** Monospace tag chip. */
export function Tag({ children, className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-border px-3 py-1.5 label text-[0.55rem] text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
