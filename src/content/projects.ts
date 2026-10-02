export const projectCategories = ['all', 'web', 'ai', 'oss'] as const

export type ProjectCategory = Exclude<(typeof projectCategories)[number], 'all'>

export type Project = {
  slug: string
  title: string
  description: string
  category: ProjectCategory
  categoryLabel: 'Web' | 'AI' | 'OSS'
  badge?: 'Featured' | 'Case study'
  href: string
  tech: readonly string[]
  /** Controls the bento grid span. */
  size: 'lg' | 'sm'
  /** Tailwind gradient stops used for the card wash + border. */
  tint: 'primary' | 'mint' | 'coral'
}

export const projects: readonly Project[] = [
  {
    slug: 'ai-chat-assistant',
    title: 'AI Chat Assistant',
    description:
      "A conversational interface wrapped around OpenAI's models, built to test real-time streaming and custom tool calling.",
    category: 'ai',
    categoryLabel: 'AI',
    badge: 'Featured',
    href: 'https://github.com/nikhilkumar5177/ai-chat',
    tech: ['React', 'Node.js', 'OpenAI', 'MongoDB'],
    size: 'lg',
    tint: 'primary',
  },
  {
    slug: 'vision-board',
    title: 'Vision Board',
    description:
      'A drag-and-drop workspace for tracking goals and organizing thoughts. Built to scratch my own itch.',
    category: 'web',
    categoryLabel: 'Web',
    badge: 'Featured',
    href: 'https://github.com/nikhilkumar5177/vision-board',
    tech: ['Next.js', 'Tailwind', 'Firebase'],
    size: 'lg',
    tint: 'mint',
  },
  {
    slug: 'devflow',
    title: 'DevFlow',
    description:
      'A CLI and dashboard combo to track local development hours without getting in the way.',
    category: 'web',
    categoryLabel: 'Web',
    badge: 'Case study',
    href: 'https://github.com/nikhilkumar5177/devflow',
    tech: ['React', 'Express', 'PostgreSQL'],
    size: 'sm',
    tint: 'coral',
  },
  {
    slug: 'interaction-lab',
    title: 'Interaction Lab',
    description:
      'A sandbox for experimenting with framer-motion variants, GSAP timelines, and weird CSS tricks.',
    category: 'oss',
    categoryLabel: 'OSS',
    badge: 'Case study',
    href: 'https://github.com/nikhilkumar5177/motion-lab',
    tech: ['Framer Motion', 'React', 'GSAP'],
    size: 'sm',
    tint: 'mint',
  },
  {
    slug: 'docuchat-rag',
    title: 'DocuChat (RAG)',
    description:
      'Hacked together a pipeline that ingests local markdown files and answers questions based on the vector embeddings.',
    category: 'ai',
    categoryLabel: 'AI',
    badge: 'Case study',
    href: 'https://github.com/nikhilkumar5177/rag-system',
    tech: ['LangChain', 'RAG', 'Pinecone'],
    size: 'sm',
    tint: 'primary',
  },
  {
    slug: 'editorial-dev-hub',
    title: 'editorial-dev-hub',
    description:
      'This very site. A playground for testing out Three.js integration alongside TanStack router and SSR.',
    category: 'oss',
    categoryLabel: 'OSS',
    badge: 'Case study',
    href: 'https://github.com/nikhilkumar5177/editorial-dev-hub',
    tech: ['React', 'Three.js', 'Tailwind'],
    size: 'sm',
    tint: 'coral',
  },
] as const

export const workFilters = [
  { value: 'all', label: 'All' },
  { value: 'web', label: 'Web' },
  { value: 'ai', label: 'AI' },
  { value: 'oss', label: 'OSS' },
] as const satisfies readonly { value: (typeof projectCategories)[number]; label: string }[]

export function filterProjects(category: (typeof projectCategories)[number]) {
  return category === 'all' ? projects : projects.filter((p) => p.category === category)
}
