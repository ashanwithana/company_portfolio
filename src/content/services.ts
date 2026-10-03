/**
 * Services / capabilities.
 *
 * Kept as structured data rather than JSX so the services index, the home page
 * teaser and the command palette can all read the same source.
 */

export type ServiceStep = {
  /** Step name, e.g. "Budgets in CI". */
  name: string
  /** One-line claim. */
  summary: string
  /** Two to three sentences of how it actually runs. */
  detail: string
}

export type WrongFit = {
  title: string
  body: string
}

export type Service = {
  slug: string
  title: string
  /** One-line summary used in listings and cards. */
  summary: string
  /** Full description shown on the services page and detail pages. */
  body: string
  deliverables: readonly string[]
  /** Accent used for card washes and icons. */
  tint: 'primary' | 'amber' | 'coral'
  /**
   * Canonical deep page, when one exists. The two specialist tracks have
   * dedicated practice pages (/enterprise, /ai) with comparison tables, FAQs
   * and case studies — linking there avoids duplicate thin content under
   * /services/[slug].
   */
  canonicalHref?: string
  /**
   * Numbered approach steps rendered as rows, like the AI pattern list.
   * Absent on the specialist tracks, which carry their depth on the
   * canonical practice pages instead.
   */
  approach?: readonly ServiceStep[]
  /** Common tooling, rendered as a tag strip. */
  stack?: readonly string[]
  /** Honest non-fits, rendered as cards. */
  wrongWhen?: readonly WrongFit[]
  /**
   * Override for the honesty section title, for service names that do not
   * take a singular verb. Defaults to "When {title} is the wrong answer".
   */
  wrongTitle?: string
}

