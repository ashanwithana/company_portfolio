/**
 * Accent maps for the three content tints.
 *
 * Lives in its own module rather than inside a component so both server and
 * client components — and the card grids — can read the same mapping without
 * importing a React component just to get a class name.
 *
 * The three tints are pink / violet / amber. They are used to differentiate
 * cards categorically, never to carry meaning on their own: every card also has
 * a visible title and label.
 */

export type Tint = 'primary' | 'amber' | 'coral'

export const ACCENT_TEXT: Record<Tint, string> = {
  primary: 'text-primary',
  amber: 'text-amber',
  coral: 'text-coral',
}

export const ACCENT_BORDER: Record<Tint, string> = {
  primary: 'border-primary/30',
  amber: 'border-amber/30',
  coral: 'border-coral/30',
}

/** Corner wash applied to cards, keyed to the tint. */
export const ACCENT_WASH: Record<Tint, string> = {
  primary: 'from-primary/10 via-primary/[0.03] to-transparent',
  amber: 'from-amber/10 via-amber/[0.03] to-transparent',
  coral: 'from-coral/10 via-coral/[0.03] to-transparent',
}

/** Solid dot used in stat rows and list markers. */
export const ACCENT_DOT: Record<Tint, string> = {
  primary: 'bg-primary',
  amber: 'bg-amber',
  coral: 'bg-coral',
}
