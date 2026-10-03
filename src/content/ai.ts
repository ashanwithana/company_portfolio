/**
 * AI engineering practice.
 *
 * Split out from the general services list because it has its own vocabulary and
 * its own set of commitments — specifically, that nothing ships without an
 * evaluation harness. Content lives here rather than in prose so the AI pages,
 * the case studies and the command palette all read one source.
 */

/** Model vendors we build against, with the honest trade-offs. */
export type ModelProvider = {
  vendor: string
  models: readonly string[]
  /** Why you would choose this one. */
  bestFor: string
  /** When you would not. */
  avoidWhen: string
}

export const modelProviders: readonly ModelProvider[] = [
  {
    vendor: 'OpenAI',
    models: ['GPT-4.1', 'GPT-4o mini', 'o3', 'text-embedding-3-large'],
    bestFor:
      'Strongest general tool-calling and instruction following, plus the most reliable structured output we have measured.',
    avoidWhen:
      'You need data residency outside approved regions, or per-token cost is prohibitive at your volume.',
  },
  {
    vendor: 'Anthropic',
    models: ['Claude Sonnet', 'Claude Opus', 'Claude Haiku'],
    bestFor:
      'Long-context work where most of the document actually matters, and careful, low-hallucination analysis.',
    avoidWhen:
      'You need a very small model for high-volume classification — Haiku is good but a fine-tuned classifier is cheaper.',
  },
  {
    vendor: 'Google',
    models: ['Gemini 2.5 Pro', 'Gemini 2.5 Flash'],
    bestFor:
      'Very large context windows, multimodal input, and competitive cost on high-volume tasks.',
    avoidWhen:
      'Your evaluation shows weaker structured output reliability for your schema than frontier alternatives.',
  },
  {
    vendor: 'Meta (self-hosted)',
    models: ['Llama 3.3 70B', 'Llama 3.1 8B'],
    bestFor:
      'Data that cannot leave your infrastructure, or predictable high-volume cost after the hardware is bought.',
    avoidWhen:
      'You do not have GPU capacity and someone who can operate it — self-hosting is an ongoing commitment.',
  },
  {
    vendor: 'Mistral',
    models: ['Mistral Large', 'Mistral Small', 'Codestral'],
    bestFor:
      'Strong European-hosted options and efficient small models for classification workloads.',
    avoidWhen:
      'You need the deepest tool-calling reliability and cannot tolerate a higher error rate.',
  },
  {
    vendor: 'Open models (via a provider)',
    models: ['DeepSeek', 'Qwen 2.5', 'Mistral Nemo'],
    bestFor: 'Cost-sensitive workloads where a hosted open-weight model clears your quality bar.',
    avoidWhen:
      'Behaviour is load-bearing and you need the strongest reasoning available at that price point.',
  },
] as const

/** Retrieval architecture patterns we deploy. */
export type RagPattern = {
  slug: string
  name: string
  summary: string
  /** The problem this pattern solves. */
  useWhen: string
  /** What it costs you. */
  tradeoff: string
  stack: readonly string[]
}

