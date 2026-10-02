import { describe, expect, it } from 'vitest'

import { filterProjects, projectCategories, projects, workFilters } from './projects'

describe('project data', () => {
  it('exposes unique slugs', () => {
    const slugs = projects.map((project) => project.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('gives every project a non-empty title, description and tech list', () => {
    for (const project of projects) {
      expect(project.title.length).toBeGreaterThan(0)
      expect(project.description.length).toBeGreaterThan(0)
      expect(project.tech.length).toBeGreaterThan(0)
    }
  })

  it('only links out over https', () => {
    for (const project of projects) {
      expect(project.href.startsWith('https://')).toBe(true)
    }
  })

  it('assigns every project a known category', () => {
    const known = projectCategories.filter((c) => c !== 'all')
    for (const project of projects) {
      expect(known).toContain(project.category)
    }
  })
})

describe('filterProjects', () => {
  it('returns everything for the "all" filter', () => {
    expect(filterProjects('all')).toHaveLength(projects.length)
  })

  it.each(['web', 'ai', 'oss'] as const)('returns only %s projects', (category) => {
    const result = filterProjects(category)
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((project) => project.category === category)).toBe(true)
  })

  it('never loses a project across the filters', () => {
    const union = projectCategories
      .filter((c) => c !== 'all')
      .flatMap((c) => filterProjects(c))
      .map((p) => p.slug)

    expect(new Set(union).size).toBe(projects.length)
  })
})

describe('workFilters', () => {
  it('covers every filter value exactly once', () => {
    expect(workFilters.map((f) => f.value).sort()).toEqual([...projectCategories].sort())
  })
})
