/**
 * Services / capabilities.
 *
 * Kept as structured data rather than JSX so the services index, the home page
 * teaser and the command palette can all read the same source.
 */

export type Service = {
  slug: string
  title: string
  /** One-line summary used in listings and cards. */
  summary: string
  /** Full description shown on the services page and detail pages. */
  body: string
  deliverables: readonly string[]
  /** Accent used for card washes and icons. */
  tint: 'primary' | 'mint' | 'coral'
}

export const services: readonly Service[] = [
  {
    slug: 'product-design',
    title: 'Product design',
    summary: 'Interfaces that people can pick up and use without a manual.',
    body: 'We start by getting close to the problem — talking to users, reading the analytics, and mapping what the software actually needs to do. From there we design the flows, the interface and the interaction details, then prototype the risky parts early enough that changing course is still cheap.',
    deliverables: [
      'Discovery research and user interviews',
      'Information architecture and flow mapping',
      'Wireframes and high-fidelity interface design',
      'Interactive prototypes',
      'Design systems and component libraries',
    ],
    tint: 'primary',
  },
  {
    slug: 'web-engineering',
    title: 'Web engineering',
    summary: 'Fast, accessible front-ends built to be maintained.',
    body: 'We build in TypeScript on modern frameworks, with performance budgets and accessibility baked in from the first component rather than bolted on at the end. You get code that another team can pick up and extend without a rewrite.',
    deliverables: [
      'TypeScript applications with React or Next.js',
      'Design system implementation',
      'Performance and Core Web Vitals budgets',
      'WCAG 2.2 AA accessibility',
      'Test coverage and CI pipelines',
    ],
    tint: 'mint',
  },
  {
    slug: 'backend-systems',
    title: 'Backend & systems',
    summary: 'APIs and data layers that stay predictable under load.',
    body: 'We design schemas and APIs we would be happy to own for years. Explicit contracts, sensible defaults, observability from day one, and infrastructure that is reproducible rather than tribal knowledge.',
    deliverables: [
      'API design and implementation',
      'Database schema and query optimisation',
      'Authentication and authorisation',
      'Queueing, caching and background jobs',
      'Infrastructure as code and observability',
    ],
    tint: 'coral',
  },
  {
    slug: 'ai-integration',
    title: 'AI integration',
    summary: 'Practical LLM features, not experiments for their own sake.',
    body: 'We build retrieval pipelines, tool-using agents and evaluation harnesses. The goal is a feature that improves a metric you already care about — with guardrails, cost controls and a way to tell when it is wrong.',
    deliverables: [
      'Retrieval-augmented generation pipelines',
      'Tool-calling and agent workflows',
      'Evaluation and regression harnesses',
      'Prompt and model selection',
      'Guardrails, fallbacks and cost controls',
    ],
    tint: 'primary',
  },
  {
    slug: 'design-systems',
    title: 'Design systems',
    summary: 'One source of truth for product and engineering.',
    body: 'A design system is an agreement, not a component folder. We build the tokens, components and documentation that let a design and an engineering team move independently without the product drifting apart.',
    deliverables: [
      'Token architecture and theming',
      'Component library with tests',
      'Accessibility built into every component',
      'Documentation and usage guidelines',
      'Adoption and contribution process',
    ],
    tint: 'mint',
  },
  {
    slug: 'performance-audits',
    title: 'Performance & audits',
    summary: 'Find the bottleneck, fix it, and prove the improvement.',
    body: 'We profile real users rather than guessing from a lab score, then prioritise fixes by effort against measured impact. You leave with the numbers, the reasoning and a team that knows what to watch.',
    deliverables: [
      'Real-user and lab performance profiling',
      'Accessibility conformance audits',
      'Prioritised remediation plan',
      'Verification and regression monitoring',
      'Handover documentation',
    ],
    tint: 'coral',
  },
] as const

export function getService(slug: string) {
  return services.find((service) => service.slug === slug)
}

/** Headline metrics shown on the services page and the home page. */
export const studioStats = [
  { value: 7, suffix: '+', label: 'Years shipping' },
  { value: 60, suffix: '+', label: 'Projects delivered' },
  { value: 14, suffix: '', label: 'People in the studio' },
  { value: 92, suffix: '%', label: 'Clients return' },
] as const
