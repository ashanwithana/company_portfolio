'use client'

import * as React from 'react'

import { submitContactAction, type ContactState } from '@/app/actions/forms'
import { contactSchema, firstErrors, type FieldErrors } from '@/lib/validation'
import { services } from '@/content/services'
import { cn } from '@/lib/utils'

const BUDGET_OPTIONS = [
  { value: 'under-1k', label: 'Under $1k' },
  { value: '1k-2.5k', label: '$1k – $2.5k' },
  { value: 'over-2.5k', label: 'More than $2.5k' },
  { value: 'lets-talk', label: "Let's talk about it" },
] as const

/**
 * Project enquiry form, styled as an open ledger: numbered rows with
 * borderless underline fields rather than boxed cards or stepped screens.
 * One screen, everything visible, nothing hidden behind a Continue button.
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
  const [sentSummary, setSentSummary] = React.useState<typeof values | null>(null)
  // Snapshot of the fields at submit time, so the success panel can echo back
  // exactly what was sent even after the form clears.
  const [pendingSummary, setPendingSummary] = React.useState<typeof values | null>(null)
  const formRef = React.useRef<HTMLFormElement>(null)
  const successRef = React.useRef<HTMLDivElement>(null)
  const fieldRefs = React.useRef<Record<string, HTMLElement | null>>({})

  if (state?.status === 'success' && state !== handledSuccess) {
    setHandledSuccess(state)
    setSentSummary(pendingSummary)
    setPendingSummary(null)
    setValues({ name: '', email: '', company: '', service: '', budget: '', message: '' })
    setClientErrors({})
  }

  React.useEffect(() => {
    if (state?.status !== 'success') return
    formRef.current?.reset()
  }, [state])

  // Bring the confirmation (and its sent-message recap) into view on success —
  // otherwise it renders below the fold where the submit button was.
  React.useEffect(() => {
    if (state?.status !== 'success') return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    successRef.current?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    })
  }, [state])

  const errors: FieldErrors = {
    ...clientErrors,
    ...firstErrors(state?.status === 'error' ? state.fieldErrors : undefined),
  }

  const set = (patch: Partial<typeof values>) => setValues((prev) => ({ ...prev, ...patch }))

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
      const fieldErrors = firstErrors(
        parsed.error.flatten().fieldErrors as Record<string, string[]>,
      )
      setClientErrors(fieldErrors)
      // Focus the first invalid row so keyboard users land where the work is.
      const order = ['name', 'email', 'company', 'service', 'budget', 'message'] as const
      const first = order.find((key) => fieldErrors[key])
      if (first) {
        requestAnimationFrame(() => {
          fieldRefs.current[first]?.focus()
          fieldRefs.current[first]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        })
      }
      return
    }

    setClientErrors({})
    setPendingSummary({ ...values })
  }

  if (state?.status === 'success') {
    return (
      <div ref={successRef} className="scroll-mt-24 border border-border bg-card/40 p-8 md:p-12">
        <p className="label text-brand">Enquiry sent</p>
        <h2 className="mt-4 display-md">We&apos;ll be in touch within two working days.</h2>
        <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground" role="status">
          {state.message}
        </p>

        {sentSummary ? (
          <div className="mt-8 border-t border-border pt-8">
            <p className="label text-[0.6rem] text-muted-foreground">What you sent</p>
            <dl className="mt-4 space-y-3 text-[15px] leading-relaxed">
              <div className="flex gap-4">
                <dt className="w-20 shrink-0 label text-[0.6rem] text-muted-foreground">From</dt>
                <dd>
                  {sentSummary.name} · {sentSummary.email}
                </dd>
              </div>
              {sentSummary.service ? (
                <div className="flex gap-4">
                  <dt className="w-20 shrink-0 label text-[0.6rem] text-muted-foreground">Needs</dt>
                  <dd>{sentSummary.service}</dd>
                </div>
              ) : null}
              <div className="flex gap-4">
                <dt className="w-20 shrink-0 label text-[0.6rem] text-muted-foreground">Message</dt>
                <dd className="max-w-xl whitespace-pre-wrap text-muted-foreground">
                  {sentSummary.message}
                </dd>
              </div>
            </dl>
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <form ref={formRef} action={action} onSubmit={handleSubmit} noValidate>
      {/* Honeypot: off-screen, unfocusable, rejected by the schema. */}
      <div aria-hidden="true" className="absolute h-px w-px overflow-hidden opacity-0">
        <label htmlFor="ledger-zx9q">Do not fill this in</label>
        <input id="ledger-zx9q" name="zx9q" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="divide-y divide-border border-y border-border">
        <LedgerRow index="01" label="Your name" required error={errors.name}>
          <input
            ref={(el) => {
              fieldRefs.current.name = el
            }}
            id="ledger-name"
            name="name"
            type="text"
            value={values.name}
            onChange={(event) => set({ name: event.target.value })}
            placeholder="Alex Parker"
            autoComplete="name"
            aria-invalid={errors.name ? true : undefined}
            className="w-full bg-transparent py-2 text-lg outline-none placeholder:text-muted-foreground/50"
          />
        </LedgerRow>

        <LedgerRow index="02" label="Email" required error={errors.email}>
          <input
            ref={(el) => {
              fieldRefs.current.email = el
            }}
            id="ledger-email"
            name="email"
            type="email"
            inputMode="email"
            value={values.email}
            onChange={(event) => set({ email: event.target.value })}
            placeholder="alex@company.com"
            autoComplete="email"
            aria-invalid={errors.email ? true : undefined}
            className="w-full bg-transparent py-2 text-lg outline-none placeholder:text-muted-foreground/50"
          />
        </LedgerRow>

        <LedgerRow index="03" label="Company" optional error={errors.company}>
          <input
            ref={(el) => {
              fieldRefs.current.company = el
            }}
            id="ledger-company"
            name="company"
            type="text"
            value={values.company}
            onChange={(event) => set({ company: event.target.value })}
            placeholder="Company name"
            autoComplete="organization"
            aria-invalid={errors.company ? true : undefined}
            className="w-full bg-transparent py-2 text-lg outline-none placeholder:text-muted-foreground/50"
          />
        </LedgerRow>

        <LedgerRow index="04" label="What do you need" optional error={errors.service}>
          <div className="flex flex-wrap gap-2 py-1" role="group" aria-label="What do you need">
            {[
              { title: 'Not sure yet', value: '' },
              ...services.map((s) => ({ title: s.title, value: s.title })),
            ].map((option) => (
              <button
                key={option.title}
                type="button"
                aria-pressed={values.service === option.value}
                onClick={() => set({ service: option.value })}
                className={cn(
                  'min-h-10 border px-4 font-mono text-[11px] tracking-[0.08em] uppercase transition-colors',
                  values.service === option.value
                    ? 'border-brand bg-brand text-brand-foreground'
                    : 'border-border text-muted-foreground hover:border-border-strong hover:text-foreground',
                )}
              >
                {option.title}
              </button>
            ))}
          </div>
          <input type="hidden" name="service" value={values.service} />
        </LedgerRow>

        <LedgerRow index="05" label="Budget range" optional error={errors.budget}>
          <div className="flex flex-wrap gap-2 py-1" role="group" aria-label="Budget range">
            {BUDGET_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={values.budget === option.value}
                onClick={() => set({ budget: option.value })}
                className={cn(
                  'min-h-10 border px-4 font-mono text-[11px] tracking-[0.08em] uppercase transition-colors',
                  values.budget === option.value
                    ? 'border-brand bg-brand text-brand-foreground'
                    : 'border-border text-muted-foreground hover:border-border-strong hover:text-foreground',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <input type="hidden" name="budget" value={values.budget} />
        </LedgerRow>

        <LedgerRow index="06" label="The project" required error={errors.message}>
          <textarea
            ref={(el) => {
              fieldRefs.current.message = el
            }}
            id="ledger-message"
            name="message"
            value={values.message}
            onChange={(event) => set({ message: event.target.value })}
            placeholder="What are you building, what is in the way, and when do you need it working?"
            rows={5}
            aria-invalid={errors.message ? true : undefined}
            className="w-full resize-y bg-transparent py-2 text-lg leading-relaxed outline-none placeholder:text-muted-foreground/50"
          />
        </LedgerRow>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={pending}
          aria-disabled={pending}
          className="inline-flex h-[52px] items-center justify-center gap-2.5 bg-foreground px-8 font-mono text-[11px] tracking-[0.25em] text-background uppercase transition-colors hover:bg-foreground/85 disabled:pointer-events-none disabled:opacity-50"
        >
          {pending ? 'Sending…' : 'Send enquiry'}
          <span aria-hidden="true">→</span>
        </button>

        <p
          role="status"
          aria-live="polite"
          className={cn(
            'min-h-5 text-sm outline-none',
            state?.status === 'error' && 'text-destructive',
          )}
        >
          {state?.status === 'error' ? state.message : 'We reply within two working days.'}
        </p>
      </div>
    </form>
  )
}

/**
 * One ledger row: ordinal, label and an underline field. The field itself
 * carries the bottom hairline, which brightens to the brand lime on
 * focus-within — the
 * whole row reads as a single line item rather than a boxed card.
 */
function LedgerRow({
  index,
  label,
  required,
  optional,
  error,
  children,
}: {
  index: string
  label: string
  required?: boolean
  optional?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-2 py-7 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] sm:gap-8">
      <div>
        <p className="flex items-baseline gap-3">
          <span className="label text-[0.6rem] text-brand tabular-nums">{index}</span>
          <span className="label text-[0.6rem] text-muted-foreground">
            {label}
            {required ? (
              <span aria-hidden="true" className="text-brand">
                {' '}
                *
              </span>
            ) : null}
            {optional ? <span className="sr-only"> (optional)</span> : null}
            <span className="sr-only">
              {required ? ', required' : optional ? ', optional' : ''}
            </span>
          </span>
        </p>
        {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
      </div>

      <div className="border-b border-border pb-3 transition-colors focus-within:border-brand">
        {children}
      </div>
    </div>
  )
}
