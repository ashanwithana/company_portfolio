/**
 * Central site configuration.
 *
 * The company name, domain and contact details are deliberately collected here
 * and nowhere else. Renaming the business is a single-file change — every page,
 * metadata tag, sitemap entry and email link reads from this module.
 */

export const siteConfig = {
  /** Short name used in the header and footer lockup. */
  name: 'SketchLabs',
  nameWithSuffix: 'SketchLabs',
  /** Appended after the name in the logo lockup, e.g. "SketchLabs." */
  logoSuffix: '.',
  title: 'SketchLabs — Product studio & software engineering',
  tagline: 'Sketched with intent. Engineered to endure.',
  description:
    'A Colombo studio for product design, software and AI engineering. Considered work, from first sketch to production, for teams that hold their software to a higher standard.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sketchlabs.example.com',
  locale: 'en_LK',
  email: 'hello@thesketchlabs.com',
  phone: '+94 11 234 5678',
  /** HQ used in the footer and contact page. */
  location: 'Colombo, Sri Lanka',
  address: {
    street: '42 Galle Road',
    city: 'Colombo',
    region: 'Western Province',
    postalCode: '00300',
    country: 'LK',
    countryName: 'Sri Lanka',
  },
  foundedYear: 2019,
  socials: {
    github: 'https://github.com/sketchlabs-studio',
    linkedin: 'https://www.linkedin.com/company/sketchlabs-studio',
    x: 'https://x.com/sketchlabshq',
    dribbble: 'https://dribbble.com/sketchlabs-studio',
  },
} as const

export type NavItem = {
  href: string
  label: string
  /** Shown in the command palette as a keyboard shortcut hint. */
  shortcut?: string
}

/** Primary navigation, shared by the header, mobile sheet and command palette. */
/**
 * Header navigation.
 *
 * Deliberately short — six items is the most that stays legible in a single
 * pill at typical desktop widths. The specialist tracks (Enterprise, AI) are
 * reachable from the services page, the footer, the command palette and the
 * home page, which is where someone looking for them would actually start.
 */
export const primaryNav: readonly NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services', shortcut: 'S' },
  { href: '/work', label: 'Work', shortcut: 'W' },
  { href: '/about', label: 'About', shortcut: 'A' },
  { href: '/insights', label: 'Insights', shortcut: 'B' },
  { href: '/faq', label: 'FAQ' },
] as const

/** Routes surfaced in the command palette, ordered by group. */
export const practiceRoutes: readonly NavItem[] = [
  { href: '/discipline', label: 'Discipline', shortcut: 'D' },
  { href: '/enterprise', label: 'Enterprise systems', shortcut: 'E' },
  { href: '/ai', label: 'AI engineering', shortcut: 'I' },
  { href: '/careers', label: 'Careers', shortcut: 'C' },
] as const

/** Every top-level route, used by the sitemap and the 404 page. */
export const allRoutes: readonly NavItem[] = [...primaryNav, ...practiceRoutes]

export const footerNav = {
  company: [
    { href: '/about', label: 'About' },
    { href: '/careers', label: 'Careers' },
    { href: '/insights', label: 'Insights' },
    { href: '/faq', label: 'FAQ' },
  ],
  /** Specialist practice tracks, linked from the services page too. */
  practices: [
    { href: '/enterprise', label: 'Enterprise systems' },
    { href: '/ai', label: 'AI engineering' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy' },
    { href: '/accessibility', label: 'Accessibility' },
  ],
} as const

export const contactContent = {
  directLabel: 'Direct',
  formTitle: 'Start a project',
  socialsTitle: 'Elsewhere',
  /** Rendered inside the availability card on /start-a-project. */
  availability: {
    badge: 'Currently booked',
    window: 'Q3 2026',
    body: 'We are fully committed to current engagements right now. You are still welcome to send an enquiry — we will reply with honest timelines, or point you somewhere better.',
  },
  responseTime: 'Most enquiries get a reply within 2 working days.',
} as const

export const footerContent = {
  hint: '⌘K to navigate',
  builtWith: 'Built with care.',
} as const
