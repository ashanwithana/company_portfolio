import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
import type { NextConfig } from 'next'

// Lets `next dev` read Cloudflare bindings; a no-op for the build itself.
initOpenNextCloudflareForDev()

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  /**
   * `typedRoutes` is disabled deliberately. It cannot type a template-literal
   * href like `/work/${slug}`, which every dynamic route here uses — so it
   * either rejects correct code or forces casts that defeat the point. Route
   * params are validated at runtime by each page's `generateStaticParams` plus
   * an explicit `notFound()`.
   */
  typedRoutes: false,
  experimental: {
    optimizePackageImports: ['motion', 'lucide-react'],
  },
  async redirects() {
    return [
      // Specialist tracks have canonical practice pages with comparison
      // tables, FAQs and case studies. Keep the /services slugs from
      // existing as thin duplicates.
      {
        source: '/services/enterprise-systems',
        destination: '/enterprise',
        permanent: true,
      },
      {
        source: '/services/ai-engineering',
        destination: '/ai',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ]
  },
}

export default nextConfig
