import { z } from 'zod'

/**
 * Shared form validation schemas.
 *
 * One schema per form, used by both the client (instant feedback) and the
 * Server Action (the actual trust boundary), so the two can never disagree.
 */

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please enter at least 2 characters.')
    .max(80, 'Please keep this under 80 characters.'),
  email: z.email('Please enter a valid email address.').max(160, 'That email is too long.'),
  company: z.string().trim().max(120, 'Please keep this under 120 characters.').optional(),
  /** Which service the enquiry relates to. Optional — free-form enquiries exist. */
  service: z.string().trim().max(80).optional(),
  budget: z.enum(['', 'under-25k', '25k-60k', '60k-150k']).optional(),
  message: z
    .string()
    .trim()
    .min(20, 'Please tell us a little more (20+ characters).')
    .max(4000, 'Please keep this under 4000 characters.'),
  /**
   * Honeypot. Bots fill hidden fields; humans never see them. `max(0)` means any
   * value at all fails validation. The field name is deliberately meaningless —
   * a plausible name like "website" gets filled by browser autofill, which
   * would trap real visitors with an error on a field they cannot see.
   */
  zx9q: z.string().max(0, 'Spam detected.').optional().default(''),
})

export type ContactInput = z.infer<typeof contactSchema>

export const newsletterSchema = z.object({
  email: z.email('Please enter a valid email address.'),
  zx9q: z.string().max(0, 'Spam detected.').optional().default(''),
})

export type NewsletterInput = z.infer<typeof newsletterSchema>

export type ContactResult =
  | { status: 'success'; message: string }
  | { status: 'error'; message: string; fieldErrors: Record<string, string[]> }

export type FieldErrors = Partial<
  Record<'name' | 'email' | 'company' | 'service' | 'budget' | 'message', string>
>

/**
 * Convert a `ZodError` into our transport shape.
 *
 * Zod keys issues by field path; anything without a string path is a form-level
 * problem and is reported through `message` instead.
 */
export function toFieldErrors(error: z.ZodError): {
  message: string
  fieldErrors: Record<string, string[]>
} {
  const fieldErrors: Record<string, string[]> = {}

  for (const issue of error.issues) {
    const key = issue.path[0]
    if (typeof key === 'string') {
      ;(fieldErrors[key] ??= []).push(issue.message)
    }
  }

  return {
    message: 'Please check the highlighted fields and try again.',
    fieldErrors,
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
