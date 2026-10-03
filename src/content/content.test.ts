import { describe, expect, it } from 'vitest'

import { allRoutes, primaryNav, siteConfig, footerNav } from './site'
import { allBenefits, departments, getRole, roles, rolesByDepartment } from './roles'
import { differentiators, milestones, process, team, testimonials, values } from './company'
import { coverFor } from './covers'
import { services } from './services'
import { aiFaqs, careersFaqs, contactFaqs, servicesFaqs } from './faqs'
import { getAllPosts } from './posts-index'
import { adjacentPosts, collectTags, formatPostDate, sortPosts } from './posts'

describe('siteConfig', () => {
  it('has an absolute https URL with no trailing slash', () => {
    expect(siteConfig.url.startsWith('https://')).toBe(true)
    expect(siteConfig.url.endsWith('/')).toBe(false)
  })

  it('looks like an email address', () => {
    expect(siteConfig.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  })

  it('has a complete postal address', () => {
    expect(siteConfig.address.street).toBeTruthy()
    expect(siteConfig.address.postalCode).toBeTruthy()
    expect(siteConfig.address.countryName).toBeTruthy()
  })
})

describe('navigation', () => {
  it('has unique hrefs', () => {
    const hrefs = allRoutes.map((r) => r.href)
    expect(new Set(hrefs).size).toBe(hrefs.length)
  })

  it('superset: allRoutes includes every primary nav entry', () => {
    for (const item of primaryNav) {
      expect(allRoutes).toContainEqual(item)
    }
  })

  it('keeps the header nav short enough to fit one row', () => {
    // Six items is the practical limit for a single pill at desktop widths.
    expect(primaryNav.length).toBeLessThanOrEqual(6)
  })

  it('links only to internal routes', () => {
    for (const item of allRoutes) {
      expect(item.href.startsWith('/')).toBe(true)
    }
  })
})

describe('socials', () => {
  it('only uses secure external URLs', () => {
    for (const url of Object.values(siteConfig.socials)) {
      expect(url.startsWith('https://')).toBe(true)
    }
  })

  it('exposes a GitHub, LinkedIn and X profile', () => {
    expect(siteConfig.socials.github).toBeTruthy()
    expect(siteConfig.socials.linkedin).toBeTruthy()
    expect(siteConfig.socials.x).toBeTruthy()
  })
})

describe('footerNav', () => {
  it('only links to internal routes', () => {
    for (const column of Object.values(footerNav)) {
      for (const link of column) {
        expect(link.href.startsWith('/')).toBe(true)
      }
    }
  })
})

describe('services', () => {
  it('has unique slugs', () => {
    const slugs = services.map((s) => s.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('covers the enterprise and AI tracks that have their own pages', () => {
    const slugs = services.map((s) => s.slug)
    expect(slugs).toContain('enterprise-systems')
    expect(slugs).toContain('ai-engineering')
  })

  it('gives every renderable service the full detail-page content', () => {
    // The detail template renders approach rows, a stack strip and honesty
    // cards. A service without them would ship an empty section, so the
    // content — not the template — owns the guarantee. Specialist tracks are
    // exempt: their depth lives on the canonical practice pages.
    for (const service of services) {
      if (service.canonicalHref) continue
      expect(service.deliverables.length).toBeGreaterThanOrEqual(4)
      expect(service.approach!.length).toBeGreaterThanOrEqual(3)
      expect(service.stack!.length).toBeGreaterThanOrEqual(4)
      expect(service.wrongWhen!.length).toBeGreaterThanOrEqual(2)

      for (const step of service.approach!) {
        expect(step.name).toBeTruthy()
        expect(step.summary.length).toBeGreaterThan(20)
        expect(step.detail.length).toBeGreaterThan(60)
      }
      for (const item of service.wrongWhen!) {
        expect(item.title).toBeTruthy()
        expect(item.body.length).toBeGreaterThan(60)
      }
    }
  })
})

describe('roles', () => {
  it('has unique slugs', () => {
    const slugs = roles.map((r) => r.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('assigns a known department', () => {
    for (const role of roles) {
      expect(departments).toContain(role.department)
    }
  })

  it('has responsibilities and requirements for every role', () => {
    for (const role of roles) {
      expect(role.responsibilities.length).toBeGreaterThan(0)
      expect(role.requirements.length).toBeGreaterThan(0)
    }
  })

  it('groups without losing roles', () => {
    const grouped = rolesByDepartment().flatMap((g) => g.roles)
    expect(grouped).toHaveLength(roles.length)
  })

  it('resolves by slug', () => {
    expect(getRole(roles[0]!.slug)).toBeDefined()
    expect(getRole('nope')).toBeUndefined()
  })

  it('returns a de-duplicated, bounded benefits list', () => {
    const benefits = allBenefits()
    expect(new Set(benefits).size).toBe(benefits.length)
    expect(benefits.length).toBeLessThanOrEqual(6)
  })
})

describe('company content', () => {
  it('has unique team member names', () => {
    const names = team.map((m) => m.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it('gives every team member a role and bio', () => {
    for (const member of team) {
      expect(member.role).toBeTruthy()
      expect(member.bio.length).toBeGreaterThan(20)
      expect(member.initials).toMatch(/^[A-Z]{2,3}$/)
    }
  })

  it('documents values and process steps', () => {
    expect(values.length).toBeGreaterThan(0)
    expect(process.length).toBeGreaterThan(0)
    expect(milestones.length).toBeGreaterThan(0)
  })

  it('has verifiable testimonials', () => {
    // A quote without attribution is marketing copy. Every testimonial must
    // name a person and a company, and link to the case study behind it.
    for (const testimonial of testimonials) {
      expect(testimonial.quote.length).toBeGreaterThan(40)
      expect(testimonial.name).toBeTruthy()
      expect(testimonial.role).toBeTruthy()
      expect(testimonial.company).toBeTruthy()
      expect(testimonial.caseStudySlug).toBeTruthy()
    }

    const names = testimonials.map((t) => t.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it('states differentiators as commitments, not adjectives', () => {
    expect(differentiators.length).toBeGreaterThanOrEqual(3)
    for (const item of differentiators) {
      expect(item.title).toBeTruthy()
      expect(item.body.length).toBeGreaterThan(20)
    }
  })

  it('links every testimonial to a published case study', async () => {
    // A "read the case study" link that 404s is worse than no link. This
    // joins the two content modules so a renamed slug fails the build.
    const { getCaseStudy, publishedCaseStudies } = await import('./case-studies')
    const published = new Set(publishedCaseStudies().map((s) => s.slug))

    for (const testimonial of testimonials) {
      expect(testimonial.caseStudySlug).toBeTruthy()
      expect(getCaseStudy(testimonial.caseStudySlug!)).toBeDefined()
      expect(published.has(testimonial.caseStudySlug!)).toBe(true)
    }
  })
})

describe('faqs', () => {
  const sets = {
    contact: contactFaqs,
    services: servicesFaqs,
    ai: aiFaqs,
    careers: careersFaqs,
  }

  it.each(Object.entries(sets))('%s FAQs have unique questions and real answers', (_name, faqs) => {
    const questions = faqs.map((f) => f.question)
    expect(new Set(questions).size).toBe(questions.length)

    for (const faq of faqs) {
      expect(faq.question.endsWith('?')).toBe(true)
      expect(faq.answer.length).toBeGreaterThan(40)
    }
  })
})

describe('posts', () => {
  const posts = getAllPosts()

  it('has unique slugs', () => {
    const slugs = posts.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('sorts newest first', () => {
    const dates = sortPosts(posts).map((p) => Date.parse(p.date))
    const sorted = [...dates].sort((a, b) => b - a)
    expect(dates).toEqual(sorted)
  })

  it('has a valid ISO date and a plausible reading time', () => {
    for (const post of posts) {
      expect(Number.isNaN(Date.parse(post.date))).toBe(false)
      expect(post.readingTimeMinutes).toBeGreaterThan(0)
      expect(post.readingTimeMinutes).toBeLessThanOrEqual(30)
    }
  })

  it('formats dates for display', () => {
    expect(formatPostDate('2026-08-12')).toMatch(/2026/)
  })

  it('collects sorted tags', () => {
    const tags = collectTags(posts)
    expect(tags).toEqual([...tags].sort())
  })

  it('returns adjacent posts for prev/next navigation', () => {
    const first = posts[0]!
    const { previous, next } = adjacentPosts(first.slug, posts)

    expect(previous).toBeUndefined()
    expect(next?.slug).toBeDefined()
  })
})

describe('cover photography', () => {
  const posts = getAllPosts()

  it('gives every post a real cover image', () => {
    for (const post of posts) {
      const cover = coverFor(post.slug)
      expect(cover, `missing cover for ${post.slug}`).toBeDefined()
    }
  })

  it('describes the photograph rather than repeating the title', () => {
    for (const post of posts) {
      const cover = coverFor(post.slug)!
      expect(cover.alt.length).toBeGreaterThan(12)
      expect(cover.alt.toLowerCase()).not.toContain(post.title.toLowerCase())
      expect(cover.credit).toMatch(/CC0/)
    }
  })
})
