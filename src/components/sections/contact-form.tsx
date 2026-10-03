'use client'

import * as React from 'react'

import { submitContactAction, type ContactState } from '@/app/actions/forms'
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

type Values = {
  name: string
  email: string
  company: string
  service: string
  budget: string
  message: string
}

const EMPTY: Values = { name: '', email: '', company: '', service: '', budget: '', message: '' }

/**
 * Which fields each step validates. Optional steps validate nothing — the
 * server schema is still the trust boundary on submit.
 */
const STEP_FIELDS: readonly (readonly (keyof Values)[])[] = [
  ['name'],
  ['email'],
  [],
  [],
  ['message'],
]

const STEP_TITLES = [
  'First things first — what should we call you?',
  'Where can we reach you?',
  'What do you need?',
  'What budget range are we in?',
  'Tell us about the project.',
]

/**
 * Multi-step enquiry form, mirroring the reference's stepped contact flow:
 * one question per screen, a segmented progress bar up top, and a CONTINUE
 * button driving each step forward. The final step submits to the same Server
 * Action with the same Zod schema as before — only the presentation stepped,
 * the trust boundary did not move.
 *
 * Without JavaScript this degrades to a single form: every field is present in
 * the DOM with real names, and the step gating lives in the Continue handler.
 */
export function ContactForm() {
  const [state, action, pending] = React.useActionState<ContactState, FormData>(
    submitContactAction,
    null,
  )

  const [values, setValues] = React.useState<Values>(EMPTY)
  const [step, setStep] = React.useState(0)
  const [clientErrors, setClientErrors] = React.useState<FieldErrors>({})
  const [handledSuccess, setHandledSuccess] = React.useState<ContactState>(null)
  const formRef = React.useRef<HTMLFormElement>(null)
  const titleRef = React.useRef<HTMLHeadingElement>(null)

  if (state?.status === 'success' && state !== handledSuccess) {
    setHandledSuccess(state)
    setValues(EMPTY)
    setClientErrors({})
    setStep(0)
  }

  React.useEffect(() => {
    if (state?.status !== 'success') return
    formRef.current?.reset()
  }, [state])

  const errors: FieldErrors = {
    ...clientErrors,
    ...firstErrors(state?.status === 'error' ? state.fieldErrors : undefined),
  }

  const set = (patch: Partial<Values>) => setValues((prev) => ({ ...prev, ...patch }))

  const goToStep = (next: number) => {
    setStep(Math.min(Math.max(next, 0), STEP_TITLES.length - 1))
    // Move focus to the new question so keyboard and screen-reader users
    // follow the step change.
    requestAnimationFrame(() => titleRef.current?.focus())
  }

  const handleContinue = () => {
    const fields = STEP_FIELDS[step] ?? []

    if (fields.length > 0) {
      const parsed = contactSchema
        .pick(
          Object.fromEntries(fields.map((f) => [f, true])) as Record<(typeof fields)[number], true>,
        )
        .safeParse(Object.fromEntries(fields.map((f) => [f, values[f]])))

      if (!parsed.success) {
        setClientErrors(firstErrors(parsed.error.flatten().fieldErrors as Record<string, string[]>))
        return
      }
    }

    setClientErrors({})
    goToStep(step + 1)
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
      // Jump back to the first step holding an error.
      const order: (keyof Values)[] = ['name', 'email', 'company', 'service', 'budget', 'message']
      const bad = order.find((key) => parsed.error.flatten().fieldErrors[key])
      const at = STEP_FIELDS.findIndex((fields) => bad && fields.includes(bad))
      if (at >= 0) goToStep(at)
      return
    }

    setClientErrors({})
  }

  if (state?.status === 'success') {
    return (
      <div className="rounded-[22px] border border-border bg-card/40 p-8 md:p-12">
        <p className="label text-coral">Enquiry sent</p>
        <h2
          tabIndex={-1}
          ref={titleRef as React.RefObject<HTMLHeadingElement>}
          className="mt-4 display-md outline-none"
        >
          We&apos;ll be in touch within two working days.
        </h2>
        <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground" role="status">
          {state.message}
        </p>
      </div>
    )
  }

  const last = step === STEP_TITLES.length - 1

  return (
    <form
      ref={formRef}
      action={action}
      onSubmit={handleSubmit}
      noValidate
      className="rounded-[22px] border border-border bg-card/40 p-8 md:p-12"
    >
      {/* Honeypot: off-screen, unfocusable, rejected by the schema. */}
      <div aria-hidden="true" className="absolute h-px w-px overflow-hidden opacity-0">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Segmented progress: one bar per step, pink up to the current one. */}
      <div className="flex gap-2" aria-hidden="true">
        {STEP_TITLES.map((title, i) => (
          <span
            key={title}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors duration-500',
              i <= step ? 'bg-coral' : 'bg-border-strong',
            )}
          />
        ))}
      </div>
      <p className="sr-only" role="status">
        Step {step + 1} of {STEP_TITLES.length}
      </p>

      <h2 ref={titleRef} tabIndex={-1} className="mt-10 max-w-2xl display-sm outline-none">
        {STEP_TITLES[step]}
      </h2>

      {/* Every field stays mounted with its real name so the form submits as
          one payload and works without JavaScript; only the current step is
          visible. `hidden` keeps hidden steps out of the tab order. */}
      <div className="mt-8">
        <div hidden={step !== 0}>
          <StepField
            id="contact-name"
            name="name"
            value={values.name}
            error={errors.name}
            placeholder="your name *"
            autoComplete="name"
            onChange={(name) => set({ name })}
          />
        </div>

        <div hidden={step !== 1} className="grid gap-6 sm:grid-cols-2">
          <StepField
            id="contact-email"
            name="email"
            type="email"
            inputMode="email"
            value={values.email}
            error={errors.email}
            placeholder="your email *"
            autoComplete="email"
            onChange={(email) => set({ email })}
          />
          <StepField
            id="contact-company"
            name="company"
            value={values.company}
            error={errors.company}
            placeholder="company (optional)"
            autoComplete="organization"
            onChange={(company) => set({ company })}
          />
        </div>

        <div hidden={step !== 2}>
          <div className="grid gap-3" role="group" aria-label="What do you need?">
            {[
              { title: 'Not sure yet', value: '' },
              ...services.map((service) => ({ title: service.title, value: service.title })),
              { title: 'Something else', value: 'Something else' },
            ].map((option) => {
              const selected = values.service === option.value
              return (
                <button
                  key={option.title}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => set({ service: option.value })}
                  className={cn(
                    'flex min-h-14 items-center justify-between gap-4 rounded-2xl border px-6 text-left text-[15px] transition-colors',
                    selected
                      ? 'border-coral bg-coral/10 text-foreground'
                      : 'border-border text-muted-foreground hover:border-border-strong hover:text-foreground',
                  )}
                >
                  {option.title}
                  <span aria-hidden="true">→</span>
                </button>
              )
            })}
          </div>
          {/* The selected value rides along as a hidden field. */}
          <input type="hidden" name="service" value={values.service} />
        </div>

        <div hidden={step !== 3}>
          <div className="grid gap-3" role="group" aria-label="Approximate budget">
            {BUDGET_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={values.budget === option.value}
                onClick={() => set({ budget: option.value })}
                className={cn(
                  'flex min-h-14 items-center justify-between gap-4 rounded-2xl border px-6 text-left text-[15px] transition-colors',
                  values.budget === option.value
                    ? 'border-coral bg-coral/10 text-foreground'
                    : 'border-border text-muted-foreground hover:border-border-strong hover:text-foreground',
                )}
              >
                {option.label}
                <span aria-hidden="true">→</span>
              </button>
            ))}
          </div>
          <input type="hidden" name="budget" value={values.budget} />
        </div>

        <div hidden={step !== 4}>
          <label htmlFor="contact-message" className="sr-only">
            Project details
          </label>
          <textarea
            id="contact-message"
            name="message"
            value={values.message}
            onChange={(event) => set({ message: event.target.value })}
            placeholder="what are you building, what is in the way, and when do you need it working? *"
            rows={5}
            aria-invalid={errors.message ? true : undefined}
            className={cn(
              'w-full resize-y rounded-2xl border bg-background/60 px-6 py-5 text-[15px] leading-relaxed transition-colors outline-none',
              'placeholder:text-muted-foreground/60 focus:border-coral',
              errors.message ? 'border-destructive/70' : 'border-border',
            )}
          />
          {errors.message ? (
            <p className="mt-2 text-sm text-destructive">{errors.message}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between gap-4">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => goToStep(step - 1)}
            className="inline-flex min-h-11 items-center gap-2 label text-[0.7rem] text-muted-foreground transition-colors hover:text-foreground"
          >
            <span aria-hidden="true">←</span> back
          </button>
        ) : (
          <span />
        )}

        {last ? (
          <button
            type="submit"
            disabled={pending}
            aria-disabled={pending}
            className="inline-flex h-[52px] items-center justify-center gap-2.5 rounded-full bg-coral px-8 font-mono text-[12px] font-medium tracking-[-0.01em] text-coral-foreground shadow-[0_10px_30px_-12px_var(--coral)] transition-shadow hover:shadow-[0_16px_44px_-12px_var(--coral)] disabled:pointer-events-none disabled:opacity-50"
          >
            {pending ? 'Sending…' : 'Send enquiry'}
            <span aria-hidden="true">→</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleContinue}
            className="inline-flex h-[52px] items-center justify-center gap-2.5 rounded-full bg-coral px-8 font-mono text-[12px] font-medium tracking-[-0.01em] text-coral-foreground shadow-[0_10px_30px_-12px_var(--coral)] transition-shadow hover:shadow-[0_16px_44px_-12px_var(--coral)]"
          >
            Continue
            <span aria-hidden="true">→</span>
          </button>
        )}
      </div>

      <p
        role="status"
        aria-live="polite"
        className={cn(
          'mt-6 min-h-5 text-sm outline-none',
          state?.status === 'error' && 'text-destructive',
        )}
      >
        {state?.status === 'error' ? state.message : ''}
      </p>
    </form>
  )
}

function StepField({
  id,
  name,
  value,
  onChange,
  error,
  type = 'text',
  inputMode,
  placeholder,
  autoComplete,
}: {
  id: string
  name: string
  value: string
  onChange: (value: string) => void
  error?: string
  type?: string
  inputMode?: 'email' | 'text'
  placeholder?: string
  autoComplete?: string
}) {
  const errorId = `${id}-error`

  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          'w-full rounded-2xl border bg-background/60 px-6 py-5 text-[15px] transition-colors outline-none',
          'placeholder:text-muted-foreground/60 focus:border-coral',
          error ? 'border-destructive/70' : 'border-border',
        )}
      />
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}
