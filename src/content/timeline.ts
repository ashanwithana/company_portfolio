export type TimelineKind = 'work' | 'edu'

export type TimelineEntry = {
  id: string
  period: string
  kind: TimelineKind
  kindLabel: 'Work' | 'EDU'
  title: string
  org: string
  body: string
  /** Highlights the newest entry and animates its dot. */
  current?: boolean
}

export const timeline: readonly TimelineEntry[] = [
  {
    id: 'independent-hacker',
    period: '2024 — Present',
    kind: 'work',
    kindLabel: 'Work',
    title: 'Independent Hacker',
    org: 'Personal Lab',
    body: 'Shipping side projects, experimenting with LLMs, and diving deep into modern React paradigms.',
    current: true,
  },
  {
    id: 'freelance-engineer',
    period: '2023',
    kind: 'work',
    kindLabel: 'Work',
    title: 'Freelance Engineer',
    org: 'Self-employed',
    body: 'Worked with a few early-stage startups to help them build their MVPs from scratch using Next.js and Firebase.',
  },
  {
    id: 'btech-cs',
    period: '2021 — 2025',
    kind: 'edu',
    kindLabel: 'EDU',
    title: 'B.Tech in Computer Science',
    org: 'University',
    body: 'Surviving algorithms, crushing hackathons, and figuring out how things actually work under the hood.',
  },
] as const
