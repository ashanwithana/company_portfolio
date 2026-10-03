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
  /**
   * Canonical deep page, when one exists. The two specialist tracks have
   * dedicated practice pages (/enterprise, /ai) with comparison tables, FAQs
   * and case studies — linking there avoids duplicate thin content under
   * /services/[slug].
   */
  canonicalHref?: string
}

export const services: readonly Service[] = [
  {
    slug: 'enterprise-systems',
    title: 'ERP & enterprise systems',
    summary: 'Odoo, Dynamics 365, SAP Business One and Salesforce, implemented against real data.',
    canonicalHref: '/enterprise',
    body: 'Most enterprise software projects fail in the gap between the demo and production. The demo works because someone curated the data; production fails because nobody planned for the eleven years of exceptions already sitting in the database.\n\nWe start with the data, not the configuration. Mapping and cleansing comes before any module is switched on, because that work determines whether the go-live succeeds. We implement in staging that mirrors production, migrate in rehearsed phases with a tested rollback for each, and train the team who will use the system rather than the team who approves it.',
    deliverables: [
      'Data assessment, mapping and cleansing',
      'Odoo / Dynamics 365 / SAP B1 implementation',
      'Customisation and third-party integration',
      'Phased migration with rehearsed rollback',
      'Team training and hypercare',
    ],
    tint: 'primary',
  },
  {
    slug: 'ai-engineering',
    title: 'AI engineering',
    summary: 'RAG pipelines and model integrations that are measured before they are shipped.',
    canonicalHref: '/ai',
    body: 'We build retrieval-augmented generation pipelines, tool-calling workflows and — most importantly — the evaluation harness that tells you whether any of it works.\n\nRetrieval systems fail quietly: a plausible wrong answer is worse than no answer, and nobody notices until a customer complains. So the harness ships first, every answer is traceable to its sources, and low-confidence queries escalate to a human instead of guessing.',
    deliverables: [
      'Retrieval architecture and chunking strategy',
      'Evaluation and regression harnesses',
      'Tool-calling and agentic workflows',
      'Shadow-mode rollout and accuracy reporting',
      'Cost modelling and guardrails',
    ],
    tint: 'coral',
  },
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
