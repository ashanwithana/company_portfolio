import type { Metadata, Viewport } from 'next'
import { DM_Sans, JetBrains_Mono, Syne } from 'next/font/google'
import { cookies } from 'next/headers'

import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { ScrollProgress } from '@/components/layout/scroll-progress'
import { Cursor } from '@/components/ui/cursor'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { siteConfig, socialLinks } from '@/content/site'
import { parseTheme, THEME_COOKIE } from '@/lib/theme'

import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
})

const syne = Syne({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'swap',
  variable: '--font-syne',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  keywords: [
    'portfolio',
    'full-stack engineer',
    'product designer',
    'React',
    'Next.js',
    'TypeScript',
    'indie hacker',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
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
  category: 'portfolio',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbfbfa' },
    { media: '(prefers-color-scheme: dark)', color: '#0e0e14' },
  ],
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  /**
   * Read the persisted theme on the server.
   *
   * Rendering the correct class in the very first byte of HTML is what prevents
   * both the flash of the wrong theme and any hydration mismatch — there is no
   * client-side correction step for React to disagree with.
   */
  const cookieStore = await cookies()
  const theme = parseTheme(cookieStore.get(THEME_COOKIE)?.value)

  // Person schema gives search engines structured context about the author.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    url: siteConfig.url,
    email: `mailto:${siteConfig.email}`,
    jobTitle: 'Full-stack Engineer',
    description: siteConfig.description,
    sameAs: socialLinks.map((social) => social.href),
    address: { '@type': 'PostalAddress', addressCountry: 'IN' },
  }

  return (
    // The class is derived from the theme cookie above, so server and client
    // markup agree and no suppressHydrationWarning is needed.
    <html lang="en" className={theme} style={{ colorScheme: theme }}>
      <body
        className={`${dmSans.variable} ${syne.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
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

          {/*
        Structured data for search engines. Rendered here, in the server
        component, so React emits a real <script> tag rather than a hoisted one.
        Static, developer-authored literal — no user input reaches it.
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main id="main">{children}</main>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
