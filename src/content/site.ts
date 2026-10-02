export const siteConfig = {
  name: 'Nikhil Kumar',
  shortName: 'Nikhil.',
  title: 'Nikhil — Full-stack Engineer & Product Designer',
  description:
    'Premium portfolio of Nikhil — a full-stack engineer & designer building cinematic software at the seam of code, motion and craft.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nikhilkumar.codes',
  locale: 'en_US',
  email: 'nikhilkumar5177@gmail.com',
  location: 'India',
  avatar: '/avatar.png',
  availability: {
    badge: 'Available for select work',
    window: 'Q3 / Q4 2026',
    body: 'Based in India. I respond to most messages within 24 hours. For urgent things, email me directly.',
  },
} as const

export type SocialLink = {
  label: string
  href: string
  handle: string
}

export const socialLinks: readonly SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/nikhilkumar5177', handle: '@nikhilkumar5177' },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/nikhilkumar5177',
    handle: 'in/nikhilkumar5177',
  },
  { label: 'X / Twitter', href: 'https://x.com/nikhilKumar5177', handle: '@nikhilKumar5177' },
] as const

export type NavSection = {
  id: string
  label: string
  title: string
  description: string
}

export const navSections: readonly NavSection[] = [
  {
    id: 'about',
    label: 'About',
    title: 'Building Products through code, curiosity and experimentation.',
    description: 'A little context on how and why I build things.',
  },
  {
    id: 'work',
    label: 'Work',
    title: 'A small set of things I’m proud to have built.',
    description:
      'Six projects from the last few years — across product, OSS and AI infrastructure.',
  },
  {
    id: 'skills',
    label: 'Skills',
    title: 'The stack I reach for when it matters.',
    description: 'The tools behind the work, grouped by what they actually do.',
  },
  {
    id: 'path',
    label: 'Path',
    title: 'A few stops along the way.',
    description: 'Roles, education and the odd detour in between.',
  },
  {
    id: 'contact',
    label: 'Contact',
    title: 'Have something interesting to build?',
    description:
      'I take on a small number of consulting and collaboration projects each quarter. Let’s talk.',
  },
] as const

export const heroContent = {
  headline: ['Builds weird', 'and useful', 'stuff.'],
  /** Rotated by the typewriter in the hero. */
  roles: [
    'Frontend Engineer.',
    'Creative Developer.',
    'Systems Architect.',
    'Product Designer.',
  ],
  body: "I'm Nikhil. I write code that lives on the web. Most of my time is spent crafting React interfaces, writing backend logic, and tinkering with new AI models.",
  primaryCta: { label: 'Get in touch', href: '#contact' },
  secondaryCta: { label: 'View selected work', href: '#work' },
} as const

export type Stat = {
  value: number
  suffix: string
  label: string
  /** Decimal places used by the animated counter. */
  decimals?: number
}

export const aboutContent = {
  name: 'Nikhil Kumar',
  status: '◉ Live · India',
  lead: ['I enjoy building modern web applications', 'that feel fast, interactive and intuitive.'],
  body: 'Most of my work revolves around frontend engineering, backend systems and experimenting with AI tools. I like turning ideas into usable products, learning new technologies and refining small UI details that improve user experience.',
  stats: [
    { value: 42, suffix: '+', label: 'Projects shipped' },
    { value: 24, suffix: '', label: 'Tech stack' },
    { value: 3100, suffix: '+', label: 'GitHub commits' },
    { value: 0.87, suffix: '%', label: 'Coffee consumed', decimals: 2 },
  ] satisfies readonly Stat[],
} as const

export const contactContent = {
  directLabel: 'Direct',
  formTitle: 'Say hello',
  socialsTitle: 'Socials',
} as const

export const footerContent = {
  copyright: '© 2026 — Built with a keyboard and some coffee.',
  hint: 'India · ⌘K to navigate',
} as const
