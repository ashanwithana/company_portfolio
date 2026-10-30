import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Breadcrumbs, BreadcrumbSchema, splitHeadline } from '@/components/layout/page'
import { HairlineGrid } from '@/components/ui/hairline-grid'
import { HeadlineReveal } from '@/components/ui/headline-reveal'
import { CtaBand } from '@/components/ui/cta-band'
import { Tag } from '@/components/ui/badge'
import { coverFor, coverSize } from '@/content/covers'
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

  const cover = coverFor(post.slug)
  const images = cover
    ? {
        images: [
          {
            url: cover.src,
            width: coverSize.width,
            height: coverSize.height,
            alt: cover.alt,
          },
        ],
      }
    : {}

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
      ...images,
    },
  }
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params
  const posts = getAllPosts()
  const post = posts.find((item) => item.slug === slug)

  if (!post) notFound()

  const cover = coverFor(post.slug)
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

      <header className="relative overflow-hidden border-b border-border pt-32 pb-14 md:pt-40 md:pb-20">
        <HairlineGrid />

        <div className="relative z-20 mx-auto w-full max-w-[1600px] px-4 md:px-8">
          <Breadcrumbs items={crumbs} />

          <div className="mt-12 flex items-center gap-4">
            <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
              <time dateTime={post.date}>{formatPostDate(post.date)}</time> ·{' '}
              {post.readingTimeMinutes} min read
            </span>
            <span aria-hidden="true" className="h-px max-w-[160px] flex-1 bg-border-strong" />
          </div>

          <h1 className="mt-8 max-w-6xl text-[clamp(2rem,4.4vw,4.5rem)] leading-[0.95] font-thin tracking-tighter text-balance uppercase">
            <HeadlineReveal text={splitHeadline(post.title)} emphasizeLast />
          </h1>

          <p
            className="mt-10 max-w-2xl text-base leading-relaxed font-light text-muted-foreground md:text-lg"
            style={{ animation: 'fade-up .8s cubic-bezier(.16,1,.3,1) 620ms both' }}
          >
            {post.summary}
          </p>
        </div>
      </header>

      {cover ? (
        <figure className="container-page pt-12 md:pt-16">
          <Image
            src={cover.src}
            alt={cover.alt}
            width={coverSize.width}
            height={coverSize.height}
            priority
            sizes="(min-width: 1600px) 1536px, 100vw"
            className="aspect-[21/8] max-h-[22rem] w-full border border-border object-cover"
          />
        </figure>
      ) : null}

      {/* Body: author and topics on the left, the article on the right. */}
      <div className="mx-auto grid w-full max-w-[1600px] gap-10 px-4 py-14 md:px-8 md:py-20 lg:grid-cols-12 lg:gap-8">
        <aside className="lg:col-span-3">
          <div className="lg:sticky lg:top-28">
            <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
              Written by
            </p>
            <p className="mt-3 text-lg font-light">{post.author}</p>

            <p className="mt-8 font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
              Topics
            </p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <li key={tag}>
                  <Link href={`/insights?tag=${encodeURIComponent(tag)}`}>
                    <Tag>{tag}</Tag>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="lg:col-span-8 lg:col-start-5">
          <Body />
        </div>
      </div>

      {/* Prev / next */}
      <nav aria-label="More articles" className="border-t border-border-strong">
        <div className="mx-auto grid w-full max-w-[1600px] sm:grid-cols-2">
          {newer ? (
            <Link
              href={`/insights/${newer.slug}`}
              className="group flex flex-col gap-3 px-4 py-10 transition-colors hover:bg-foreground hover:text-background focus-visible:bg-foreground focus-visible:text-background sm:border-r sm:border-border md:px-8 md:py-14"
            >
              <span className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase group-hover:text-background/60">
                ← Newer
              </span>
              <span className="text-xl leading-snug font-light md:text-2xl">{newer.title}</span>
            </Link>
          ) : (
            <span />
          )}

          {older ? (
            <Link
              href={`/insights/${older.slug}`}
              className="group flex flex-col gap-3 px-4 py-10 transition-colors hover:bg-foreground hover:text-background focus-visible:bg-foreground focus-visible:text-background sm:items-end sm:text-right md:px-8 md:py-14"
            >
              <span className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase group-hover:text-background/60">
                Older →
              </span>
              <span className="text-xl leading-snug font-light md:text-2xl">{older.title}</span>
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
