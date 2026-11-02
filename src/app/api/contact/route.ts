import { contactSchema, type ContactInput, type ContactResult } from '@/lib/validation'

const TIMEOUT_MS = 10_000

async function postJson(endpoint: string, payload: unknown, signal: AbortSignal) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
    cache: 'no-store',
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '<unreadable>')
    console.error(`[contact] EmailJS rejected the send (${response.status}):`, detail)
  }

  return response.ok
}

/** Contact enquiries, delivered through EmailJS. */
async function deliverEnquiry(input: ContactInput): Promise<ContactResult> {
  const serviceId = process.env.EMAILJS_SERVICE_ID
  const templateId = process.env.EMAILJS_TEMPLATE_ID
  const publicKey = process.env.EMAILJS_PUBLIC_KEY
  const privateKey = process.env.EMAILJS_PRIVATE_KEY

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    console.warn('[contact] EmailJS is not configured. Enquiry not sent:', {
      name: input.name,
      email: input.email,
      service: input.service ?? 'unspecified',
    })

    return process.env.NODE_ENV === 'development'
      ? {
          status: 'success',
          message: 'Looks good! (Dev mode — EmailJS is not configured, so nothing was sent.)',
        }
      : {
          status: 'error',
          message: 'The contact form is not configured. Please email us directly instead.',
          fieldErrors: {},
        }
  }

  const budgetLabels: Record<string, string> = {
    'under-1k': 'Under $1k',
    '1k-2.5k': '$1k – $2.5k',
    'over-2.5k': 'More than $2.5k',
    'lets-talk': "Let's talk about it",
  }

  try {
    const ok = await postJson(
      'https://api.emailjs.com/api/v1.0/email/send',
      {
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey,
        template_params: {
          from_name: input.name,
          reply_to: input.email,
          company: input.company || '—',
          service: input.service || 'Not sure yet',
          budget: budgetLabels[input.budget ?? ''] ?? 'Not sure yet',
          message: input.message,
        },
      },
      AbortSignal.timeout(TIMEOUT_MS),
    )

    return ok
      ? { status: 'success', message: 'Message sent — we will reply within two working days.' }
      : {
          status: 'error',
          message: 'Something went wrong sending your message. Please email us instead.',
          fieldErrors: {},
        }
  } catch (error) {
    console.error('[contact] delivery failed:', error)

    return {
      status: 'error',
      message: 'Could not reach the mail service. Please email us directly.',
      fieldErrors: {},
    }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const parsed = contactSchema.safeParse({
      name: body.name,
      email: body.email,
      company: body.company ?? '',
      service: body.service ?? '',
      budget: body.budget ?? '',
      message: body.message,
      zx9q: body.zx9q ?? '',
    })

    if (!parsed.success) {
      return Response.json(
        { status: 'error', fieldErrors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const result = await deliverEnquiry(parsed.data)
    return Response.json(result)
  } catch (error) {
    console.error('[contact] API error:', error)
    return Response.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 },
    )
  }
}
