import { describe, expect, it } from 'vitest'

import { contactSchema, firstErrors, toFieldErrors, validateContact } from './validation'

const valid = {
  name: 'Alex Parker',
  email: 'alex@example.com',
  message: 'I would like to discuss a new product with you.',
}

describe('contactSchema', () => {
  it('accepts a well-formed payload', () => {
    const result = contactSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('trims surrounding whitespace before validating', () => {
    const result = contactSchema.parse({ ...valid, name: '  Alex Parker  ' })
    expect(result.name).toBe('Alex Parker')
  })

  it.each([
    ['a too-short name', { ...valid, name: 'A' }, 'name'],
    ['an invalid email', { ...valid, email: 'not-an-email' }, 'email'],
    ['a too-short message', { ...valid, message: 'hi' }, 'message'],
  ])('rejects %s', (_label, payload, field) => {
    const result = contactSchema.safeParse(payload)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === field)).toBe(true)
    }
  })

  it('rejects any honeypot value', () => {
    const result = contactSchema.safeParse({ ...valid, website: 'http://spam.example' })
    expect(result.success).toBe(false)
  })

  it('accepts an empty honeypot', () => {
    expect(contactSchema.safeParse({ ...valid, website: '' }).success).toBe(true)
  })

  it('defaults a missing honeypot to an empty string', () => {
    expect(contactSchema.parse(valid).website).toBe('')
  })
})

describe('validateContact', () => {
  it('returns parsed data on success', () => {
    const result = validateContact(valid)
    expect(result).toEqual({ ok: true, data: expect.objectContaining(valid) })
  })

  it('groups issues by field on failure', () => {
    const result = validateContact({ ...valid, email: 'nope', name: 'A' })

    // Narrow with the same discriminant the components use at runtime.
    expect('status' in result && result.status).toBe('error')
    if ('fieldErrors' in result) {
      expect(result.fieldErrors.email).toBeDefined()
      expect(result.fieldErrors.name).toBeDefined()
    }
  })
})

describe('toFieldErrors', () => {
  it('separates field-level and form-level issues', () => {
    const schema = contactSchema
    const parsed = schema.safeParse({ email: 'bad', name: 'A', message: 'short' })

    expect(parsed.success).toBe(false)
    if (!parsed.success) {
      const { fieldErrors } = toFieldErrors(parsed.error)
      expect(Object.keys(fieldErrors).sort()).toEqual(['email', 'message', 'name'])
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
