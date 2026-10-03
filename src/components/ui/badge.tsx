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
  tone?: 'coral' | 'primary' | 'mint'
}) {
  const toneClass = {
    coral: 'text-coral',
    primary: 'text-primary',
    mint: 'text-mint',
  }[tone]

  return (
    <span
      className={cn(
        'relative inline-flex items-center gap-2.5 rounded-full border border-border bg-card/70 px-4 py-2.5 font-mono text-[0.62rem] tracking-[0.25em] uppercase backdrop-blur-sm',
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

/** Tracked uppercase eyebrow used above section titles. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('label text-muted-foreground', className)}>
      <span aria-hidden="true">[</span> {children} <span aria-hidden="true">]</span>
    </span>
  )
}

/** Monospace tag chip. */
export function Tag({ children, className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-border px-3 py-1.5 font-mono text-[0.6rem] tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:border-border-strong hover:text-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}