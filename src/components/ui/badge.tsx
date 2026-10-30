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
  tone = 'brand',
}: {
  children: ReactNode
  className?: string
  tone?: 'brand' | 'primary' | 'amber'
}) {
  const toneClass = {
    brand: 'text-brand',
    primary: 'text-primary',
    amber: 'text-amber',
  }[tone]

  return (
    <span
      className={cn(
        'relative inline-flex items-center gap-2.5 border border-border px-4 py-2.5 label',
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
 * Section label, set as tracked uppercase text with an optional ordinal.
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
  soft = false,
  leading,
}: {
  children: ReactNode
  className?: string
  accent?: boolean
  /** Muted text instead of foreground — for eyebrows on dark grounds. */
  soft?: boolean
  /** Optional leading element, e.g. a section ordinal. */
  leading?: ReactNode
}) {
  return (
    <p
      className={cn(
        'flex items-center gap-4 label-wide',
        accent ? 'text-brand' : 'text-muted-foreground',
        className,
      )}
    >
      {leading}
      <span className={!accent && !soft ? 'text-foreground' : undefined}>{children}</span>
    </p>
  )
}

/** Monospace tag chip. */
export function Tag({ children, className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'inline-flex items-center border border-border px-3 py-1.5 label text-[0.55rem] text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
