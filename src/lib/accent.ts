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

export type Tint = 'primary' | 'amber' | 'brand'

export const ACCENT_TEXT: Record<Tint, string> = {
  primary: 'text-primary',
  amber: 'text-amber',
  brand: 'text-brand',
}

export const ACCENT_BORDER: Record<Tint, string> = {
  primary: 'border-primary/30',
  amber: 'border-amber/30',
  brand: 'border-brand/30',
}

/** Corner wash applied to cards, keyed to the tint. */
export const ACCENT_WASH: Record<Tint, string> = {
  primary: 'from-primary/10 via-primary/[0.03] to-transparent',
  amber: 'from-amber/10 via-amber/[0.03] to-transparent',
  brand: 'from-brand/10 via-brand/[0.03] to-transparent',
}

/** Solid dot used in stat rows and list markers. */
export const ACCENT_DOT: Record<Tint, string> = {
  primary: 'bg-primary',
  amber: 'bg-amber',
  brand: 'bg-brand',
}

/** Flat ground for the case study plate, keyed to the tint. */
export const ACCENT_GLOW: Record<Tint, string> = {
  primary: 'bg-gradient-to-br from-primary/12 via-background to-elevated',
  amber: 'bg-gradient-to-br from-amber/12 via-background to-elevated',
  brand: 'bg-gradient-to-br from-brand/12 via-background to-elevated',
}

/** Hairline index number on the plate. */
export const ACCENT_RULE: Record<Tint, string> = {
  primary: 'text-primary/60',
  amber: 'text-amber/60',
  brand: 'text-brand/60',
}

/** Oversized monogram on the plate — decorative, so kept faint. */
export const ACCENT_MONOGRAM: Record<Tint, string> = {
  primary: 'text-primary/25',
  amber: 'text-amber/25',
  brand: 'text-brand/25',
}
