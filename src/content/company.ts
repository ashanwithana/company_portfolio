export type TeamMember = {
  name: string
  role: string
  /** One or two lines shown on hover / on the about page. */
  bio: string
  /** Initials used by the avatar placeholder. */
  initials: string
}

export const team: readonly TeamMember[] = [
  {
    name: 'Amara Okafor',
    role: 'Founder & Principal',
    bio: 'Fifteen years building products for regulated industries. Started the studio after one too many rewrites that should have been migrations.',
    initials: 'AO',
  },
  {
    name: 'Tobias Lindqvist',
    role: 'Head of Engineering',
    bio: 'Distributed systems, mostly databases. Believes any architecture that cannot be explained on a whiteboard has already failed.',
    initials: 'TL',
  },
  {
    name: 'Priya Raman',
    role: 'Design Director',
    bio: 'Design systems and the interfaces around them. Has strong opinions about focus rings and the right to have them.',
    initials: 'PR',
  },
  {
    name: 'Marcus Chen',
    role: 'Principal Engineer',
    bio: 'Performance and accessibility. Once took a 9-second page down to 800ms and wrote down exactly why.',
    initials: 'MC',
  },
  {
    name: 'Sofia Almeida',
    role: 'ML Engineer',
    bio: 'Retrieval systems and the evaluation harnesses that keep them honest. Measures everything, twice.',
    initials: 'SA',
  },
  {
    name: 'Jonas Weber',
    role: 'Delivery Lead',
    bio: 'Keeps fourteen concurrent engagements coherent. Maintains the only accurate Gantt chart in the building.',
    initials: 'JW',
  },
] as const

export type Value = {
  title: string
  body: string
}

export const values: readonly Value[] = [
  {
    title: 'Incremental over heroic',
    body: 'We would rather migrate a system over nine months than rewrite it over one. Every engagement we have ever regretted started with a rewrite someone was very confident about.',
  },
  {
    title: 'Measure before optimising',
    body: 'Profiling beats intuition. We instrument first, fix what the data points at, and re-measure to prove it — including when that proves we were wrong.',
  },
  {
    title: 'Accessible by construction',
    body: 'Keyboard support, focus order and contrast are decided while we design, not audited at the end when they are expensive to change.',
  },
  {
    title: 'Leave it maintainable',
    body: 'The test is whether your team can extend the work without us. Handing over a black box is not a deliverable.',
  },
  {
    title: 'Say the difficult thing early',
    body: 'If a deadline is unrealistic or an idea will not work, we say so in week one rather than week nine. It is much cheaper.',
  },
  {
    title: 'Boring where it counts',
    body: 'Novelty is a cost. We spend it on the parts that differentiate the product and use well-worn tools everywhere else.',
  },
] as const

export type Milestone = {
  year: string
  title: string
  body: string
}

export const milestones: readonly Milestone[] = [
  {
    year: '2019',
    title: 'Founded',
    body: 'Three people, one client, and a strong opinion that migrations should not require a rewrite.',
  },
  {
    year: '2021',
    title: 'First design systems engagement',
    body: 'A consolidation project for nine teams taught us more about adoption than any technical decision ever has.',
  },
  {
    year: '2023',
    title: 'Practice grew to fourteen',
    body: 'We started turning down more work than we accepted, which remains the most useful thing we have done.',
  },
  {
    year: '2024',
    title: 'Practice dedicated to AI integration',
    body: 'Because someone has to build the evaluation harnesses before the features ship.',
  },
  {
    year: '2026',
    title: 'Sixty projects delivered',
    body: 'Still independent, still deliberately small, still measuring everything twice.',
  },
] as const

export type Client = { name: string; sector: string }

export const clients: readonly Client[] = [
  { name: 'Meridian', sector: 'Financial services' },
  { name: 'Fieldnote', sector: 'Healthcare' },
  { name: 'Northwind', sector: 'Logistics' },
  { name: 'Atlas', sector: 'Infrastructure' },
  { name: 'Cadence', sector: 'Developer tools' },
  { name: 'Heliostat', sector: 'SaaS' },
] as const

export type Engagement = {
  title: string
  body: string
}

export const process: readonly Engagement[] = [
  {
    title: 'See',
    body: 'Two weeks embedded with your team. We read the code, watch the work, and talk to the people who use what you are building.',
  },
  {
    title: 'Shape',
    body: 'A written proposal with the approach, the risks, the sequence and the number. You approve the plan, not just a mood board.',
  },
  {
    title: 'Ship',
    body: 'Short cycles with something demonstrable at the end of each. Performance and accessibility budgets enforced in CI from day one.',
  },
  {
    title: 'Show',
    body: 'Measured against the baseline we captured in week one. If a number did not move, we explain why — before anything changes hands.',
  },
  {
    title: 'Shift',
    body: 'Documentation, runbooks and paired working until your team is comfortable. Then we get out of the way.',
  },
] as const

export type Testimonial = {
  quote: string
  name: string
  role: string
  company: string
  /** Links the quote to a published case study. */
  caseStudySlug?: string
}

export const testimonials: readonly Testimonial[] = [
  {
    quote:
      'They talked us out of a rewrite in the first meeting, then spent eleven months proving why that was right. No downtime, no drama, and a platform our team can actually run.',
    name: 'Elena Marsh',
    role: 'CTO',
    company: 'Meridian',
    caseStudySlug: 'meridian-banking-platform',
  },
  {
    quote:
      'The evaluation harness caught two regressions before launch — including one from our own documentation change. That alone paid for the engagement.',
    name: 'David Osei',
    role: 'Head of Support',
    company: 'Heliostat',
    caseStudySlug: 'heliostat-ai-workflow',
  },
  {
    quote:
      'Nine teams, one design system, 94% adoption in eight months. Previous attempts had failed twice. The difference was that they treated adoption as the product, not the library.',
    name: 'Ingrid Halvorsen',
    role: 'VP Engineering',
    company: 'Northwind',
    caseStudySlug: 'northwind-design-system',
  },
  {
    quote:
      'Completion rates went from 54% to 89% because they shadowed our staff before designing anything. Nobody else we spoke to offered to do that.',
    name: 'Dr. Rachel Kim',
    role: 'Clinical Director',
    company: 'Fieldnote',
    caseStudySlug: 'fieldnote-research-toolkit',
  },
] as const

/** Why-us differentiators shown on the home page. */
export const differentiators: readonly { tag: string; title: string; body: string }[] = [
  {
    tag: 'Honesty',
    title: 'We tell you when we are wrong for the job',
    body: 'Wrong stack, wrong timing, wrong fit — you will hear it on the first call, not when it is too late to walk away. We would rather point you somewhere better than sell you something that will not work.',
  },
  {
    tag: 'Proof',
    title: 'Measured, not promised',
    body: 'A baseline in week one, numbers at handover. AI features earn production with measured accuracy; performance work ships against a budget.',
  },
  {
    tag: 'Freedom',
    title: 'Handover, not lock-in',
    body: 'Docs, runbooks and pairing until your team is comfortable — then we leave. The test is whether you need us afterwards.',
  },
] as const
