import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-mono text-xs tracking-[0.2em] uppercase transition-[transform,background-color,color,box-shadow] duration-300 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]',
  {
    variants: {
      variant: {
        primary:
          'bg-coral text-white shadow-[0_10px_30px_-12px_var(--coral)] hover:shadow-[0_16px_40px_-10px_var(--coral)]',
        outline:
          'border border-border bg-transparent text-foreground hover:border-foreground/25 hover:bg-foreground/[0.03]',
        ghost: 'text-muted-foreground hover:bg-foreground/[0.05] hover:text-foreground',
      },
      size: {
        sm: 'h-9 px-4',
        md: 'h-11 px-6',
        lg: 'h-14 px-8 text-sm',
        icon: 'size-10',
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
