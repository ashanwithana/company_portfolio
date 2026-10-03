import { describe, expect, it } from 'vitest'

import {
  aiCaseStudies,
  aiPrinciples,
  getAiCaseStudy,
  getRagPattern,
  modelProviders,
  ragPatterns,
} from './ai'

describe('modelProviders', () => {
  it('names at least one model per provider', () => {
    for (const provider of modelProviders) {
      expect(provider.models.length).toBeGreaterThan(0)
    }
  })

  it('states a downside for every provider', () => {
    // A vendor list that only upsells is a sales page, not an engineering
    // reference. Every entry must carry an honest "avoid when".
    for (const provider of modelProviders) {
      expect(provider.avoidWhen.length).toBeGreaterThan(20)
    }
  })
})

describe('ragPatterns', () => {
  it('has unique slugs', () => {
    const slugs = ragPatterns.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('documents a trade-off for every pattern', () => {
    for (const pattern of ragPatterns) {
      expect(pattern.tradeoff.length).toBeGreaterThan(20)
    }
  })

  it('is ordered from simplest to most complex', () => {
    expect(ragPatterns[0]?.slug).toBe('naive-rag')
  })

  it('resolves by slug', () => {
    expect(getRagPattern('hybrid-rag')?.name).toBe('Hybrid retrieval')
    expect(getRagPattern('nope')).toBeUndefined()
  })
})

describe('aiPrinciples', () => {
  it('pairs every principle with checkable evidence', () => {
    for (const principle of aiPrinciples) {
      expect(principle.evidence.length).toBeGreaterThan(20)
    }
  })
})

describe('aiCaseStudies', () => {
  it('has unique slugs', () => {
    const slugs = aiCaseStudies.map((s) => s.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('publishes at least one accuracy metric per case study', () => {
    // Every AI engagement is gated behind a measured number, so a case study
    // without one would contradict the practice page.
    for (const study of aiCaseStudies) {
      const hasQualityMetric = study.metrics.some(
        (m) => /accuracy|precision|recall/i.test(m.label) || /%/.test(m.value),
      )
      expect(hasQualityMetric).toBe(true)
    }
  })

  it('resolves by slug', () => {
    expect(getAiCaseStudy(aiCaseStudies[0]!.slug)).toBeDefined()
    expect(getAiCaseStudy('nope')).toBeUndefined()
  })
})
