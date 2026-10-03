/**
 * Case studies.
 *
 * Each entry drives the /work listing card *and* the /work/[slug] detail page,
 * so the long-form fields are part of the same record rather than a parallel file
 * that can drift out of sync.
 */

export const caseStudyCategories = ['all', 'product', 'platform', 'brand'] as const

export type CaseStudyCategory = Exclude<(typeof caseStudyCategories)[number], 'all'>

export type Metric = {
  label: string
  value: string
}

export type CaseStudy = {
  slug: string
  title: string
  /** Short client + project descriptor used in listings. */
  client: string
  year: number
  category: CaseStudyCategory
  categoryLabel: 'Product' | 'Platform' | 'Brand'
  /** One-line summary for cards and meta descriptions. */
  summary: string
  /** Opening statement on the detail page. */
  intro: string
  services: readonly string[]
  /** The problem the client had. */
  challenge: string
  /** What we did about it. */
  approach: readonly string[]
  /** What changed as a result. */
  outcome: string
  /** Headline results, rendered as a stat row. */
  metrics: readonly Metric[]
  tech: readonly string[]
  tint: 'primary' | 'amber' | 'coral'
  featured?: boolean
  /** Set to false to keep work-in-progress cases off the public listing. */
  published?: boolean
}

export const caseStudies: readonly CaseStudy[] = [
  {
    slug: 'meridian-banking-platform',
    title: 'Rebuilding the core of a retail banking platform',
    client: 'Meridian',
    year: 2026,
    category: 'platform',
    categoryLabel: 'Platform',
    summary:
      'A fourteen-year-old banking platform rebuilt incrementally, without a freeze on new features.',
    intro:
      'Meridian came to us with a platform that worked but could not keep pace: releases took a day, regressions were routine, and the mobile experience was a separate codebase that nobody wanted to touch.',
    services: ['Product design', 'Web engineering', 'Backend & systems', 'Performance & audits'],
    challenge:
      'The instinct was to rewrite. We argued against it. A full rewrite would have frozen product delivery for most of a year and thrown away two decades of edge cases encoded in the existing system. What the team actually needed was a way to move faster without betting the company on a single big-bang migration.',
    approach: [
      'Characterised the existing system with tests before changing anything, so behaviour changes became visible rather than theoretical.',
      'Introduced a strangler facade in front of the legacy core, routing traffic to new services incrementally behind feature flags.',
      'Rebuilt the mobile and web clients against a single shared API, retiring the duplicated mobile backend.',
      'Set explicit performance and accessibility budgets in CI, so regressions fail the build instead of reaching production.',
    ],
    outcome:
      'The migration completed over eleven months with no planned downtime and no customer-visible incidents. The team now ships continuously, and the platform carries a quarter of the traffic it did before with a third of the infrastructure.',
    metrics: [
      { label: 'Release lead time', value: '1 day → 40 min' },
      { label: 'P95 page load', value: '4.8s → 0.9s' },
      { label: 'Infrastructure cost', value: '−64%' },
      { label: 'Deploy frequency', value: '2×/month → 30×/month' },
    ],
    tech: ['TypeScript', 'Next.js', 'PostgreSQL', 'GraphQL', 'Kubernetes', 'Terraform'],
    tint: 'primary',
    featured: true,
  },
  {
    slug: 'fieldnote-research-toolkit',
    title: 'A research toolkit that people actually finished using',
    client: 'Fieldnote',
    year: 2025,
    category: 'product',
    categoryLabel: 'Product',
    summary:
      'Turning a compliance survey product into something clinical teams would choose to keep using.',
    intro:
      'Fieldnote had strong adoption during onboarding and a steep drop afterwards. The product did its job but felt like paperwork, and clinical teams were keeping their notes elsewhere.',
    services: ['Product design', 'Design systems', 'Web engineering'],
    challenge:
      'The original build optimised for completeness: every regulatory field, every possible response. Users optimised for finishing quickly. Nobody had measured the gap between what the product asked for and what a clinician actually needed to capture in the moment of care.',
    approach: [
      'Shadowed clinical staff through a full shift to understand the real workflow, then rebuilt the primary flow around it.',
      'Reduced required fields by 60%, moving the rest behind progressive disclosure with clear justification when revealed.',
      'Built a design system so new questionnaire types could be added without redesigning the surrounding interface.',
      'Shipped offline-first capture, because the one moment the data mattered most was often the moment there was no signal.',
    ],
    outcome:
      'Completion rates rose from 54% to 89%, and eight of the ten clinics in the pilot rolled the product out to their full staff rather than a single department.',
    metrics: [
      { label: 'Completion rate', value: '54% → 89%' },
      { label: 'Required fields', value: '−60%' },
      { label: 'Median session', value: '11 min → 4 min' },
      { label: 'Support tickets', value: '−48%' },
    ],
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Expo'],
    tint: 'amber',
    featured: true,
  },
  {
    slug: 'northwind-design-system',
    title: 'One design system across four products and nine teams',
    client: 'Northwind',
    year: 2025,
    category: 'brand',
    categoryLabel: 'Brand',
    summary:
      'A shared component library and token architecture that let product teams ship without waiting on a design bottleneck.',
    intro:
      'Nine teams, four products, and a visual language that had drifted into four different interpretations. Any change to a button meant nine pull requests and a fortnight of coordination.',
    services: ['Design systems', 'Product design', 'Web engineering'],
    challenge:
      'The previous attempts at consolidation failed because they shipped a component library and called it done. The library was technically correct and practically ignored, because contributing to it was harder than building something locally and because there was no agreed process for deciding what belonged in it.',
    approach: [
      'Audited every UI pattern in production and produced a single inventory, so the migration scope was known and bounded.',
      'Built the token architecture first — colour, type, spacing, motion — so themes and density changes became configuration rather than refactoring.',
      'Wrote every component with accessibility and tests before release, and made failing tests a merge blocker.',
      'Established a contribution process with a named owner per component and a published review cadence.',
    ],
    outcome:
      'Adoption reached 94% of production surfaces within eight months. Visual defects across products fell sharply, and a theme or brand change that previously took a quarter now takes a fortnight.',
    metrics: [
      { label: 'Design-system adoption', value: '94%' },
      { label: 'Accessibility defects', value: '−71%' },
      { label: 'UI build time', value: '−38%' },
      { label: 'Teams onboarded', value: '9' },
    ],
    tech: ['React', 'TypeScript', 'Radix', 'Tailwind CSS', 'Storybook'],
    tint: 'coral',
    featured: true,
  },
  {
    slug: 'atlas-observability',
    title: 'Making infrastructure failures legible to the people on call',
    client: 'Atlas',
    year: 2024,
    category: 'platform',
    categoryLabel: 'Platform',
    summary:
      'An internal tooling suite that cut median time-to-diagnosis from 40 minutes to under 6.',
    intro:
      'Atlas had excellent telemetry and a terrible experience using it. Engineers spent most of an incident correlating dashboards by hand, and the people on call were the least practised at the tools available to them.',
    services: ['Web engineering', 'Backend & systems', 'Design systems'],
    challenge:
      'Every team had built its own dashboards and alert rules, so during an incident nobody could tell which signal mattered. The existing tooling assumed deep familiarity with the underlying infrastructure, which is exactly the knowledge missing at 3am.',
    approach: [
      'Ran incident reviews on every outage for six weeks, building a taxonomy of where diagnosis time actually went.',
      'Built a service catalogue as the entry point, so an on-call engineer could start from "this is broken" rather than from a list of infrastructure they did not recognise.',
      'Designed progressive-disclosure views: a plain summary first, with the raw telemetry one click away.',
      'Automated the correlation steps that turned out to be manual in every single incident.',
    ],
    outcome:
      'Median time to diagnosis fell from 40 minutes to just under 6, and the new tooling was adopted well beyond the original on-call rotation.',
    metrics: [
      { label: 'Time to diagnosis', value: '40 min → 5.8 min' },
      { label: 'Incidents per quarter', value: '−35%' },
      { label: 'Tooling adoption', value: '100% of SRE' },
      { label: 'Engineer satisfaction', value: '4.1 → 8.7 / 10' },
    ],
    tech: ['Go', 'TypeScript', 'React', 'ClickHouse', 'OpenTelemetry'],
    tint: 'primary',
  },
  {
    slug: 'cadence-brand-relaunch',
    title: 'A developer brand that survives contact with reality',
    client: 'Cadence',
    year: 2024,
    category: 'brand',
    categoryLabel: 'Brand',
    summary:
      'Identity, documentation and a launch site for a protocol nobody had heard of a year earlier.',
    intro:
      'Cadence had built something genuinely novel and had no idea how to explain it. The launch site described features instead of outcomes, and the documentation assumed knowledge the audience did not have.',
    services: ['Brand', 'Product design', 'Web engineering'],
    challenge:
      'Explaining an unfamiliar protocol without either dumbing it down or drowning people in specification. The team also needed a visual identity that would hold up in a technical context rather than looking like a consumer app.',
    approach: [
      'Interviewed early adopters to find the words they actually used, and built the messaging around those instead of our own vocabulary.',
      'Designed an identity rooted in the protocol’s own structure, so the brand grew out of the subject rather than sitting on top of it.',
      'Rewrote the documentation as a progressive tutorial, with a working example in the first screen.',
      'Built the site to degrade well: fast, keyboard-navigable, and legible in a screenshot pasted into a forum.',
    ],
    outcome:
      'The launch reached well beyond the existing following, and the documentation became the reference other adopters linked to.',
    metrics: [
      { label: 'Time to first success', value: '45 min → 6 min' },
      { label: 'Launch signups', value: '4.2× target' },
      { label: 'Doc bounce rate', value: '−57%' },
      { label: 'Lighthouse performance', value: '99 / 100' },
    ],
    tech: ['Next.js', 'TypeScript', 'MDX', 'Tailwind CSS'],
    tint: 'amber',
  },
  {
    slug: 'heliostat-ai-workflow',
    title: 'Putting an AI assistant into a workflow that already existed',
    client: 'Heliostat',
    year: 2026,
    category: 'product',
    categoryLabel: 'Product',
    summary:
      'A retrieval-backed assistant for support teams, with an evaluation harness before it reached a single customer.',
    intro:
      'Heliostat wanted to use retrieval over their own documentation to deflect routine support load. The instinct was to ship an assistant and watch what happened. We insisted on building the measurement first.',
    services: ['AI integration', 'Product design', 'Web engineering'],
    challenge:
      'Retrieval systems fail quietly: a plausible wrong answer is far worse than no answer, and nobody notices until a customer complains. There was no way to tell whether the assistant was helping, which meant there was no way to improve it either.',
    approach: [
      'Built a labelled evaluation set from real historical tickets, so quality became a number that could move in either direction.',
      'Added confidence thresholds that escalate to a human rather than guessing, because a refusal is cheap and a wrong answer is not.',
      'Instrumented the full loop so every answer was traceable back to its source documents.',
      'Ran the assistant shadow-mode against live traffic before letting it answer anything.',
    ],
    outcome:
      'The assistant now resolves a third of routine enquiries with a measured accuracy of 94%, and the evaluation set caught two regressions that would otherwise have shipped.',
    metrics: [
      { label: 'Enquiries deflected', value: '33%' },
      { label: 'Answer accuracy', value: '94%' },
      { label: 'Cost per resolved ticket', value: '−78%' },
      { label: 'Regressions caught pre-launch', value: '2' },
    ],
    tech: ['TypeScript', 'Next.js', 'pgvector', 'OpenAI', 'Playwright'],
    tint: 'coral',
  },
] as const

export const caseStudyFilters = [
  { value: 'all', label: 'All' },
  { value: 'product', label: 'Product' },
  { value: 'platform', label: 'Platform' },
  { value: 'brand', label: 'Brand' },
] as const satisfies readonly { value: (typeof caseStudyCategories)[number]; label: string }[]

export function publishedCaseStudies() {
  return caseStudies.filter((study) => study.published !== false)
}

export function filterCaseStudies(
  category: (typeof caseStudyCategories)[number],
  studies: readonly CaseStudy[] = publishedCaseStudies(),
) {
  return category === 'all' ? studies : studies.filter((study) => study.category === category)
}

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug)
}

/** Distinct technologies across all case studies, for the marquee. */
export const workTechMarquee = [
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'PostgreSQL',
  'GraphQL',
  'Tailwind CSS',
  'Kubernetes',
  'Terraform',
  'OpenTelemetry',
] as const
