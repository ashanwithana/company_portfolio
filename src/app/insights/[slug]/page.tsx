import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Breadcrumbs, BreadcrumbSchema } from '@/components/layout/page'
import { CtaBand } from '@/components/ui/cta-band'
import { Tag } from '@/components/ui/badge'
import { formatPostDate } from '@/content/posts'
import { getAllPosts } from '@/content/posts-index'
import { siteConfig } from '@/content/site'

/** Pre-render every post at build time. */
export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const post = getAllPosts().find((item) => item.slug === slug)

  if (!post) return { title: 'Post not found' }

  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/insights/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      url: `${siteConfig.url}/insights/${post.slug}`,
      publishedTime: post.date,
      authors: [post.author],
      tags: [...post.tags],
    },
  }
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params
  const posts = getAllPosts()
  const post = posts.find((item) => item.slug === slug)

  if (!post) notFound()

  const index = posts.findIndex((item) => item.slug === slug)
  const newer = index > 0 ? posts[index - 1] : undefined
  const older = index < posts.length - 1 ? posts[index + 1] : undefined

  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Insights', href: '/insights' },
    { label: post.title },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'Organization', name: siteConfig.nameWithSuffix },
    keywords: post.tags.join(', '),
    mainEntityOfPage: `${siteConfig.url}/insights/${post.slug}`,
  }

  const Body = post.Content

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbSchema items={crumbs} />

      <header className="container-page pt-32 pb-10 md:pt-40 md:pb-14">
        <Breadcrumbs items={crumbs} />

        <h1 className="mt-8 max-w-4xl text-4xl leading-[1.08] text-balance sm:text-5xl">
          {post.title}
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {post.summary}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 label text-[0.6rem] text-muted-foreground">
          <span>
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          </span>
          <span aria-hidden="true">·</span>
          <span>{post.readingTimeMinutes} min read</span>
          <span aria-hidden="true">·</span>
          <span>By {post.author}</span>
        </div>

        <ul className="mt-6 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <li key={tag}>
              <Link href={`/insights?tag=${encodeURIComponent(tag)}`}>
                <Tag>{tag}</Tag>
              </Link>
            </li>
          ))}
        </ul>
      </header>

      <div className="container-page border-t border-border pt-12 pb-20 md:pb-28">
        <Body />
      </div>

      {/* Prev / next */}
      <nav aria-label="More articles" className="tone-paper">
        <div className="container-page grid gap-px sm:grid-cols-2">
          {newer ? (
            <Link
              href={`/insights/${newer.slug}`}
              className="group flex flex-col gap-2 py-10 pr-6 sm:border-r sm:border-border"
            >
              <span className="label text-[0.55rem] text-muted-foreground">Newer</span>
              <span className="text-lg leading-snug transition-colors group-hover:text-coral">
                {newer.title}
              </span>
            </Link>
          ) : (
            <span />
          )}

          {older ? (
            <Link
              href={`/insights/${older.slug}`}
              className="group flex flex-col gap-2 py-10 sm:items-end sm:pl-6 sm:text-right"
            >
              <span className="label text-[0.55rem] text-muted-foreground">Older</span>
              <span className="text-lg leading-snug transition-colors group-hover:text-coral">
                {older.title}
              </span>
            </Link>
          ) : null}
        </div>
      </nav>

      <CtaBand
        eyebrow="Related work"
        title="This is the theory. Here is the practice."
        body="The same thinking, applied to a real engagement with measured outcomes."
        actionLabel="See our work"
        href="/work"
      />
    </article>
  )
}
