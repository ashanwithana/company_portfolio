import type { ComponentProps, ReactNode } from 'react'

import { cn } from '@/lib/utils'

/** Animated availability pill with a pulsing ring — used in hero and contact. */
export function StatusBadge({
  children,
  className,
  tone = 'mint',
}: {
  children: ReactNode
  className?: string
  tone?: 'mint' | 'coral' | 'primary'
}) {
  const toneClass = {
    mint: 'text-mint',
    coral: 'text-coral',
    primary: 'text-primary',
  }[tone]

  return (
    <span
      className={cn(
        'relative inline-flex items-center gap-2.5 rounded-full border border-border bg-card/60 px-4 py-2 font-mono text-[0.7rem] tracking-[0.25em] uppercase backdrop-blur-sm',
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

/** Small uppercase label used above section titles and on cards. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'font-mono text-[0.7rem] tracking-[0.3em] text-muted-foreground uppercase',
        className,
      )}
    >
      {children}
    </span>
  )
}

/** Monospace tag chip. */
export function Tag({ children, className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-border bg-background/50 px-3 py-1.5 font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
