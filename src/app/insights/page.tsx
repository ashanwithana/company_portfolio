import Link from 'next/link'

import { PageHeader } from '@/components/layout/page'
import { BlockArt } from '@/components/ui/block-art'
import { Reveal } from '@/components/ui/reveal'
import { Tag } from '@/components/ui/badge'
import { CtaBand } from '@/components/ui/cta-band'
import { aiCaseStudies, aiPrinciples, modelProviders, ragPatterns } from '@/content/ai'
import { enterpriseCases, platforms } from '@/content/enterprise'
import { publishedCaseStudies } from '@/content/case-studies'
import { getAllPosts } from '@/content/posts-index'
import { formatPostDate } from '@/content/posts'

export const metadata = {
  title: 'Insights',
  description:
    'Writing on platform migrations, ERP implementations, RAG evaluation, design systems and performance measurement — notes from real client work.',
}

/**
 * Insights index.
 *
 * Deliberately lists everything — posts, case studies and technical notes
 * together — rather than a blog feed with a thin archive. These are reference
 * material for people evaluating us, and separating them by type would hide the
 * most relevant thing on the page.
 */
export default function InsightsPage() {
  const posts = getAllPosts()
  const studies = publishedCaseStudies()

  const allTags = [...new Set(posts.flatMap((post) => post.tags))].sort()
  const [featured, ...rest] = posts

  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Notes from the work."
        lede="Written when we learn something worth passing on. No drip sequences, no content calendar — if there is nothing interesting, we do not write."
      />

      {/* Tag index — plain links, so it works without JavaScript. */}
      <section aria-label="Browse by topic" className="container-page pb-4">
        <ul className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <li key={tag}>
              <Link
                href={`/insights?tag=${encodeURIComponent(tag)}`}
                className="inline-flex min-h-9 items-center rounded-full border border-border px-4 font-mono text-[0.65rem] tracking-[0.2em] uppercase transition-colors hover:border-foreground/25 hover:text-foreground"
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Featured post */}
      {featured ? (
        <section aria-label="Featured article" className="container-page py-12">
          <Link
            href={`/insights/${featured.slug}`}
            className="group grid gap-8 rounded-2xl border border-border bg-card/40 p-7 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-foreground/25 md:grid-cols-[minmax(0,1fr)_22rem] md:p-10"
          >
            <div>
              <p className="font-mono text-[0.6rem] tracking-[0.25em] text-mint uppercase">
                Latest · {formatPostDate(featured.date)} · {featured.readingTimeMinutes} min read
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

            <BlockArt seed={featured.slug} ratio="portrait" className="hidden md:block" />
          </Link>
        </section>
      ) : null}

      {/* Technical notes */}
      <section aria-labelledby="notes-heading" className="container-page py-12">
        <h2
          id="notes-heading"
          className="font-mono text-[0.7rem] tracking-[0.3em] text-muted-foreground uppercase"
        >
          Technical notes
        </h2>

        <ul className="mt-8 divide-y divide-border border-y border-border">
          {rest.map((post, index) => (
            <Reveal key={post.slug} as="li" delay={index * 50} y={12}>
              <article>
                <Link
                  href={`/insights/${post.slug}`}
                  className="group flex flex-col gap-4 py-8 sm:flex-row sm:items-start sm:justify-between sm:gap-10"
                >
                  <div className="max-w-2xl">
                    <p className="font-mono text-[0.6rem] tracking-[0.25em] text-muted-foreground uppercase">
                      {formatPostDate(post.date)} · {post.readingTimeMinutes} min read
                    </p>

                    <h3 className="mt-3 text-2xl leading-snug transition-colors group-hover:text-mint">
                      {post.title}
                    </h3>

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
      </section>

      {/* AI practice notes — grouped because they answer specific questions. */}
      <section aria-labelledby="ai-heading" className="container-page py-20">
        <h2
          id="ai-heading"
          className="font-mono text-[0.7rem] tracking-[0.3em] text-muted-foreground uppercase"
        >
          How we build AI systems
        </h2>

        <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
          The commitments we make on AI work, stated as practices you can hold us to rather than as
          claims about capability.
        </p>

        <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {aiPrinciples.map((principle, index) => (
            <Reveal key={principle.title} as="li" delay={index * 40}>
              <div className="h-full rounded-2xl border border-border bg-card/40 p-6">
                <h3 className="text-lg leading-snug">{principle.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {principle.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>

        {/* Retrieval patterns, condensed for the index. */}
        <div className="mt-16">
          <h3 className="font-mono text-[0.7rem] tracking-[0.3em] text-muted-foreground uppercase">
            Retrieval architectures
          </h3>

          <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {ragPatterns.map((pattern, index) => (
              <Reveal key={pattern.slug} as="li" delay={index * 40}>
                <Link
                  href="/ai"
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card/40 p-6 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-foreground/25"
                >
                  <h4 className="text-lg transition-colors group-hover:text-mint">
                    {pattern.name}
                  </h4>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {pattern.summary}
                  </p>
                  <p className="mt-4 border-t border-border pt-4 font-mono text-[0.6rem] leading-relaxed tracking-[0.1em] text-coral uppercase">
                    {pattern.tradeoff}
                  </p>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Model selection reference */}
      <section
        aria-labelledby="models-heading"
        className="border-y border-border bg-muted/20 py-20"
      >
        <div className="container-page">
          <h2
            id="models-heading"
            className="font-mono text-[0.7rem] tracking-[0.3em] text-muted-foreground uppercase"
          >
            Model selection, in brief
          </h2>

          <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
            Our shortlist, with the honest caveat each time. We are not model-agnostic in the
            unhelpful sense — these are the ones we have measured against client workloads.
          </p>

          <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {modelProviders.map((provider, index) => (
              <Reveal key={provider.vendor} as="li" delay={index * 40}>
                <div className="h-full rounded-2xl border border-border bg-background p-6">
                  <h3 className="text-lg">{provider.vendor}</h3>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {provider.models.slice(0, 2).map((model) => (
                      <li key={model}>
                        <Tag>{model}</Tag>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {provider.bestFor}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Everything we have measured */}
      <section aria-labelledby="evidence-heading" className="container-page py-20">
        <h2
          id="evidence-heading"
          className="font-mono text-[0.7rem] tracking-[0.3em] text-muted-foreground uppercase"
        >
          Measured outcomes
        </h2>

        <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
          Every engagement we publish numbers for. If a metric did not move, the case study says so
          and explains why — which is rarer than it should be.
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <Reveal>
            <div className="flex h-full flex-col rounded-2xl border border-border bg-card/40 p-7">
              <h3 className="text-lg">Case studies</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Product and platform work, reported against a baseline we captured in week one.
              </p>
              <ul className="mt-5 flex-1 space-y-3">
                {studies.slice(0, 4).map((study) => (
                  <li key={study.slug}>
                    <Link
                      href={`/work/${study.slug}`}
                      className="inline-flex min-h-8 items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <span aria-hidden="true">→</span>
                      {study.client}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/work"
                className="mt-6 font-mono text-[0.65rem] tracking-[0.2em] uppercase transition-colors hover:text-coral"
              >
                All case studies
              </Link>
            </div>
          </Reveal>

          <Reveal delay={60}>
            <div className="flex h-full flex-col rounded-2xl border border-border bg-card/40 p-7">
              <h3 className="text-lg">AI systems</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Retrieval and extraction work, each gated behind an accuracy number before launch.
              </p>
              <ul className="mt-5 flex-1 space-y-3">
                {aiCaseStudies.map((study) => (
                  <li key={study.slug}>
                    <span className="inline-flex min-h-8 items-center gap-2 text-sm text-muted-foreground">
                      <span aria-hidden="true">→</span>
                      {study.client}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/ai"
                className="mt-6 font-mono text-[0.65rem] tracking-[0.2em] uppercase transition-colors hover:text-coral"
              >
                AI practice
              </Link>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="flex h-full flex-col rounded-2xl border border-border bg-card/40 p-7">
              <h3 className="text-lg">Enterprise systems</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                ERP and automation implementations, reported the same way.
              </p>
              <ul className="mt-5 flex-1 space-y-3">
                {enterpriseCases.map((study) => (
                  <li key={study.slug}>
                    <span className="inline-flex min-h-8 items-center gap-2 text-sm text-muted-foreground">
                      <span aria-hidden="true">→</span>
                      {study.client}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/enterprise"
                className="mt-6 font-mono text-[0.65rem] tracking-[0.2em] uppercase transition-colors hover:text-coral"
              >
                Enterprise practice
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Platform reference */}
        <div className="mt-16">
          <h3 className="font-mono text-[0.7rem] tracking-[0.3em] text-muted-foreground uppercase">
            Platforms we implement
          </h3>
          <ul className="mt-6 flex flex-wrap gap-2">
            {platforms.map((platform) => (
              <li key={platform.name}>
                <Link href="/enterprise">
                  <Tag>{platform.name}</Tag>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        eyebrow="Stay in the loop"
        title="One email a quarter, when we have something worth sending."
        body="No drip sequences. If there is nothing interesting, we do not write."
        actionLabel="Read the latest"
        href={`/insights/${featured?.slug ?? ''}`}
        secondary={{ href: '/contact', label: 'Talk to us' }}
      />
    </>
  )
}
