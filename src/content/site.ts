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
export const primaryNav: readonly NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services', shortcut: 'S' },
  { href: '/work', label: 'Work', shortcut: 'W' },
  { href: '/about', label: 'About', shortcut: 'A' },
  { href: '/blog', label: 'Insights', shortcut: 'B' },
  { href: '/careers', label: 'Careers', shortcut: 'C' },
  { href: '/contact', label: 'Contact' },
] as const

export const footerNav = {
  company: [
    { href: '/about', label: 'About' },
    { href: '/careers', label: 'Careers' },
    { href: '/blog', label: 'Insights' },
    { href: '/contact', label: 'Contact' },
  ],
  services: [] as { href: string; label: string }[],
  legal: [
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
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
