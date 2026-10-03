'use client'

import * as React from 'react'

import { subscribeAction, type NewsletterState } from '@/app/actions/forms'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Newsletter signup.
 *
 * Small enough to sit in a footer or a CTA band without becoming a form the
 * visitor has to think about.
 */
export function NewsletterForm({ className }: { className?: string }) {
  const [state, action, pending] = React.useActionState<NewsletterState, FormData>(
    subscribeAction,
    null,
  )

  const [email, setEmail] = React.useState('')
  const [handledSuccess, setHandledSuccess] = React.useState<NewsletterState>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const statusRef = React.useRef<HTMLParagraphElement>(null)

  // Clear the field during render, not in an effect — avoids a cascading render.
  if (state?.status === 'success' && state !== handledSuccess) {
    setHandledSuccess(state)
    setEmail('')
  }

  React.useEffect(() => {
    if (state?.status === 'success') statusRef.current?.focus()
  }, [state])

  const error = state?.status === 'error' ? (state.fieldErrors.email?.[0] ?? null) : null

  return (
    <form action={action} className={cn('w-full max-w-md', className)}>
      <div aria-hidden="true" className="absolute h-px w-px overflow-hidden opacity-0">
        <label htmlFor="newsletter-website">Website</label>
        <input
          id="newsletter-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            ref={inputRef}
            id="newsletter-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'newsletter-error' : undefined}
            className={cn(
              'h-12 w-full rounded-full border bg-background/60 px-5 text-sm transition-colors outline-none',
              'placeholder:text-muted-foreground/60 focus:border-primary/60',
              error ? 'border-destructive/70' : 'border-border',
            )}
          />
        </div>

        <Button type="submit" disabled={pending} className="shrink-0">
          {pending ? 'Joining…' : 'Subscribe'}
        </Button>
      </div>

      <p
        ref={statusRef}
        id="newsletter-error"
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className={cn(
          'mt-3 min-h-5 text-sm outline-none',
          state?.status === 'success' && 'text-mint',
          error && 'text-destructive',
        )}
      >
        {state?.message ?? ''}
      </p>
    </form>
  )
}
