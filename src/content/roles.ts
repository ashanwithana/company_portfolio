/**
 * Open roles.
 *
 * Used by /careers and /careers/[slug]. The `slug` is derived from the title,
 * so adding a role needs no extra bookkeeping.
 */

export type Department = 'Engineering' | 'Design' | 'Delivery' | 'Operations'

export const departments: readonly Department[] = [
  'Engineering',
  'Design',
  'Delivery',
  'Operations',
] as const

export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship'

export type Role = {
  slug: string
  title: string
  department: Department
  location: string
  /** Remote-first studio: true means fully async, false means hybrid. */
  remote: boolean
  employment: EmploymentType
  /** Short teaser for the listing card. */
  summary: string
  /** Long-form sections on the detail page. */
  about: string
  responsibilities: readonly string[]
  requirements: readonly string[]
  /** Optional: what we offer, shown as a benefits list. */
  benefits?: readonly string[]
}

const baseBenefits = [
  'Four-day week at full pay',
  'Fully async, with two team weeks a year in the studio',
  'An annual learning budget for courses, books and conferences',
  'Private healthcare and pension contribution',
  '31 days holiday plus public holidays',
] as const

export const roles: readonly Role[] = [
  {
    slug: 'senior-full-stack-engineer',
    title: 'Senior Full-Stack Engineer',
    department: 'Engineering',
    location: 'Sri Lanka',
    remote: true,
    employment: 'Full-time',
    summary:
      'Own whole features end to end — schema and API through to the interface — on client engagements that measure everything.',
    about:
      'You will take features from a written plan to production without handoffs: the data model, the endpoints and the interface, plus the tests and observability around them.\n\nYou will usually be the most senior engineer on one or two engagements at a time, which means reviewing work, setting the technical direction, and telling a client plainly when their plan will not survive contact with reality.',
    responsibilities: [
      'Design and build full-stack features in TypeScript, from PostgreSQL schema to React interface',
      'Set technical direction and review code across your engagements',
      'Own performance, accessibility and reliability budgets for what you ship',
      'Pair with client engineers so knowledge transfers before you leave',
      'Push back early when a plan cannot ship as drawn',
    ],
    requirements: [
      'Six or more years shipping production software across the stack',
      'Strong PostgreSQL fundamentals — indexing, migrations, query plans',
      'Deep TypeScript fluency on both sides of the API boundary',
      'Practical accessibility knowledge and CI-enforced quality gates',
      'Clear written communication; much of our collaboration is asynchronous',
    ],
    benefits: baseBenefits,
  },
  {
    slug: 'full-stack-engineer',
    title: 'Full-Stack Engineer',
    department: 'Engineering',
    location: 'Sri Lanka',
    remote: true,
    employment: 'Full-time',
    summary:
      'Build and ship across the stack with a senior engineer reviewing everything — a fast track to owning features outright.',
    about:
      'You will work inside real client engagements from your first week, paired closely with a senior engineer. Expect your pull requests to be reviewed properly and your questions to be answered seriously.\n\nWithin a year, engineers at this level typically own whole features end to end. The pace is set by short cycles and honest feedback, not by hours.',
    responsibilities: [
      'Build features across the stack in TypeScript, React and PostgreSQL',
      'Write tests as part of the work, not after it',
      'Fix bugs by finding root causes, with traces to prove it',
      'Document what you build for the team inheriting it',
      'Join client stand-ups and speak plainly about progress and blockers',
    ],
    requirements: [
      'Two or more years building production web applications',
      'Working TypeScript across front end and back end',
      'Comfort with SQL beyond an ORM — joins, indexes, migrations',
      'Familiarity with Git workflows and CI pipelines',
      'Curiosity that survives contact with legacy code',
    ],
    benefits: baseBenefits,
  },
  {
    slug: 'full-stack-intern',
    title: 'Full-Stack Engineering Intern',
    department: 'Engineering',
    location: 'Sri Lanka',
    remote: true,
    employment: 'Internship',
    summary:
      'A six-month paid internship shipping real production features, paired daily with a senior engineer. Strong interns convert to full-time offers.',
    about:
      'This is not a shadowing programme. From week two you will ship real features to production codebases, with every pull request reviewed and every question welcomed. One senior engineer is directly responsible for your progress.\n\nThe internship runs six months, fully remote and async-friendly, with overlap hours that suit Sri Lanka mornings. Most of our planning for junior hiring starts from this programme.',
    responsibilities: [
      'Ship small, well-tested features to production behind senior review',
      'Fix real bugs with root-cause analysis, not patches',
      'Write documentation for everything you touch',
      'Present one thing you learned to the studio each month',
    ],
    requirements: [
      'A portfolio, coursework or side projects showing real code you wrote',
      'Basic fluency in JavaScript or TypeScript and SQL fundamentals',
      'Written English you are comfortable being reviewed in',
      'Four or more overlapping hours with UTC business time, four days a week',
      'No commercial experience required — evidence of curiosity required',
    ],
    benefits: [
      'Monthly stipend well above local market rate',
      'A dedicated senior mentor and daily pairing time',
      'Four-day week, async-first like everyone else',
      'A learning budget for the six months',
      'A genuine path to a full-time offer — most junior hires come through here',
    ],
  },
] as const

export function getRole(slug: string) {
  return roles.find((role) => role.slug === slug)
}

export function rolesByDepartment() {
  return departments
    .map((department) => ({
      department,
      roles: roles.filter((role) => role.department === department),
    }))
    .filter((group) => group.roles.length > 0)
}

/** Benefits shown on the careers index, de-duplicated across all roles. */
export function allBenefits(): string[] {
  return [...new Set(roles.flatMap((role) => role.benefits ?? []))].slice(0, 6)
}
