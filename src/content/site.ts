/**
 * Central site configuration.
 *
 * The company name, domain and contact details are deliberately collected here
 * and nowhere else. Renaming the business is a single-file change — every page,
 * metadata tag, sitemap entry and email link reads from this module.
 */

export const siteConfig = {
  /** Short name used in the header and footer lockup. */
  name: 'Northlight',
  nameWithSuffix: 'Northlight Studio',
  /** Appended after the name in the logo lockup, e.g. "Northlight." */
  logoSuffix: '.',
  title: 'Northlight — Product studio & software engineering',
  tagline: 'We design and build software that earns its place.',
  description:
    'Northlight is a product studio and software engineering partner. We take ambitious ideas from first sketch to production, and ship software that holds up in the real world.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://northlight.example.com',
  locale: 'en_US',
  email: 'hello@northlight.example.com',
  phone: '+44 20 7946 0000',
  /** HQ used in the footer and contact page. */
  location: 'London, UK',
  address: {
    street: '18 Wharf Road',
    city: 'London',
    region: 'London',
    postalCode: 'N1 7GU',
    country: 'GB',
    countryName: 'United Kingdom',
  },
  foundedYear: 2019,
  socials: {
    github: 'https://github.com/northlight-studio',
    linkedin: 'https://www.linkedin.com/company/northlight-studio',
    x: 'https://x.com/northlighthq',
    dribbble: 'https://dribbble.com/northlight-studio',
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
  { href: '/contact', label: 'Contact' },
] as const

/** Routes surfaced in the command palette, ordered by group. */
export const practiceRoutes: readonly NavItem[] = [
  { href: '/method', label: 'Method', shortcut: 'M' },
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
    { href: '/contact', label: 'Contact' },
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
  /** Rendered inside the availability card on /contact. */
  availability: {
    badge: 'Currently taking new work',
    window: 'Q3 2026',
    body: 'We take on a small number of engagements each quarter. Tell us what you are building and we will come back within two working days.',
  },
  responseTime: 'Most enquiries get a reply within 2 working days.',
} as const

export const footerContent = {
  hint: '⌘K to navigate',
  builtWith: 'Built with care.',
} as const