export const ragPatterns: readonly RagPattern[] = [
  {
    slug: 'naive-rag',
    name: 'Baseline RAG',
    summary: 'Embed, retrieve top-k, generate. The honest starting point.',
    useWhen:
      'Your corpus is small, well-structured and reasonably homogeneous — documentation, a policy library, a help centre.',
    tradeoff:
      'Fails quietly on the questions you care most about. It has no way to say "I do not know", so it will confabulate a confident answer from three loosely related passages.',
    stack: ['Embeddings API', 'pgvector', 'Basic retrieval loop'],
  },
  {
    slug: 'hybrid-rag',
    name: 'Hybrid retrieval',
    summary: 'Semantic and lexical search fused with reciprocal rank fusion.',
    useWhen:
      'Your users search with exact identifiers — part numbers, error codes, product SKUs, names.',
    tradeoff:
      'Roughly doubles the retrieval budget and adds a fusion parameter that needs tuning against a real query set.',
    stack: ['pgvector', 'Postgres full-text', 'RRF', 'Cross-encoder reranking'],
  },
  {
    slug: 'agentic-rag',
    name: 'Agentic retrieval',
    summary: 'A model plans queries, calls tools, and iterates until it can answer or gives up.',
    useWhen:
      'Answering genuinely requires multiple lookups — cross-referencing records, or a question whose scope you cannot know in advance.',
    tradeoff:
      'Cost and latency both multiply per hop, and it is much harder to evaluate. We cap it at a fixed number of iterations for this reason.',
    stack: ['Tool calling', 'Query planning', 'Iterative retrieval', 'Hard iteration cap'],
  },
  {
    slug: 'named-entities',
    name: 'Entity-aware RAG',
    summary: 'Retrieval anchored to a knowledge graph of real entities and their relations.',
    useWhen:
      'Questions hinge on relationships — "which of these suppliers also serves that region", "what changed on this account".',
    tradeoff:
      'Requires reliable entity data to start with, and graph upkeep becomes an ongoing cost rather than a one-off.',
    stack: ['Knowledge graph', 'Entity resolution', 'Hybrid retrieval'],
  },
  {
    slug: 'correction-rag',
    name: 'Self-correcting RAG',
    summary:
      'The answer is retrieved, checked against its sources, and revised if the check fails.',
    useWhen:
      'Hallucination risk is the dominant concern — regulated advice, legal or clinical context.',
    tradeoff:
      'Doubles inference cost for a measurable accuracy gain, but the checker needs its own evaluation or you are just adding confidence.',
    stack: ['Citation verification', 'Answer grading', 'Revision loop'],
  },
] as const

/** Our engineering commitments on AI work, stated as measurable practices. */
export type AiPrinciple = {
  title: string
  body: string
  /** How you can tell we actually did it. */
  evidence: string
}

export const aiPrinciples: readonly AiPrinciple[] = [
  {
    title: 'Evaluation before features',
    body: 'The evaluation harness ships before the feature does. If you cannot measure whether an answer got better, you have changed the system, not improved it.',
    evidence: 'A labelled regression suite in your repo, run on every prompt or model change.',
  },
  {
    title: 'Shadow mode first',
    body: 'The system runs against live traffic silently for at least a week before it answers a single real question.',
    evidence:
      'A scored comparison of shadow output against human answers, with the accuracy number in writing.',
  },
  {
    title: 'Ability to decline',
    body: 'Confidence thresholds that escalate to a human instead of guessing. A refusal costs seconds; a confident wrong answer costs a customer.',
    evidence:
      'Every answer carries a confidence score, and low-confidence queries route to a person.',
  },
  {
    title: 'Full traceability',
    body: 'Every answer stores the retrieved documents, their scores, the prompt and the model version.',
    evidence:
      'Any historical answer can be reproduced exactly, which is usually a legal requirement anyway.',
  },
  {
    title: 'Cost treated as a first-class metric',
    body: 'Cost per resolved task is tracked from week one, alongside accuracy, in the same dashboard.',
    evidence: 'A cost-per-outcome figure you can put next to the accuracy figure and trust.',
  },
  {
    title: 'Boring retrieval over clever prompts',
    body: 'Most retrieval failures are data problems, not prompt problems. We fix chunking and metadata before reaching for prompt engineering.',
    evidence:
      'A chunking strategy chosen against a real query set, with the failing queries documented.',
  },
] as const

/** Published AI-focused case studies. */
export type AiCaseStudy = {
  slug: string
  title: string
  client: string
  year: number
  summary: string
  challenge: string
  approach: readonly string[]
  outcome: string
  metrics: readonly { label: string; value: string }[]
  stack: readonly string[]
}

