import Link from 'next/link'

import { PageHeader, PageSection } from '@/components/layout/page'
import { Reveal } from '@/components/ui/reveal'
import { Tag } from '@/components/ui/badge'
import { CtaBand } from '@/components/ui/cta-band'
import { formatPostDate, sortPosts } from '@/content/posts'
import { getAllPosts } from '@/content/posts-index'
import { collectTags } from '@/content/posts'

export const metadata = {
  title: 'Insights',
  description:
    'Notes from the work at Northlight — on migrations, performance measurement, AI evaluation and the design systems that actually got adopted.',
}

export default function BlogIndexPage() {
  const posts = sortPosts(getAllPosts())
  const tags = collectTags(posts)
  const [featured, ...rest] = posts

  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Notes from the work."
        lede="Written when we learn something worth passing on, not on a content schedule. If a post saves you two weeks of our mistakes, it has done its job."
      />

      {/* Tag index — plain links, so it works without JavaScript. */}
      <section aria-label="Browse by topic" className="container-page pb-4">
        <ul className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag}>
              <Link
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="inline-flex min-h-9 items-center rounded-full border border-border px-4 font-mono text-[0.65rem] tracking-[0.2em] uppercase transition-colors hover:border-foreground/25 hover:text-foreground"
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <PageSection className="pt-12">
        {/* Featured post */}
        {featured ? (
          <Reveal as="article" className="mb-16 block">
            <Link
              href={`/blog/${featured.slug}`}
              className="group grid gap-8 rounded-2xl border border-border bg-card/40 p-7 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-foreground/25 md:grid-cols-[minmax(0,1fr)_22rem] md:p-10"
            >
              <div>
                <p className="font-mono text-[0.6rem] tracking-[0.25em] text-muted-foreground uppercase">
                  {formatPostDate(featured.date)} · {featured.readingTimeMinutes} min read
                </p>

                <h2 className="mt-4 text-3xl leading-tight transition-colors group-hover:text-mint sm:text-4xl">
                  {featured.title}
                </h2>

                <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
                  {featured.summary}
                </p>

                <p className="mt-6 font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">
                  By {featured.author}
                </p>
              </div>

              <div
                aria-hidden="true"
                className="grid-bg aspect-16/10 rounded-xl border border-border md:aspect-auto"
              />
            </Link>
          </Reveal>
        ) : null}

        {/* Remaining posts */}
        <ul className="divide-y divide-border border-t border-border">
          {rest.map((post, index) => (
            <Reveal key={post.slug} as="li" delay={index * 50} y={12}>
              <article>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col gap-4 py-8 sm:flex-row sm:items-start sm:justify-between sm:gap-10"
                >
                  <div className="max-w-2xl">
                    <p className="font-mono text-[0.6rem] tracking-[0.25em] text-muted-foreground uppercase">
                      {formatPostDate(post.date)} · {post.readingTimeMinutes} min read
                    </p>

                    <h2 className="mt-3 text-2xl leading-snug transition-colors group-hover:text-mint">
                      {post.title}
                    </h2>

                    <p className="mt-3 leading-relaxed text-muted-foreground">{post.summary}</p>

                    <p className="mt-4 font-mono text-[0.6rem] tracking-[0.2em] text-muted-foreground uppercase">
                      By {post.author}
                    </p>
                  </div>

                  <ul className="flex shrink-0 flex-wrap gap-1.5 sm:max-w-40 sm:justify-end">
                    {post.tags.map((tag) => (
                      <li key={tag}>
                        <Tag>{tag}</Tag>
                      </li>
                    ))}
                  </ul>
                </Link>
              </article>
            </Reveal>
          ))}
        </ul>
      </PageSection>

      <CtaBand
        eyebrow="Stay in the loop"
        title="One email a quarter, when we have something worth sending."
        body="No drip sequences. If there is nothing interesting, we do not write. Unsubscribe in one click."
        actionLabel="Read the latest"
        href={`/blog/${posts[0]?.slug ?? ''}`}
        secondary={{ href: '/contact', label: 'Talk to us' }}
      />
    </>
  )
}
