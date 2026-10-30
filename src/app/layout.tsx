import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { cookies } from 'next/headers'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ScrollProgress } from '@/components/layout/scroll-progress'
import { Cursor } from '@/components/ui/cursor'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { siteConfig } from '@/content/site'
import { parseTheme, THEME_COOKIE } from '@/lib/theme'

import './globals.css'

/*
 * Inter, self-hosted by next/font (no runtime request to a third party). It is
 * loaded as a variable font so the thin and light weights the display type
 * relies on are available without extra files. Small tracked labels use the
 * system monospace stack, which needs no download.
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.nameWithSuffix,
  authors: [{ name: siteConfig.nameWithSuffix, url: siteConfig.url }],
  creator: siteConfig.nameWithSuffix,
  publisher: siteConfig.nameWithSuffix,
  keywords: [
    'product studio',
    'software engineering',
    'web development agency',
    'product design',
    'design systems',
    'AI integration',
    'platform migration',
    'accessibility',
    'Colombo',
    'Sri Lanka',
  ],
  category: 'technology',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.nameWithSuffix,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: siteConfig.title }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-touch-icon.png' }],
  },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f3ee' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  /**
   * Read the persisted theme on the server.
   *
   * Rendering the correct class in the very first byte of HTML is what prevents
   * both the flash of the wrong theme and any hydration mismatch — there is no
   * client-side correction step for React to disagree with.
   */
  const cookieStore = await cookies()
  const theme = parseTheme(cookieStore.get(THEME_COOKIE)?.value)

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.nameWithSuffix,
    url: siteConfig.url,
    email: siteConfig.email,
    description: siteConfig.description,
    foundingDate: String(siteConfig.foundedYear),
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.country,
    },
    sameAs: Object.values(siteConfig.socials),
  }

  return (
    // The class comes from the theme cookie above, so server and client markup
    // agree and no suppressHydrationWarning is needed.
    <html lang="en-GB" className={theme} style={{ colorScheme: theme }}>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider initialTheme={theme}>
          <a
            href="#main"
            className="no-print sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:border focus:border-border focus:bg-background focus:px-5 focus:py-3 focus:font-mono focus:text-xs focus:tracking-[0.2em] focus:uppercase"
          >
            Skip to content
          </a>

          <ScrollProgress />
          <Header />
          <Cursor />

          <main id="main">{children}</main>

          <Footer />
        </ThemeProvider>

        {/*
          Organization structured data. Rendered in the server component so React
          emits a real <script> tag rather than a hoisted-and-ignored one.
        */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  )
}
