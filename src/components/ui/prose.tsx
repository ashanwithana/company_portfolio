import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * Long-form article typography.
 *
 * Scoped with arbitrary variants on `.prose` rather than a global reset, so the
 * post bodies can stay plain semantic HTML with no wrapper of their own.
 */
export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'max-w-2xl text-[0.95rem] leading-[1.75] text-muted-foreground md:text-base',
        '[&_a]:text-foreground [&_a]:underline [&_a]:decoration-coral/50 [&_a]:underline-offset-4 [&_a:hover]:decoration-coral',
        '[&_strong]:font-semibold [&_strong]:text-foreground',
        '[&_em]:italic',
        '[&_h2]:mt-14 [&_h2]:mb-5 [&_h2]:display-sm [&_h2]:text-foreground',
        '[&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:text-lg [&_h3]:text-foreground',
        '[&_ul]:my-6 [&_ul]:list-none [&_ul]:pl-0',
        '[&_ol]:my-6 [&_ol]:list-decimal [&_ol]:pl-6',
        '[&_li]:my-3 [&_li::marker]:text-coral',
        // Unordered items get a coral rule instead of a disc, matching the
        // bracketed labels used elsewhere in the design system.
        '[&_ul>li]:relative [&_ul>li]:pl-6 [&_ul>li]:before:absolute [&_ul>li]:before:top-[0.8em] [&_ul>li]:before:left-0 [&_ul>li]:before:h-px [&_ul>li]:before:w-3 [&_ul>li]:before:bg-coral/60 [&_ul>li]:before:content-[\'\']',
        '[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:text-foreground',
        '[&_pre]:my-7 [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:border [&_pre]:border-border [&_pre]:bg-muted/40 [&_pre]:p-5 [&_pre]:font-mono [&_pre]:text-sm',
        '[&_pre_code]:bg-transparent [&_pre_code]:p-0',
        '[&_blockquote]:my-8 [&_blockquote]:border-l-2 [&_blockquote]:border-coral [&_blockquote]:pl-6 [&_blockquote]:text-lg [&_blockquote]:text-foreground/90',
        '[&_hr]:my-12 [&_hr]:border-border',
        className,
      )}
    >
      {children}
    </div>
  )
}