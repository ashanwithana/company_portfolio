'use client'

import * as React from 'react'

import { submitContactAction, type ContactState } from '@/app/actions/contact'
import { Button } from '@/components/ui/button'
import { contactSchema, firstErrors, type FieldErrors } from '@/lib/validation'
import { cn } from '@/lib/utils'

type FieldName = 'name' | 'email' | 'message'

const EMPTY: Record<FieldName, string> = { name: '', email: '', message: '' }

/**
 * Contact form built on `useActionState`.
 *
 * Validation runs twice on purpose: Zod on the client for instant feedback, and
 * again inside the server action because the client is not a trust boundary.
 * The shared schema guarantees the two can't disagree.
 */
export function ContactForm() {
  const [state, formAction, pending] = React.useActionState<ContactState, FormData>(
    submitContactAction,
    null,
  )

  const [values, setValues] = React.useState(EMPTY)
  const [clientErrors, setClientErrors] = React.useState<FieldErrors>({})
  const [handledSuccess, setHandledSuccess] = React.useState<ContactState>(null)
  const formRef = React.useRef<HTMLFormElement>(null)
  const statusRef = React.useRef<HTMLParagraphElement>(null)

  // React's documented "adjust state when an input changes" pattern. Doing this
  // during render rather than in an effect avoids a cascading second render.
  if (state?.status === 'success' && state !== handledSuccess) {
    setHandledSuccess(state)
    setValues(EMPTY)
    setClientErrors({})
  }

  // DOM-only concerns stay in an effect: reset the native form and move focus
  // to the status message so keyboard and screen-reader users learn the outcome.
  React.useEffect(() => {
    if (state?.status !== 'success') return
    formRef.current?.reset()
    statusRef.current?.focus()
  }, [state])

  const errors: FieldErrors = {
    ...clientErrors,
    ...firstErrors(state?.status === 'error' ? state.fieldErrors : undefined),
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget)

    const parsed = contactSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    })

    if (!parsed.success) {
      // Keep the server action from running on input we already know is bad.
      event.preventDefault()
      setClientErrors(firstErrors(parsed.error.flatten().fieldErrors as Record<string, string[]>))
      return
    }

    setClientErrors({})
  }

  const statusMessage = state?.message
  const statusTone =
    state?.status === 'success' ? 'text-mint' : state?.status === 'error' ? 'text-destructive' : ''

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-border bg-card/40 p-7 backdrop-blur-sm md:p-10"
    >
      {/* Honeypot: off-screen, unfocusable, and rejected by the schema. */}
      <div aria-hidden="true" className="absolute h-px w-px overflow-hidden opacity-0">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="space-y-6">
        <Field
          id="name"
          label="Name"
          value={values.name}
          error={errors.name}
          placeholder="Alex Parker"
          autoComplete="name"
          onChange={(value) => setValues((prev) => ({ ...prev, name: value }))}
        />
        <Field
          id="email"
          label="Email"
          type="email"
          inputMode="email"
          value={values.email}
          error={errors.email}
          placeholder="alex@example.com"
          autoComplete="email"
          onChange={(value) => setValues((prev) => ({ ...prev, email: value }))}
        />
        <Field
          id="message"
          label="Project / Idea"
          as="textarea"
          value={values.message}
          error={errors.message}
          placeholder="What are you working on? Timelines, budgets, or wild ideas are all welcome here…"
          onChange={(value) => setValues((prev) => ({ ...prev, message: value }))}
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" disabled={pending} aria-disabled={pending}>
          {pending ? 'Sending…' : 'Send message'}
          <span aria-hidden="true">→</span>
        </Button>

        <p
          ref={statusRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className={cn('text-sm outline-none', statusTone)}
        >
          {statusMessage}
        </p>
      </div>
    </form>
  )
}

type FieldProps = {
  id: FieldName
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  as?: 'input' | 'textarea'
  type?: string
  inputMode?: 'email' | 'text'
  placeholder?: string
  autoComplete?: string
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  as = 'input',
  type = 'text',
  inputMode,
  placeholder,
  autoComplete,
}: FieldProps) {
  const errorId = `${id}-error`
  const hintId = `${id}-hint`

  const shared = {
    id,
    name: id,
    value,
    placeholder,
    autoComplete,
    inputMode,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(event.target.value),
    className: cn(
      'w-full rounded-xl border bg-background/60 px-5 py-4 text-base outline-none transition-colors',
      'placeholder:text-muted-foreground/60 focus:border-primary/60',
      error ? 'border-destructive/70' : 'border-border',
    ),
  }

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2.5 block font-mono text-[0.65rem] tracking-[0.3em] text-muted-foreground uppercase"
      >
        {label}
      </label>

      {as === 'textarea' ? (
        <textarea
          {...shared}
          rows={6}
          aria-describedby={hintId}
          className={cn(shared.className, 'min-h-40 resize-y')}
        />
      ) : (
        <input {...shared} type={type} />
      )}

      <p id={hintId} className="sr-only">
        {as === 'textarea'
          ? 'Tell me about the project, including rough timeline and budget.'
          : `${label} field.`}
      </p>

      {error ? (
        <p id={errorId} className="mt-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}
