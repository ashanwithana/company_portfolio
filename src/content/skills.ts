export type SkillGroup = {
  name: string
  items: readonly string[]
}

export const skillGroups: readonly SkillGroup[] = [
  {
    name: 'Frontend',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redux Toolkit'],
  },
  {
    name: 'Backend',
    items: ['Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'Firebase', 'REST APIs'],
  },
  {
    name: 'AI',
    items: ['OpenAI APIs', 'LangChain', 'RAG Systems', 'Prompt Engineering'],
  },
  { name: 'Tools', items: ['Git', 'GitHub', 'Docker', 'Linux', 'Postman', 'Figma', 'Vercel'] },
] as const

/** Duplicated so the marquee can loop seamlessly at -50% translation. */
export const marqueeItems: readonly string[] = [
  'React',
  'Next.js',
  'TypeScript',
  'Tailwind CSS',
  'Node.js',
  'Express.js',
  'MongoDB',
  'PostgreSQL',
  'Firebase',
  'OpenAI APIs',
  'Git',
  'Linux',
  'Figma',
] as const
