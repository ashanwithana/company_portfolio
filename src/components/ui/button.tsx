import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

/*
 * Buttons are small, uppercase and tracked, with hairline outlines. The solid
 * variant is plain ink on ground (white on black, black on paper): contrast is
 * the only emphasis, so there is no coloured glow.
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2.5 font-sans text-[11px] leading-[1.5] font-normal tracking-[0.14em] uppercase transition-[transform,background-color,color,box-shadow,border-color] duration-300 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]',
  {
    variants: {
      variant: {
        primary: 'bg-foreground text-background hover:bg-foreground/85',
        secondary: 'bg-accent text-foreground hover:bg-foreground/15',
        outline:
          'border border-border-strong bg-transparent text-foreground hover:border-foreground hover:bg-foreground/5',
        ghost: 'text-muted-foreground hover:bg-accent hover:text-foreground',
      },
      size: {
        sm: 'h-9 px-4',
        md: 'h-11 px-6',
        lg: 'h-[52px] px-7',
        icon: 'size-10 rounded-full',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

type ButtonProps = ComponentProps<'button'> & VariantProps<typeof buttonVariants>

export function Button({ className, variant, size, type = 'button', ...props }: ButtonProps) {
  return (
    <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
}

type ButtonLinkProps = ComponentProps<'a'> & VariantProps<typeof buttonVariants>

/** Anchor styled as a button — used where the control navigates to a hash route. */
export function ButtonLink({ className, variant, size, ...props }: ButtonLinkProps) {
  return <a className={cn(buttonVariants({ variant, size }), className)} {...props} />
}

export { buttonVariants }
