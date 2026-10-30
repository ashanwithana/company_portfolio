import MigrationBody from '@/content/post-bodies/migration-not-rewrite'
import PerformanceBody from '@/content/post-bodies/measuring-performance'
import EvaluationBody from '@/content/post-bodies/evaluating-ai-features'
import DesignSystemsBody from '@/content/post-bodies/design-systems-that-adopted'
import OdooGuideBody from '@/content/post-bodies/odoo-implementation-guide'
import RagChecklistBody from '@/content/post-bodies/rag-evaluation-checklist'
import OdooVsDynamicsBody from '@/content/post-bodies/odoo-vs-dynamics'
import SalesforcePitfallsBody from '@/content/post-bodies/salesforce-pitfalls'
import RagVsFinetuningBody from '@/content/post-bodies/rag-vs-finetuning'
import type { Post } from '@/content/posts'
import type { PostFrontmatter } from '@/content/posts'

/**
 * Post registry.
 *
 * Frontmatter lives here as a plain data array so the listing page can sort and
 * filter without importing every article body. `Content` is imported eagerly,
 * which is fine at this scale — with more than ~50 posts you would switch to
 * per-slug dynamic imports.
 */
type PostEntry = PostFrontmatter & { Content: Post['Content'] }

const entries: readonly PostEntry[] = [
  {
    slug: 'rag-vs-finetuning',
    title: 'RAG or fine-tuning? How to tell which problem you have',
    summary:
      'Retrieval grounds answers in your documents; fine-tuning changes behaviour. The sequence that works, and what each one costs.',
    date: '2026-10-20',
    readingTimeMinutes: 8,
    author: 'Ravindu Withana',
    tags: ['AI', 'RAG', 'Fine-tuning'],
    featured: true,
    Content: RagVsFinetuningBody,
  },
  {
    slug: 'odoo-vs-dynamics-365',
    title: 'Odoo vs Dynamics 365, from a studio that implements both',
    summary:
      'No sales deck: where each platform wins, the costs nobody puts in proposals, and when the answer is neither.',
    date: '2026-10-12',
    readingTimeMinutes: 9,
    author: 'Ravindu Withana',
    tags: ['Odoo', 'Dynamics 365', 'ERP'],
    featured: true,
    Content: OdooVsDynamicsBody,
  },
  {
    slug: 'salesforce-implementation-pitfalls',
    title: 'Five ways Salesforce implementations fail (and the fixes)',
    summary:
      'Fields nobody owns, integrations deferred to phase two, activity metrics as targets — all preventable, none in the sales deck.',
    date: '2026-10-05',
    readingTimeMinutes: 7,
    author: 'Ravindu Withana',
    tags: ['Salesforce', 'CRM', 'Implementation'],
    Content: SalesforcePitfallsBody,
  },
  {
    slug: 'odoo-implementation-guide',
    title: 'The Odoo implementation guide we wish every project started with',
    summary:
      'Data before modules, rehearsed migrations, and training the users instead of the approvers.',
    date: '2026-09-18',
    readingTimeMinutes: 9,
    author: 'Ravindu Withana',
    tags: ['Odoo', 'ERP', 'Implementation'],
    featured: true,
    Content: OdooGuideBody,
  },
  {
    slug: 'rag-evaluation-checklist',
    title: 'The RAG evaluation checklist we run before anything ships',
    summary:
      'Seven checks — labelled sets, decline thresholds, shadow mode — that separate a measured system from a promising demo.',
    date: '2026-07-30',
    readingTimeMinutes: 8,
    author: 'Ravindu Withana',
    tags: ['AI', 'RAG', 'Evaluation'],
    featured: true,
    Content: RagChecklistBody,
  },
  {
    slug: 'migration-not-rewrite',
    title: 'Migrate, do not rewrite',
    summary:
      'Why we have spent seven years talking clients out of full rewrites, and what we do instead.',
    date: '2026-08-12',
    readingTimeMinutes: 7,
    author: 'Ravindu Withana',
    tags: ['Engineering', 'Architecture'],
    featured: true,
    Content: MigrationBody,
  },
  {
    slug: 'measuring-performance',
    title: 'Measure the phone in your pocket',
    summary:
      'Lab scores are useful and they are not the same thing as fast. How we baseline and fix real-user performance.',
    date: '2026-06-24',
    readingTimeMinutes: 6,
    author: 'Bhashana Bogoda',
    tags: ['Performance', 'Front-end'],
    featured: true,
    Content: PerformanceBody,
  },
  {
    slug: 'evaluating-ai-features',
    title: 'You cannot ship an AI feature you have not measured',
    summary:
      'Evaluation harnesses, confidence thresholds and shadow mode — how we keep retrieval systems from failing quietly.',
    date: '2026-05-09',
    readingTimeMinutes: 8,
    author: 'Ravindu Withana',
    tags: ['AI', 'Evaluation'],
    featured: true,
    Content: EvaluationBody,
  },
  {
    slug: 'design-systems-that-adopted',
    title: 'Design systems that actually got adopted',
    summary:
      'Most design systems fail for organisational reasons. What we learned getting one to 94% adoption.',
    date: '2026-03-17',
    readingTimeMinutes: 6,
    author: 'Kalindu Gayanjith',
    tags: ['Design systems', 'Process'],
    Content: DesignSystemsBody,
  },
]

/** All posts, newest first. */
export function getAllPosts(): Post[] {
  return [...entries].sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
}

export function getFeaturedPosts(count = 3): Post[] {
  return getAllPosts()
    .filter((post) => post.featured)
    .slice(0, count)
}
