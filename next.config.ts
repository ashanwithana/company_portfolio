import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable static export for Cloudflare Pages
  output: 'export',
  trailingSlash: true,

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  experimental: {
    optimizePackageImports: ['motion', 'lucide-react'],
  },
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
  async redirects() {
    return []
  },
  async headers() {
    return []
  },
}

export default nextConfig
