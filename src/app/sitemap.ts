import type { MetadataRoute } from 'next'

import { publishedCaseStudies } from '@/content/case-studies'
import { getAllPosts } from '@/content/posts-index'
import { allRoutes, siteConfig } from '@/content/site'
import { roles } from '@/content/roles'
import { services } from '@/content/services'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes = allRoutes.map((item) => ({
    url: `${siteConfig.url}${item.href}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: item.href === '/' ? 1 : 0.8,
  }))

  return [
    ...staticRoutes,
    ...services.map((service) => ({
      url: `${siteConfig.url}/services/${service.slug}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
    ...publishedCaseStudies().map((study) => ({
      url: `${siteConfig.url}/work/${study.slug}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
    ...getAllPosts().map((post) => ({
      url: `${siteConfig.url}/insights/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    })),
    ...roles.map((role) => ({
      url: `${siteConfig.url}/careers/${role.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.4,
    })),
  ]
}
