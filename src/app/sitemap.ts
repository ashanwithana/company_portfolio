import type { MetadataRoute } from 'next'

import { publishedCaseStudies } from '@/content/case-studies'
import { getAllPosts } from '@/content/posts-index'
import { allRoutes, siteConfig } from '@/content/site'
import { roles } from '@/content/roles'
import { services } from '@/content/services'

export const dynamic = 'force-static'

function pageUrl(path: string): string {
  const normalized = path.endsWith('/') ? path : `${path}/`
  return `${siteConfig.url}${normalized}`
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes = allRoutes.map((item) => ({
    url: pageUrl(item.href),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: item.href === '/' ? 1 : 0.8,
  }))

  return [
    ...staticRoutes,
    ...services
      .filter((service) => !service.canonicalHref)
      .map((service) => ({
        url: pageUrl(`/services/${service.slug}`),
        lastModified: now,
        changeFrequency: 'yearly' as const,
        priority: 0.6,
      })),
    ...publishedCaseStudies().map((study) => ({
      url: pageUrl(`/work/${study.slug}`),
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
    ...getAllPosts().map((post) => ({
      url: pageUrl(`/insights/${post.slug}`),
      lastModified: new Date(post.date),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    })),
    ...roles.map((role) => ({
      url: pageUrl(`/careers/${role.slug}`),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.4,
    })),
  ]
}