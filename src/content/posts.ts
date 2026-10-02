/**
 * Blog / insights.
 *
 * Content lives in typed modules under `src/content/posts/` and is aggregated
 * here. Keeping prose in real `.mdx`-style modules means long articles do not
 * bloat this file, and the index only reads frontmatter.
 */

import type { ComponentType } from 'react'

export type PostFrontmatter = {
  slug: string
  title: string
  /** Used for cards and meta descriptions. */
  summary: string
  date: string
  /** ISO 8601, derived from `date` — sorting uses this. */
  readingTimeMinutes: number
  author: string
  tags: readonly string[]
  featured?: boolean
}

export type Post = PostFrontmatter & {
  /** Parsed markdown body, rendered by the post page. */
  Content: ComponentType
}

/** Sorted newest-first. */
export function sortPosts(posts: readonly Post[]): Post[] {
  return [...posts].sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
}

/** Slug → post lookup used by generateStaticParams and the detail page. */
export function findPost(slug: string, posts: readonly Post[]) {
  return posts.find((post) => post.slug === slug)
}

/** All distinct tags, alphabetised, for the filter UI. */
export function collectTags(posts: readonly Post[]): string[] {
  return [...new Set(posts.flatMap((post) => post.tags))].sort()
}

/** Neighbouring posts, for prev/next navigation on a post page. */
export function adjacentPosts(slug: string, posts: readonly Post[]) {
  const sorted = sortPosts(posts)
  const index = sorted.findIndex((post) => post.slug === slug)

  return {
    previous: index > 0 ? sorted[index - 1] : undefined,
    next: index >= 0 && index < sorted.length - 1 ? sorted[index + 1] : undefined,
  }
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export function formatPostDate(iso: string) {
  return dateFormatter.format(new Date(iso))
}
