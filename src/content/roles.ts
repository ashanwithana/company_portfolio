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

export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract'

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
  '£2,000 annual learning budget',
  'Private healthcare and pension contribution',
  '31 days holiday plus public holidays',
] as const

export const roles: readonly Role[] = [
  {
    slug: 'senior-frontend-engineer',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'United Kingdom',
    remote: true,
    employment: 'Full-time',
    summary:
      'Own the interface layer on client engagements, from design system implementation through to performance and accessibility budgets.',
    about:
      'You will be the person responsible for the parts of our work users actually touch. That means turning a design system into components that behave correctly with a keyboard, render fast on a mid-range phone, and can be maintained by a team you will never meet.\n\nYou will work on two or three engagements at a time, usually as the technical lead for the front end. We expect you to push back when a design cannot ship as drawn, and to say so early.',
    responsibilities: [
      'Build production interfaces in React and TypeScript from our design system',
      'Own performance budgets and make them enforced in CI',
      'Hold the accessibility line to WCAG 2.2 AA across every component you ship',
      'Review code and mentor mid-level engineers',
      'Pair with client teams so the handover is genuinely done',
    ],
    requirements: [
      'Five or more years building production web applications',
      'Deep TypeScript fluency, including generics and type-level modelling',
      'Practical accessibility knowledge — you have shipped keyboard support before',
      'Comfort reading and instrumenting performance traces',
      'Clear written communication; much of our collaboration is asynchronous',
    ],
    benefits: baseBenefits,
  },
  {
    slug: 'product-designer',
    title: 'Product Designer',
    department: 'Design',
    location: 'United Kingdom',
    remote: true,
    employment: 'Full-time',
    summary:
      'Take products from ambiguous problem to interface, working directly with engineers and the people who will use it.',
    about:
      'This is a discovery-heavy role. Most of what you will do happens before anything is designed: watching users, reading support tickets, sitting with the team who built the thing you are improving.\n\nWhen you do design, you will be expected to prototype the risky parts rather than hand over a static file. We do not have a handoff step, because there is nothing to hand off to.',
    responsibilities: [
      'Run discovery research and synthesise it into decisions, not documentation',
      'Design flows and interfaces for complex, often regulated workflows',
      'Build interactive prototypes to test assumptions early',
      'Extend and improve our design system alongside engineers',
      'Present work to client stakeholders and defend the reasoning',
    ],
    requirements: [
      'A portfolio showing shipped product work, ideally including unglamorous B2B software',
      'Fluency with design systems as a living agreement rather than a component folder',
      'Comfort working directly in code — Figma plus React',
      'Evidence of having changed your mind based on evidence',
    ],
    benefits: baseBenefits,
  },
  {
    slug: 'platform-engineer',
    title: 'Platform Engineer',
    department: 'Engineering',
    location: 'United Kingdom',
    remote: true,
    employment: 'Full-time',
    summary:
      'Build the deployment, observability and infrastructure layers that keep client systems healthy after we leave.',
    about:
      'Our engagements end. What we leave behind keeps running, and that is partly your responsibility. You will work on infrastructure as code, observability and deployment pipelines for systems where downtime is measured in money.\n\nA recurring theme in our work is incremental migration, so you should be as comfortable strangling a legacy system as building something new.',
    responsibilities: [
      'Build reproducible infrastructure as code across client environments',
      'Design observability that answers "is it broken, and where" without a dashboard archaeology',
      'Own deployment pipelines, including progressive rollout and rollback',
      'Support incremental migrations with feature flags and traffic splitting',
      'Write the runbooks you will be relieved to have written',
    ],
    requirements: [
      'Strong Terraform or equivalent, in production and not just in theory',
      'Production Kubernetes experience',
      'A security-conscious approach to infrastructure and secrets',
      'Fluency with at least one major cloud provider',
      'Interest in developer experience as a product, not an afterthought',
    ],
    benefits: baseBenefits,
  },
  {
    slug: 'ml-engineer',
    title: 'Machine Learning Engineer',
    department: 'Engineering',
    location: 'United Kingdom',
    remote: true,
    employment: 'Full-time',
    summary:
      'Build retrieval and agent systems, and the evaluation harnesses that stop them shipping quietly broken.',
    about:
      'The most valuable thing you will do here is refuse to ship an unmeasured AI feature. We require a labelled evaluation set and a regression harness before anything reaches a customer, and that is a position you will be expected to hold with clients.\n\nWhen the system does ship, you will own its cost model and its failure modes.',
    responsibilities: [
      'Design retrieval pipelines and tool-calling workflows',
      'Build evaluation harnesses that catch regressions before release',
      'Instrument for answer traceability and cost attribution',
      'Set confidence thresholds that escalate to humans rather than guess',
      'Advise clients on where AI genuinely helps and where it does not',
    ],
    requirements: [
      'Production experience with LLM applications, not just notebooks',
      'Strong evaluation mindset — you have built a benchmark before',
      'Python fluency plus willingness to work in TypeScript',
      'Practical vector database experience (pgvector or similar)',
    ],
    benefits: baseBenefits,
  },
  {
    slug: 'delivery-lead',
    title: 'Delivery Lead',
    department: 'Delivery',
    location: 'United Kingdom',
    remote: true,
    employment: 'Full-time',
    summary:
      'Keep several concurrent engagements coherent, honest about risk, and delivered on the date we actually committed to.',
    about:
      'You will be the person who notices when a project is drifting three weeks late while everyone inside it still believes it is on track. That requires real client contact and the standing to have difficult conversations early.\n\nYou will also decide how a team of fourteen is allocated across engagements, which is a genuinely interesting optimisation problem with unhappy constraints.',
    responsibilities: [
      'Own delivery plans, resourcing and risk reporting across engagements',
      'Run weekly client reviews that are useful rather than performative',
      'Escalate slippage early — the earlier, the cheaper',
      'Coordinate the studio calendar and team time away from client work',
    ],
    requirements: [
      'Five or more years delivering technical projects, some of them yours',
      'A track record of raising bad news early and being trusted for it',
      'Comfort with technical detail enough to ask the right questions',
      'Calm, written-first communication',
    ],
    benefits: baseBenefits,
  },
  {
    slug: 'design-engineer-contract',
    title: 'Design Engineer',
    department: 'Design',
    location: 'Remote (Europe)',
    remote: true,
    employment: 'Contract',
    summary:
      'A six-month contract building the interactive layer of a large product rebuild, with an option to extend.',
    about:
      'A specific six-month engagement with a client we have worked with for two years. You would be the design engineer on a greenfield surface being rebuilt around an existing backend — heavy prototyping, heavy interaction design, and a real production deadline.\n\nThis is a contract with an eye to permanent. We mention that plainly because people are often unclear about it.',
    responsibilities: [
      'Prototype interaction patterns in React and evaluate them with users',
      'Build the production implementation alongside the engineering team',
      'Define motion and transition behaviour as part of the design language',
      'Work directly with client designers and engineers',
    ],
    requirements: [
      'Genuinely both sides of the fence: strong design judgment and strong implementation',
      'React and TypeScript in production',
      'Experience with motion design beyond library defaults',
      'Available for six months, four days a week',
    ],
    benefits: [
      'Day rate at or above £750',
      'Four-day week',
      'Genuine possibility of converting to permanent',
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
