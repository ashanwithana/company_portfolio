import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'max-w-2xl text-base leading-relaxed text-muted-foreground',
        // Article typography, scoped to `.prose` so we don't fight a global reset.
        '[&_a]:text-foreground [&_a]:underline [&_a]:decoration-mint/50 [&_a]:underline-offset-4 [&_a:hover]:decoration-mint',
        '[&_strong]:font-semibold [&_strong]:text-foreground',
        '[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:text-foreground',
        '[&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:text-foreground',
        '[&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6',
        '[&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6',
        '[&_li]:my-2 [&_li::marker]:text-mint',
        '[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:text-foreground',
        '[&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-border [&_pre]:bg-muted/40 [&_pre]:p-5 [&_pre]:font-mono [&_pre]:text-sm',
        '[&_pre_code]:bg-transparent [&_pre_code]:p-0',
        '[&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-mint [&_blockquote]:pl-5 [&_blockquote]:text-foreground/90 [&_blockquote]:italic',
        '[&_hr]:my-10 [&_hr]:border-border',
        className,
      )}
    >
      {children}
    </div>
  )
}