export const aiCaseStudies: readonly AiCaseStudy[] = [
  {
    slug: 'support-rag-harness',
    title: 'An evaluation harness that caught three regressions before launch',
    client: 'Heliostat',
    year: 2026,
    summary:
      'Retrieval over 14,000 support articles, gated behind an accuracy number before it answered anything.',
    challenge:
      'The team wanted to deflect routine enquiries but had no way to tell whether the assistant was helping or quietly making things worse. There was no measurement, so there was no way to improve.',
    approach: [
      'Built a labelled evaluation set from 2,000 historical tickets, scored by the support team who knew the answers.',
      'Tested four chunking strategies against that set rather than picking one by intuition — the obvious choice lost.',
      'Added confidence thresholds that escalate rather than guess, calibrated against the same set.',
      'Ran in shadow mode against live traffic for eleven days before enabling responses.',
    ],
    outcome:
      'Now resolves a third of routine enquiries at 94% measured accuracy. The harness caught a documentation restructure that broke chunk boundaries, and a model upgrade that was three points worse on their domain.',
    metrics: [
      { label: 'Enquiries deflected', value: '33%' },
      { label: 'Measured accuracy', value: '94%' },
      { label: 'Regressions caught', value: '3 pre-launch' },
      { label: 'Cost per resolution', value: '−78%' },
    ],
    stack: ['Claude Sonnet', 'pgvector', 'Next.js', 'Playwright', 'TypeScript'],
  },
  {
    slug: 'document-intake-extraction',
    title: 'Turning 40,000 scanned invoices into structured data',
    client: 'Ashgrove Group',
    year: 2026,
    summary:
      'A vision-based extraction pipeline with a human review queue for anything below confidence.',
    challenge:
      'Four decades of scanned invoices in a filing cabinet, with no searchable record. Manual entry would take a person-year and still be inconsistent.',
    approach: [
      'Started with a stratified sample of 400 documents to establish a realistic accuracy baseline before committing to an approach.',
      'Used vision models for the scan quality problems rather than trying to preprocess 40,000 images into something cleaner.',
      'Routed anything below threshold to a review queue, which turned out to be roughly 6% of documents — cheap to staff.',
      'Structured the output against the existing finance chart of accounts rather than inventing a schema.',
    ],
    outcome:
      'Processed the archive in five weeks with 97.8% field accuracy. The chart of accounts was finally queryable, which changed how month-end reconciliation worked.',
    metrics: [
      { label: 'Field accuracy', value: '97.8%' },
      { label: 'Documents processed', value: '40,000' },
      { label: 'Human review needed', value: '6%' },
      { label: 'Manual entry hours saved', value: '~1,900' },
    ],
    stack: ['GPT-4.1 vision', 'Claude Opus', 'Python', 'PostgreSQL'],
  },
  {
    slug: 'contract-clause-analysis',
    title: 'Flagging contract risk clauses across a live portfolio',
    client: 'Precision Components',
    year: 2025,
    summary:
      'Clause-level extraction against a house playbook, with every finding traceable to its source text.',
    challenge:
      'Legal review was the bottleneck in signing, and it was being done by reading every agreement in full. The risk was in the clauses nobody had time to read.',
    approach: [
      'Encoded the company playbook as explicit checks rather than a general "is this risky" prompt, which made results testable.',
      'Extracted clauses to their source paragraph, so a lawyer could check a finding in seconds rather than minutes.',
      'Set a deliberately conservative threshold — a false negative in a contract is far more costly than a false positive.',
      'Tracked precision per clause type separately, because "acceptable" varies by section of the agreement.',
    ],
    outcome:
      'Legal now reviews only flagged clauses. Average contract turnaround went from twelve days to four, and two liability caps that would have been signed were caught.',
    metrics: [
      { label: 'Review time', value: '12 days → 4 days' },
      { label: 'Clause precision', value: '91%' },
      { label: 'Contracts flagged', value: '100%' },
      { label: 'Risk caught', value: '2 material' },
    ],
    stack: ['Claude Opus', 'Claude Sonnet', 'TypeScript', 'S3', 'pgvector'],
  },
]

export function getAiCaseStudy(slug: string) {
  return aiCaseStudies.find((item) => item.slug === slug)
}

export function getRagPattern(slug: string) {
  return ragPatterns.find((pattern) => pattern.slug === slug)
}
