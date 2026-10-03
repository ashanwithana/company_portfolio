import { describe, expect, it } from 'vitest'

import {
  caseStudyCategories,
  caseStudies,
  filterCaseStudies,
  getCaseStudy,
  publishedCaseStudies,
} from './case-studies'

describe('case studies', () => {
  it('has unique slugs', () => {
    const slugs = caseStudies.map((s) => s.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('keeps client names and case-study detail free of stale links', () => {
    // The detail page renders client and tech, never a bare href — a stale
    // external URL is the usual way a case study rots.
    for (const study of caseStudies) {
      expect(study.client).toBeTruthy()
      for (const tech of study.tech) {
        expect(tech.startsWith('http')).toBe(false)
      }
    }
  })

  it('reports at least three metrics per study', () => {
    for (const study of caseStudies) {
      expect(study.metrics.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('documents a multi-step approach and an outcome', () => {
    for (const study of caseStudies) {
      expect(study.approach.length).toBeGreaterThanOrEqual(3)
      expect(study.outcome.length).toBeGreaterThan(40)
    }
  })

  it('uses a known category', () => {
    const known = caseStudyCategories.filter((c) => c !== 'all')
    for (const study of caseStudies) {
      expect(known).toContain(study.category)
    }
  })

  it('resolves by slug', () => {
    expect(getCaseStudy(caseStudies[0]!.slug)).toBeDefined()
    expect(getCaseStudy('nope')).toBeUndefined()
  })
})

describe('filterCaseStudies', () => {
  it('returns everything for "all"', () => {
    expect(filterCaseStudies('all')).toHaveLength(publishedCaseStudies().length)
  })

  it.each(['product', 'platform', 'brand'] as const)('returns only %s studies', (category) => {
    const result = filterCaseStudies(category)
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((s) => s.category === category)).toBe(true)
  })

  it('never loses a study across the filters', () => {
    const union = caseStudyCategories
      .filter((c) => c !== 'all')
      .flatMap((c) => filterCaseStudies(c))
      .map((s) => s.slug)

    expect(new Set(union).size).toBe(publishedCaseStudies().length)
  })
})
