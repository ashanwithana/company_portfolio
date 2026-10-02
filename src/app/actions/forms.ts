'use server'

import {
  contactSchema,
  newsletterSchema,
  toFieldErrors,
  type ContactInput,
  type ContactResult,
} from '@/lib/validation'

/**
 * Form Server Actions.
 *
 * Validation always runs server-side — the client pass is a UX affordance, not
 * a security boundary. Replace each `deliver` body with a real transport; the
 * surrounding contract stays the same.
 */

export type ContactState = ContactResult | null
export type NewsletterState = ContactResult | null

const TIMEOUT_MS = 10_000

async function postJson(endpoint: string, payload: unknown, signal: AbortSignal) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
    cache: 'no-store',
  })

  return response.ok
}

/** Contact enquiries. */
async function deliverEnquiry(input: ContactInput): Promise<ContactResult> {
  const endpoint = process.env.CONTACT_FORM_ENDPOINT

  if (!endpoint) {
    console.warn('[contact] CONTACT_FORM_ENDPOINT is not set. Enquiry not sent:', {
      name: input.name,
      email: input.email,
      service: input.service ?? 'unspecified',
    })

    return process.env.NODE_ENV === 'development'
      ? {
          status: 'success',
          message: 'Looks good! (Dev mode — no mail provider configured, so nothing was sent.)',
        }
      : {
          status: 'error',
          message: 'The contact form is not configured. Please email us directly instead.',
          fieldErrors: {},
        }
  }

  try {
    const ok = await postJson(endpoint, input, AbortSignal.timeout(TIMEOUT_MS))

    return ok
      ? { status: 'success', message: 'Message sent — we will reply within two working days.' }
      : {
          status: 'error',
          message: 'Something went wrong sending your message. Please email us instead.',
          fieldErrors: {},
        }
  } catch (error) {
    // Never leak a stack trace or internal URL to a visitor.
    console.error('[contact] delivery failed:', error)

    return {
      status: 'error',
      message: 'Could not reach the mail service. Please email us directly.',
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
    company: formData.get('company') ?? '',
    service: formData.get('service') ?? '',
    budget: formData.get('budget') ?? '',
    message: formData.get('message'),
    website: formData.get('website') ?? '',
  })

  if (!parsed.success) {
    return { status: 'error', ...toFieldErrors(parsed.error) }
  }

  return deliverEnquiry(parsed.data)
}

/** Newsletter signups. */
export async function subscribeAction(
  _previousState: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const parsed = newsletterSchema.safeParse({
    email: formData.get('email'),
    website: formData.get('website') ?? '',
  })

  if (!parsed.success) {
    return { status: 'error', ...toFieldErrors(parsed.error) }
  }

  const endpoint = process.env.NEWSLETTER_ENDPOINT

  if (!endpoint) {
    if (process.env.NODE_ENV !== 'development') {
      return {
        status: 'error',
        message: 'Subscriptions are not configured right now.',
        fieldErrors: {},
      }
    }

    console.warn('[newsletter] NEWSLETTER_ENDPOINT is not set.');
    return { status: 'success', message: 'Subscribed! (Dev mode — nothing was actually sent.)' }
  }

  try {
    const ok = await postJson(endpoint, parsed.data, AbortSignal.timeout(TIMEOUT_MS))

    return ok
      ? { status: 'success', message: 'Subscribed — thank you.' }
      : { status: 'error', message: 'Could not subscribe. Please try again.', fieldErrors: {} }
  } catch (error) {
    console.error('[newsletter] subscription failed:', error)
    return { status: 'error', message: 'Could not subscribe. Please try again.', fieldErrors: {} }
  }
}
