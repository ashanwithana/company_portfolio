'use server'

import {
  contactSchema,
  toFieldErrors,
  type ContactInput,
  type ContactResult,
} from '@/lib/validation'

/**
 * Contact form submission.
 *
 * Validation always runs here — the client-side Zod pass is a UX affordance,
 * not a security boundary. Replace `deliver` with a real transport (Resend,
 * Web3Forms, SES, …) to go live; the surrounding contract stays the same.
 */

export type ContactState = ContactResult | null

const TIMEOUT_MS = 10_000

async function deliver(input: ContactInput): Promise<ContactResult> {
  const endpoint = process.env.CONTACT_FORM_ENDPOINT

  if (!endpoint) {
    // No transport configured. Fail loudly rather than pretending the message
    // was delivered — a silently-dropped enquiry is worse than a clear error.
    console.warn('[contact] CONTACT_FORM_ENDPOINT is not set. Message not sent:', {
      name: input.name,
      email: input.email,
      messageLength: input.message.length,
    })

    return process.env.NODE_ENV === 'development'
      ? {
          status: 'success',
          message: 'Looks good! (Dev mode — no mail provider configured, so nothing was sent.)',
        }
      : {
          status: 'error',
          message: 'The contact form is not configured. Please email me directly instead.',
          fieldErrors: {},
        }
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    })

    if (!response.ok) {
      return {
        status: 'error',
        message: 'Something went wrong sending your message. Try emailing me instead.',
        fieldErrors: {},
      }
    }

    return { status: 'success', message: 'Message sent — I’ll reply within 24 hours.' }
  } catch (error) {
    // Timeouts and network failures both land here; neither should leak a
    // stack trace or internal URL to the visitor.
    console.error('[contact] delivery failed:', error)

    return {
      status: 'error',
      message: 'Could not reach the mail service. Please email me directly.',
      fieldErrors: {},
    }
  }
}

export async function submitContactAction(
  _previousState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
    website: formData.get('website') ?? '',
  })

  if (!parsed.success) {
    return { status: 'error', ...toFieldErrors(parsed.error) }
  }

  return deliver(parsed.data)
}
