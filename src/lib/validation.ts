import { z } from 'zod'

/**
 * Contact form validation.
 *
 * A single schema is shared by the client (instant feedback) and the server
 * action (the actual trust boundary). Keeping one source of truth means the two
 * can never drift apart.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please enter at least 2 characters.')
    .max(80, 'Please keep this under 80 characters.'),
  email: z.email('Please enter a valid email address.').max(160, 'That email is too long.'),
  message: z
    .string()
    .trim()
    .min(10, 'Please add a little more detail (10+ characters).')
    .max(4000, 'Please keep this under 4000 characters.'),
  /**
   * Honeypot. Bots fill hidden fields; humans never see them. The `max(0)`
   * constraint means any value at all fails validation.
   */
  website: z.string().max(0, 'Spam detected.').optional().default(''),
})

export type ContactInput = z.infer<typeof contactSchema>

export type ContactResult =
  | { status: 'success'; message: string }
  | { status: 'error'; message: string; fieldErrors: Record<string, string[]> }

export type FieldErrors = Partial<Record<'name' | 'email' | 'message', string>>

/** Validate a payload and flatten Zod issues into a field → messages map. */
export function validateContact(
  payload: unknown,
): { ok: true; data: ContactInput } | ContactResult {
  const result = contactSchema.safeParse(payload)

  if (result.success) {
    return { ok: true, data: result.data }
  }

  return { status: 'error', ...toFieldErrors(result.error) }
}

/**
 * Convert a `ZodError` into our transport shape.
 *
 * Zod keys issues by field path; anything without a string path is a
 * form-level problem, which is surfaced via `formErrors` instead.
 */
export function toFieldErrors(error: z.ZodError): {
  message: string
  fieldErrors: Record<string, string[]>
  formErrors: string[]
} {
  const fieldErrors: Record<string, string[]> = {}
  const formErrors: string[] = []

  for (const issue of error.issues) {
    const key = issue.path[0]

    if (typeof key === 'string') {
      ;(fieldErrors[key] ??= []).push(issue.message)
    } else {
      formErrors.push(issue.message)
    }
  }

  return {
    message: 'Please check the highlighted fields and try again.',
    fieldErrors,
    formErrors,
  }
}

/** Reduce a field → messages map to a single message per field. */
export function firstErrors(fieldErrors?: Record<string, string[]>): FieldErrors {
  const out: FieldErrors = {}

  for (const [field, messages] of Object.entries(fieldErrors ?? {})) {
    const message = messages[0]
    if (message) out[field as keyof FieldErrors] = message
  }

  return out
}
