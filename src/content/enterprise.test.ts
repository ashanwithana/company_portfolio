import { describe, expect, it } from 'vitest'

import {
  depthLabels,
  enterpriseCases,
  enterpriseCategories,
  getEnterpriseCase,
  platforms,
  platformsByCategory,
} from './enterprise'

describe('platforms', () => {
  it('has unique names', () => {
    const names = platforms.map((p) => p.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it('only uses https URLs where one is present', () => {
    for (const platform of platforms) {
      expect(platform.name).not.toMatch(/http:\/\//)
    }
  })

  it('labels every depth tier', () => {
    for (const platform of platforms) {
      expect(depthLabels[platform.depth]).toBeTruthy()
    }
  })

  it('assigns a known category to each platform', () => {
    const known = enterpriseCategories.filter((c) => c !== 'all')
    for (const platform of platforms) {
      expect(known).toContain(platform.category)
    }
  })

  it('filters by category without losing platforms', () => {
    const union = enterpriseCategories
      .filter((c) => c !== 'all')
      .flatMap((c) => platformsByCategory(c))
      .map((p) => p.name)

    expect(new Set(union).size).toBe(platforms.length)
  })
})

describe('enterpriseCases', () => {
  it('has unique slugs', () => {
    const slugs = enterpriseCases.map((c) => c.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('reports at least three measurable metrics per case study', () => {
    for (const study of enterpriseCases) {
      expect(study.metrics.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('documents a multi-step approach', () => {
    for (const study of enterpriseCases) {
      expect(study.approach.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('resolves by slug', () => {
    expect(getEnterpriseCase(enterpriseCases[0]!.slug)).toBeDefined()
    expect(getEnterpriseCase('nope')).toBeUndefined()
  })
})
