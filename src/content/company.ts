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
    name: 'Ravindu Withana',
    role: 'Lead Engineer',
    bio: 'Sets the technical direction for every engagement. Works across the full stack, from schema to interface, and reviews everything that ships.',
    initials: 'RW',
  },
  {
    name: 'Bhashana Bogoda',
    role: 'Senior Frontend Engineer',
    bio: 'Front-end specialist. Owns performance budgets, accessibility and the details that make a fast interface feel fast.',
    initials: 'BB',
  },
  {
    name: 'Kalindu Gayanjith',
    role: 'UI/UX Engineer',
    bio: 'Designs the interfaces and the systems behind them. Bridges product design and implementation so neither drifts.',
    initials: 'KG',
  },
  {
    name: 'Umindu Deminda',
    role: 'Mobile Developer',
    bio: 'Builds the native and cross-platform mobile sides of products, from app shells to the workflows that run offline.',
    initials: 'UD',
  },
  {
    name: 'Bathiya Gamage',
    role: 'UI/UX Mobile',
    bio: 'Owns mobile design — interaction, motion and the constraints of small screens — and keeps it consistent with the product’s identity.',
    initials: 'AG',
  },
  {
    name: 'Imesh Pamoditha',
    role: 'IoT & Robotics Specialist',
    bio: 'Connects hardware to software: sensors, devices and robotic systems that feed real data into the products we build.',
    initials: 'IP',
  },
  {
    name: 'Danuka Perera',
    role: 'Branding Specialist',
    bio: 'Identities, visual systems and the brand material that carries a product from the site to the world outside it.',
    initials: 'DP',
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
    title: 'Practice grew to seven',
    body: 'We started turning down more work than we accepted, which remains the most useful thing we have done.',
  },
  {
    year: '2024',
    title: 'Practice dedicated to AI integration',
    body: 'Because someone has to build the evaluation harnesses before the features ship.',
  },
  {
    year: '2026',
    title: 'Twenty-three projects delivered',
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
    title: 'Discover',
    body: 'Two weeks embedded with your team. We read the code, watch the work, and talk to the people who use what you are building.',
  },
  {
    title: 'Plan',
    body: 'A written proposal with the approach, the risks, the sequence and the number. You approve the plan, not just a mood board.',
  },
  {
    title: 'Build',
    body: 'Short cycles with something demonstrable at the end of each. Performance and accessibility budgets enforced in CI from day one.',
  },
  {
    title: 'Measure',
    body: 'Measured against the baseline we captured in week one. If a number did not move, we explain why — before anything changes hands.',
  },
  {
    title: 'Handover',
    body: 'Documentation, runbooks and paired working until your team is comfortable. Then we get out of the way.',
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
