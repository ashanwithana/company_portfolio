import { cn } from '@/lib/utils'

export type InitialsAvatarProps = {
  /** Up to two initials, already uppercased by the content layer. */
  initials: string
  className?: string
}

/**
 * Team member avatar.
 *
 * No portraits exist yet, so each person is represented by their initials on a
 * tinted ground. It is the one place initials make sense as content — a name
 * you already know identifies the person — unlike the case study monogram,
 * which is decorative.
 */
export function InitialsAvatar({ initials, className }: InitialsAvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-gradient-to-br from-primary/20 to-coral/10 font-display text-xs tracking-[0.08em] text-foreground',
        className,
      )}
    >
      {initials}
    </span>
  )
}
