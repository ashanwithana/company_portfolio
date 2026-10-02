'use client'

import * as React from 'react'

import { submitContactAction, type ContactState } from '@/app/actions/forms'
import { Button } from '@/components/ui/button'
import { contactSchema, firstErrors, type FieldErrors } from '@/lib/validation'
import { services } from '@/content/services'
import { cn } from '@/lib/utils'

const BUDGET_OPTIONS = [
  { value: '', label: 'Not sure yet' },
  { value: 'under-25k', label: 'Under £25k' },
  { value: '25k-60k', label: '£25k – £60k' },
  { value: '60k-150k', label: '£60k – £150k' },
  { value: '150k-plus', label: '£150k+' },
] as const

/**
 * Project enquiry form.
 *
 * Uses `useActionState` against a Server Action. The same Zod schema runs on
 * both sides — the client pass gives instant feedback, the server pass is the
 * trust boundary — so the two can never disagree about what is valid.
 */
export function ContactForm() {
  const [state, action, pending] = React.useActionState<ContactState, FormData>(
    submitContactAction,
    null,
  )

  const [values, setValues] = React.useState({
    name: '',
    email: '',
    company: '',
    service: '',
    budget: '',
    message: '',
  })

  const [clientErrors, setClientErrors] = React.useState<FieldErrors>({})
  const [handledSuccess, setHandledSuccess] = React.useState<ContactState>(null)
  const formRef = React.useRef<HTMLFormElement>(null)
  const statusRef = React.useRef<HTMLParagraphElement>(null)

  if (state?.status === 'success' && state !== handledSuccess) {
    setHandledSuccess(state)
    setValues({ name: '', email: '', company: '', service: '', budget: '', message: '' })
    setClientErrors({})
  }

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
      company: formData.get('company'),
      service: formData.get('service'),
      budget: formData.get('budget'),
      message: formData.get('message'),
    })

    if (!parsed.success) {
      event.preventDefault()
      setClientErrors(firstErrors(parsed.error.flatten().fieldErrors as Record<string, string[]>))
      return
    }

    setClientErrors({})
  }

  return (
    <form
      ref={formRef}
      action={action}
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-border bg-card/40 p-7 backdrop-blur-sm md:p-10"
    >
      {/* Honeypot: off-screen, unfocusable, rejected by the schema. */}
      <div aria-hidden="true" className="absolute h-px w-px overflow-hidden opacity-0">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id="name"
          label="Name"
          value={values.name}
          error={errors.name}
          placeholder="Alex Parker"
          autoComplete="name"
          onChange={(name) => setValues((prev) => ({ ...prev, name }))}
        />
        <Field
          id="email"
          label="Email"
          type="email"
          inputMode="email"
          value={values.email}
          error={errors.email}
          placeholder="alex@company.com"
          autoComplete="email"
          onChange={(email) => setValues((prev) => ({ ...prev, email }))}
        />
        <Field
          id="company"
          label="Company"
          optional
          value={values.company}
          error={errors.company}
          placeholder="Company name"
          autoComplete="organization"
          onChange={(company) => setValues((prev) => ({ ...prev, company }))}
        />

        {/* Service selector — a native select keeps mobile behaviour correct. */}
        <div>
          <label
            htmlFor="service"
            className="mb-2.5 block font-mono text-[0.65rem] tracking-[0.3em] text-muted-foreground uppercase"
          >
            Service{' '}
            <span className="normal-case opacity-60">(optional)</span>
          </label>
          <select
            id="service"
            name="service"
            value={values.service}
            onChange={(event) => setValues((prev) => ({ ...prev, service: event.target.value }))}
            className={cn(
              'w-full rounded-xl border border-border bg-background/60 px-5 py-4 text-base outline-none transition-colors focus:border-primary/60',
              !values.service && 'text-muted-foreground/70',
            )}
          >
            <option value="">What do you need?</option>
            {services.map((service) => (
              <option key={service.slug} value={service.title} className="text-foreground">
                {service.title}
              </option>
            ))}
            <option value="Something else" className="text-foreground">
              Something else
            </option>
          </select>
        </div>
      </div>

      {/* Budget — radio group, since these are mutually exclusive choices. */}
      <fieldset className="mt-6">
        <legend className="mb-3 font-mono text-[0.65rem] tracking-[0.3em] text-muted-foreground uppercase">
          Approximate budget{' '}
          <span className="normal-case opacity-60">(optional)</span>
        </legend>

        <div className="flex flex-wrap gap-2">
          {BUDGET_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={cn(
                'inline-flex min-h-10 cursor-pointer items-center rounded-full border px-4 font-mono text-[0.65rem] tracking-[0.15em] uppercase transition-colors',
                'has-checked:border-foreground has-checked:bg-foreground has-checked:text-background',
                'has-focus-visible:outline has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring',
                values.budget === option.value
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border text-muted-foreground hover:border-foreground/25',
              )}
            >
              <input
                type="radio"
                name="budget"
                value={option.value}
                checked={values.budget === option.value}
                onChange={() => setValues((prev) => ({ ...prev, budget: option.value }))}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6">
        <Field
          id="message"
          label="Project / Idea"
          as="textarea"
          value={values.message}
          error={errors.message}
          placeholder="What are you building, what is in the way, and when do you need it working?"
          onChange={(message) => setValues((prev) => ({ ...prev, message }))}
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" disabled={pending} aria-disabled={pending}>
          {pending ? 'Sending…' : 'Send enquiry'}
          <span aria-hidden="true">→</span>
        </Button>

        <p
          ref={statusRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className={cn(
            'text-sm outline-none',
            state?.status === 'success' && 'text-mint',
            state?.status === 'error' && 'text-destructive',
          )}
        >
          {state?.message}
        </p>
      </div>
    </form>
  )
}

type FieldProps = {
  id: 'name' | 'email' | 'company' | 'message'
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  as?: 'input' | 'textarea'
  type?: string
  inputMode?: 'email' | 'text'
  placeholder?: string
  autoComplete?: string
  optional?: boolean
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
  optional,
}: FieldProps) {
  const errorId = `${id}-error`

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
        {label}{' '}
        {optional ? <span className="normal-case opacity-60">(optional)</span> : null}
      </label>

      {as === 'textarea' ? (
        <textarea {...shared} rows={6} className={cn(shared.className, 'min-h-40 resize-y')} />
      ) : (
        <input {...shared} type={type} />
      )}

      {error ? (
        <p id={errorId} className="mt-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}
