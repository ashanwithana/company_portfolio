import { describe, expect, it } from 'vitest'

import { marqueeItems, skillGroups } from './skills'
import { timeline } from './timeline'

describe('skillGroups', () => {
  it('has unique group names', () => {
    const names = skillGroups.map((g) => g.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it('gives every group at least one tool', () => {
    for (const group of skillGroups) {
      expect(group.items.length).toBeGreaterThan(0)
    }
  })
})

describe('marqueeItems', () => {
  it('is non-empty so the ticker has content', () => {
    expect(marqueeItems.length).toBeGreaterThan(0)
  })

  it('uses a subset of the declared skills', () => {
    const declared = new Set(skillGroups.flatMap((group) => group.items))
    for (const item of marqueeItems) {
      expect(declared.has(item)).toBe(true)
    }
  })
})

describe('timeline', () => {
  it('has unique ids', () => {
    const ids = timeline.map((entry) => entry.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('marks at most one entry as current', () => {
    expect(timeline.filter((entry) => entry.current).length).toBeLessThanOrEqual(1)
  })

  it('fills in every field the component renders', () => {
    for (const entry of timeline) {
      expect(entry.period).toBeTruthy()
      expect(entry.title).toBeTruthy()
      expect(entry.org).toBeTruthy()
      expect(entry.body.length).toBeGreaterThan(10)
    }
  })
})
