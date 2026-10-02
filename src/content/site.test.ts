import { describe, expect, it } from 'vitest'

import { navSections, siteConfig, socialLinks } from './site'

describe('siteConfig', () => {
  it('has an absolute, https URL', () => {
    expect(siteConfig.url.startsWith('https://')).toBe(true)
  })

  it('does not end with a trailing slash (it is used to build absolute URLs)', () => {
    expect(siteConfig.url.endsWith('/')).toBe(false)
  })

  it('looks like an email address', () => {
    expect(siteConfig.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  })
})

describe('navSections', () => {
  it('has unique ids', () => {
    const ids = navSections.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('gives every section a label, title and description', () => {
    for (const section of navSections) {
      expect(section.id).toBeTruthy()
      expect(section.label).toBeTruthy()
      expect(section.title.length).toBeGreaterThan(10)
      expect(section.description.length).toBeGreaterThan(10)
    }
  })
})

describe('socialLinks', () => {
  it('only uses secure external URLs', () => {
    for (const social of socialLinks) {
      expect(social.href.startsWith('https://')).toBe(true)
    }
  })

  it('has a label and handle for each network', () => {
    for (const social of socialLinks) {
      expect(social.label).toBeTruthy()
      expect(social.handle).toBeTruthy()
    }
  })
})
