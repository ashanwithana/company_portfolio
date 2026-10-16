import { describe, expect, it } from 'vitest'

import { contactSchema, firstErrors, toFieldErrors } from './validation'

const valid = {
  name: 'Alex Parker',
  email: 'alex@example.com',
  company: 'Example Ltd',
  service: 'Web engineering',
  budget: '1k-2.5k' as const,
  message: 'We are rebuilding our platform and need help.',
}

describe('contactSchema', () => {
  it('accepts a well-formed payload', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true)
  })

  it('accepts a minimal payload with the optional fields empty', () => {
    const result = contactSchema.safeParse({ ...valid, company: '', service: '', budget: '' })
    expect(result.success).toBe(true)
  })

  it('trims surrounding whitespace before validating', () => {
    expect(contactSchema.parse({ ...valid, name: '  Alex Parker  ' }).name).toBe('Alex Parker')
  })

  it.each([
    ['a too-short name', { ...valid, name: 'A' }, 'name'],
    ['an invalid email', { ...valid, email: 'not-an-email' }, 'email'],
    ['a too-short message', { ...valid, message: 'too short' }, 'message'],
  ])('rejects %s', (_label, payload, field) => {
    const result = contactSchema.safeParse(payload)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === field)).toBe(true)
    }
  })

  it('rejects a budget outside the allowed set', () => {
    expect(contactSchema.safeParse({ ...valid, budget: 'free' }).success).toBe(false)
  })

  it('rejects any honeypot value', () => {
    expect(contactSchema.safeParse({ ...valid, zx9q: 'http://spam.example' }).success).toBe(false)
  })

  it('defaults a missing honeypot to an empty string', () => {
    expect(contactSchema.parse(valid).zx9q).toBe('')
  })
})

describe('toFieldErrors', () => {
  it('groups issues by field', () => {
    const parsed = contactSchema.safeParse({ ...valid, email: 'bad', name: 'A' })

    expect(parsed.success).toBe(false)
    if (!parsed.success) {
      const { fieldErrors } = toFieldErrors(parsed.error)
      expect(Object.keys(fieldErrors).sort()).toEqual(['email', 'name'])
    }
  })

  it('always returns a form-level message', () => {
    const parsed = contactSchema.safeParse({})
    if (!parsed.success) {
      expect(toFieldErrors(parsed.error).message).toBeTruthy()
    }
  })
})

describe('firstErrors', () => {
  it('keeps only the first message per field', () => {
    expect(firstErrors({ email: ['first', 'second'] })).toEqual({ email: 'first' })
  })

  it('returns an empty object when there are no errors', () => {
    expect(firstErrors(undefined)).toEqual({})
    expect(firstErrors({})).toEqual({})
  })
})
