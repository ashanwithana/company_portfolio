'use client'

import * as React from 'react'
import emailjs from '@emailjs/browser'
import { contactSchema, firstErrors, type FieldErrors, type ContactResult } from '@/lib/validation'
import { services } from '@/content/services'
import { cn } from '@/lib/utils'

// Initialize EmailJS
if (typeof window !== 'undefined') {
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''
  console.log('EmailJS Public Key:', publicKey)
  console.log('EmailJS Public Key Length:', publicKey.length)
  emailjs.init(publicKey)
}

const BUDGET_OPTIONS = [
  { value: 'under-1k', label: 'Under $1k' },
  { value: '1k-2.5k', label: '$1k – $2.5k' },
  { value: 'over-2.5k', label: 'More than $2.5k' },
  { value: 'lets-talk', label: "Let's talk about it" },
] as const

export function ContactForm() {
  const [state, setState] = React.useState<ContactResult | null>(null)
  const [pending, setPending] = React.useState(false)
  const [values, setValues] = React.useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    budget: '',
    message: '',
  })
  const [clientErrors, setClientErrors] = React.useState<FieldErrors>({})
  const [sentSummary, setSentSummary] = React.useState<typeof values | null>(null)
  const formRef = React.useRef<HTMLFormElement>(null)
  const successRef = React.useRef<HTMLDivElement>(null)

  const errors: FieldErrors = {
    ...clientErrors,
    ...firstErrors(state?.status === 'error' ? state.fieldErrors : undefined),
  }

  const set = (patch: Partial<typeof values>) => setValues((prev) => ({ ...prev, ...patch }))

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const parsed = contactSchema.safeParse({
      name: values.name,
      email: values.email,
      phone: values.phone,
      company: values.company,
      service: values.service,
      budget: values.budget,
      message: values.message,
      zx9q: '',
    })

    if (!parsed.success) {
      const fieldErrors = firstErrors(
        parsed.error.flatten().fieldErrors as Record<string, string[]>,
      )
      setClientErrors(fieldErrors)
      return
    }

    setClientErrors({})
    setSentSummary({ ...values })
    setPending(true)

    try {
      const budgetLabels: Record<string, string> = {
        'under-1k': 'Under $1k',
        '1k-2.5k': '$1k – $2.5k',
        'over-2.5k': 'More than $2.5k',
        'lets-talk': "Let's talk about it",
      }

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
        {
          from_name: parsed.data.name,
          reply_to: parsed.data.email,
          phone: parsed.data.phone || '—',
          company: parsed.data.company || '—',
          service: parsed.data.service || 'Not sure yet',
          budget: budgetLabels[parsed.data.budget ?? ''] ?? 'Not sure yet',
          message: parsed.data.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      )

      setState({
        status: 'success',
        message: 'Message sent — we will reply within two working days.',
      })

      setValues({ name: '', email: '', phone: '', company: '', service: '', budget: '', message: '' })
      formRef.current?.reset()
      successRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } catch (error) {
      console.error('EmailJS error:', error)
      setState({
        status: 'error',
        message: 'Could not send your message. Please email us directly.',
        fieldErrors: {},
      })
    } finally {
      setPending(false)
    }
  }

  if (state?.status === 'success') {
    return (
      <div ref={successRef} className="scroll-mt-24 border border-border bg-card/40 p-8 md:p-12">
        <p className="label text-brand">Enquiry sent</p>
        <h2 className="mt-4 display-md">We&apos;ll be in touch within two working days.</h2>
        <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground" role="status">
          {state.message}
        </p>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
      <div className="divide-y divide-border border-y border-border">
        <LedgerRow index="01" label="Your name" required error={errors.name}>
          <input
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

        <LedgerRow index="03" label="Phone" optional error={errors.phone}>
          <input
            id="ledger-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            value={values.phone}
            onChange={(event) => set({ phone: event.target.value })}
            placeholder="+1 (555) 123-4567"
            autoComplete="tel"
            aria-invalid={errors.phone ? true : undefined}
            className="w-full bg-transparent py-2 text-lg outline-none placeholder:text-muted-foreground/50"
          />
        </LedgerRow>

        <LedgerRow index="04" label="Company" optional error={errors.company}>
          <input
            id="ledger-company"
            name="company"
            type="text"
            value={values.company}
            onChange={(event) => set({ company: event.target.value })}
            placeholder="Company name"
            autoComplete="organization"
            className="w-full bg-transparent py-2 text-lg outline-none placeholder:text-muted-foreground/50"
          />
        </LedgerRow>

        <LedgerRow index="05" label="What do you need" optional error={errors.service}>
          <div className="flex flex-wrap gap-2 py-1" role="group" aria-label="What do you need">
            {[{ title: 'Not sure yet', value: '' }, ...services.map((s) => ({ title: s.title, value: s.title }))].map((option) => (
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
        </LedgerRow>

        <LedgerRow index="06" label="Budget range" optional error={errors.budget}>
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
        </LedgerRow>

        <LedgerRow index="07" label="The project" required error={errors.message}>
          <textarea
            id="ledger-message"
            name="message"
            value={values.message}
            onChange={(event) => set({ message: event.target.value })}
            placeholder="What are you building, what is in the way, and when do you need it working?"
            rows={5}
            className="w-full resize-y bg-transparent py-2 text-lg leading-relaxed outline-none placeholder:text-muted-foreground/50"
          />
        </LedgerRow>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-[52px] items-center justify-center gap-2.5 bg-foreground px-8 font-mono text-[11px] tracking-[0.25em] text-background uppercase transition-colors hover:bg-foreground/85 disabled:pointer-events-none disabled:opacity-50"
        >
          {pending ? 'Sending…' : 'Send enquiry'}
          <span aria-hidden="true">→</span>
        </button>

        <p role="status" aria-live="polite" className="min-h-5 text-sm text-muted-foreground">
          {state?.status === 'error' ? state.message : 'We reply within two working days.'}
        </p>
      </div>
    </form>
  )
}

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