export const services: readonly Service[] = [
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
    tint: 'amber',
    approach: [
      {
        name: 'Tokens before pages',
        summary: 'Every engagement starts in the design tokens, not in a page template.',
        detail:
          'Spacing, type scale and colour decisions compound across every screen you will ever ship. Settling them first means the tenth page costs the same as the first instead of ten times more.',
      },
      {
        name: 'Budgets in CI',
        summary: 'Performance and accessibility budgets enforced from the first merge.',
        detail:
          'Every pull request is measured against bundle size, Core Web Vitals and contrast budgets. A regression fails the build, which is the only way budgets survive contact with deadlines.',
      },
      {
        name: 'Accessible by default',
        summary: 'Keyboard, screen reader and reduced-motion support from day one.',
        detail:
          'Retrofitting accessibility onto a finished interface costs roughly ten times building it in. We test with assistive technology during development, not in a final audit panic.',
      },
      {
        name: 'Handover-ready',
        summary: 'Code another team can pick up without a rewrite.',
        detail:
          'Boring file structures, explicit data flow and documentation written for the next developer, not for us. We hand over repositories we would be happy to inherit.',
      },
    ],
    stack: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'Playwright', 'Lighthouse CI'],
    wrongWhen: [
      {
        title: 'You need native mobile',
        body: 'If the product lives in app stores with offline-first requirements and platform hardware access, a web app is the wrong shell. We will tell you that and point you at native specialists.',
      },
      {
        title: 'The site changes twice a year',
        body: 'A brochure site updated twice a year does not need an application architecture. A static build or a hosted page builder costs a tenth and nobody can tell the difference.',
      },
      {
        title: 'Your team already owns the front end',
        body: 'If you have a strong front-end practice and just need extra hands, an agency engagement adds process overhead you do not need. Hire the contractor instead — we will say so.',
      },
    ],
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
    wrongTitle: 'When backend work is the wrong answer',
    approach: [
      {
        name: 'Contracts first',
        summary: 'The API is designed on paper before a single endpoint exists.',
        detail:
          'Every resource, error shape and auth boundary is agreed up front. Front-end and integration work can start against the contract while the implementation catches up.',
      },
      {
        name: 'Data models that survive contact',
        summary: 'Schemas designed for the tenth year, not the first demo.',
        detail:
          'We model for the exceptions already sitting in your data, not the happy path in the spec. Migrations are rehearsed against production-shaped data with a rollback for each step.',
      },
      {
        name: 'Observable from day one',
        summary: 'Structured logs, traces and metrics ship with the first deploy.',
        detail:
          'The 3am page goes to a dashboard that answers the question, not to a log file that raises three more. Alerting is tuned against real traffic in the first month.',
      },
      {
        name: 'Boring infrastructure',
        summary: 'Reproducible environments instead of tribal knowledge.',
        detail:
          'Infrastructure as code, reviewed like application code. If only one person knows how production works, that is the first thing we fix.',
      },
    ],
    stack: ['PostgreSQL', 'Node.js', 'Python', 'Redis', 'Docker', 'Kubernetes'],
    wrongWhen: [
      {
        title: 'A spreadsheet would do',
        body: 'If the data fits in a sheet and two people touch it, a database project buys ceremony without benefit. Automate the sheet instead — we will happily not sell you a backend.',
      },
      {
        title: 'You need data science, not software',
        body: 'Exploratory modelling and one-off analysis need notebooks and statisticians, not APIs and uptime SLOs. Different discipline, different team.',
      },
      {
        title: 'The ops team is the product',
        body: 'If your organisation measures success by ticket throughput rather than system behaviour, our observable-everything approach will chafe. Fix the incentives first.',
      },
    ],
  },
  {
    slug: 'product-design',
    title: 'Product design',
    summary: 'Interfaces people can pick up and use on day one.',
    body: 'We start by getting close to the problem — talking to users, reading the analytics, and mapping what the software actually needs to do. From there we design the flows, the interface and the interaction details, then prototype the risky parts early enough that changing course is still cheap.',
    deliverables: [
      'Discovery research and user interviews',
      'Information architecture and flow mapping',
      'Wireframes and high-fidelity interface design',
      'Interactive prototypes',
      'Design systems and component libraries',
    ],
    tint: 'primary',
    approach: [
      {
        name: 'Watch the work',
        summary: 'We shadow the people who will use the software before designing anything.',
        detail:
          'The real workflow is visible only in what people do, never in what the process document says. A week of shadowing surfaces the exceptions and workarounds that determine whether the design survives.',
      },
      {
        name: 'Flows before screens',
        summary: 'Information architecture and user flows precede any visual design.',
        detail:
          'If the flow is wrong, beautiful screens just help users get lost faster. We map every path — including errors, empty states and the back button — before pixels enter the picture.',
      },
      {
        name: 'Prototype the risky parts',
        summary: 'The highest-uncertainty interactions get built and tested first.',
        detail:
          'A clickable prototype in week two answers the questions that would otherwise become expensive arguments in week ten. Changing course is cheap while it is still cardboard.',
      },
      {
        name: 'Test with real users',
        summary: 'Five users, observed closely, beat fifty survey responses.',
        detail:
          'We test task completion, not opinions. If three out of five users stumble in the same place, the design is wrong — no matter how the stakeholder review went.',
      },
    ],
    stack: ['Figma', 'User interviews', 'Usability testing', 'Prototyping', 'Design tokens'],
    wrongWhen: [
      {
        title: 'You need a rebrand, not a product',
        body: 'Logo, palette and marketing site refreshes are brand design. We do product interfaces — if nobody completes a task in it, it is not our discipline.',
      },
      {
        title: 'Mockups are for approval, not learning',
        body: 'If screens exist to get sign-off rather than to test with users, our process will frustrate everyone. Design that cannot change is decoration.',
      },
      {
        title: 'The interface is genuinely trivial',
        body: 'Two buttons and a status page do not need discovery research. Save the budget for the hard parts and let an engineer lay out the simple ones.',
      },
    ],
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
    tint: 'amber',
    wrongTitle: 'When a design system is the wrong answer',
    approach: [
      {
        name: 'Audit what exists',
        summary: 'We inventory every button, form and shade of grey currently shipping.',
        detail:
          'Most organisations run four or five accidental design systems. Cataloguing them shows which patterns earned their place and which proliferated by copy-paste.',
      },
      {
        name: 'Tokens as the contract',
        summary: 'Colour, spacing and type decisions live in versioned tokens.',
        detail:
          'Tokens are the one artefact designers and engineers genuinely share. When the contract is a token set rather than a screenshot, both disciplines can move without breaking each other.',
      },
      {
        name: 'Components with tests',
        summary: 'Every component ships with behaviour tests and accessibility checks.',
        detail:
          'An untested component library is a liability with documentation. Ours fail CI on broken keyboard support, missing labels and contrast regressions.',
      },
      {
        name: 'Adoption as the product',
        summary: 'Migration tooling, office hours and a contribution model.',
        detail:
          'Libraries die from neglect, not from bad components. We treat adoption as the deliverable: codemods for migration, pairing for contributors, and a deprecation policy with teeth.',
      },
    ],
    stack: ['Style Dictionary', 'Storybook', 'Chromatic', 'Radix Primitives', 'Figma Variables'],
    wrongWhen: [
      {
        title: 'One product, one team',
        body: 'A single team shipping one product coordinates by talking. A system pays off from the second product or the second team onwards — before that it is overhead.',
      },
      {
        title: 'You want a component folder',
        body: 'If the ask is really "make the buttons consistent", that is a week of cleanup, not a system. We will do the cleanup and spare you the governance.',
      },
      {
        title: 'Nobody will govern it',
        body: 'A system without an owner rots within a year. If no one is funded to maintain it after we leave, we will say so rather than ship an orphan.',
      },
    ],
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
    approach: [
      {
        name: 'Measure real users',
        summary: 'Field data first: what your actual visitors experience, on their devices.',
        detail:
          'Lab scores are rehearsals. We start with real-user distributions — the 75th percentile on a mid-range Android over 4G — because that is where your revenue lives.',
      },
      {
        name: 'Profile, never guess',
        summary: 'Traces and waterfalls before recommendations.',
        detail:
          'Every claim in the report links to a trace, a filmstrip or a query plan. "Probably the images" is not a finding; a 2.1-second render-blocked hero is.',
      },
      {
        name: 'Fix by impact per effort',
        summary: 'A ranked list where each item carries its expected gain and cost.',
        detail:
          'The plan reads like triage, not a wishlist. Quick wins first for momentum, structural fixes sequenced so each one is independently shippable.',
      },
      {
        name: 'Prove it stuck',
        summary: 'Before-and-after measurement with regression monitoring left running.',
        detail:
          'We re-measure after every fix against the same methodology and leave the monitors in place. Performance rots without a budget watching it — so we install the budget.',
      },
    ],
    stack: ['WebPageTest', 'Lighthouse', 'CrUX', 'Sentry', 'axe-core'],
    wrongWhen: [
      {
        title: 'You want a perfect score regardless of cost',
        body: 'Chasing 100 on every page burns budget users will never feel. We optimise to the point where humans stop noticing — past that, the money belongs in features.',
      },
      {
        title: 'The bottleneck is the business model',
        body: 'If visitors bounce because the offer is unclear or the pricing is wrong, no amount of millisecond-shaving moves revenue. Fix the proposition first.',
      },
      {
        title: 'Nobody will act on the report',
        body: 'An audit nobody implements is an expensive PDF. If there is no engineering capacity lined up for remediation, wait until there is — then call us.',
      },
    ],
  },
] as const

export function getService(slug: string) {
  return services.find((service) => service.slug === slug)
}

/** Headline metrics shown on the services page and the home page. */
export const studioStats = [
  { value: 6, suffix: '+', label: 'Years shipping' },
  { value: 23, suffix: '+', label: 'Projects delivered' },
  { value: 7, suffix: '', label: 'People in the studio' },
  { value: 92, suffix: '%', label: 'Clients return' },
] as const
