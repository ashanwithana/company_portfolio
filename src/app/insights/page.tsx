import Image from 'next/image'
import Link from 'next/link'

import { PageHeader } from '@/components/layout/page'
import { Reveal } from '@/components/ui/reveal'
import { Tag } from '@/components/ui/badge'
import { SectionHead } from '@/components/ui/section-head'
import { CtaBand } from '@/components/ui/cta-band'
import { aiCaseStudies, aiPrinciples, modelProviders, ragPatterns } from '@/content/ai'
import { coverFor, coverSize } from '@/content/covers'
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
  const featuredCover = featured ? coverFor(featured.slug) : undefined

  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Notes from the work."
        lede="Written when we learn something worth passing on. No drip sequences, no content calendar — if there is nothing interesting, we do not write."
      />

      {/* Tag index — plain links, so it works without JavaScript. */}
      <section aria-label="Browse by topic" className="border-b border-border">
        <ul className="mx-auto flex w-full max-w-[1600px] flex-wrap gap-x-7 gap-y-2 px-4 py-4 md:px-8">
          {allTags.map((tag) => (
            <li key={tag}>
              <Link
                href={`/insights?tag=${encodeURIComponent(tag)}`}
                className="inline-flex min-h-9 items-center border-b border-transparent font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase transition-colors hover:border-foreground hover:text-foreground"
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Featured post */}
      {featured ? (
        <section aria-label="Featured article" className="container-page pt-10 md:pt-12">
          <Link
            href={`/insights/${featured.slug}`}
            className="group grid items-stretch border border-border-strong transition-colors duration-300 hover:bg-foreground hover:text-background focus-visible:bg-foreground focus-visible:text-background md:grid-cols-[minmax(0,1fr)_16rem]"
          >
            <div className="p-6 md:p-8">
              <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase group-hover:text-background/60">
                Latest · {formatPostDate(featured.date)} · {featured.readingTimeMinutes} min read
              </p>

              <h2 className="mt-4 max-w-3xl text-2xl leading-[1.08] font-light tracking-tight text-balance md:text-4xl">
                {featured.title}
              </h2>

              <p className="mt-4 max-w-2xl leading-relaxed font-light text-muted-foreground group-hover:text-background/70">
                {featured.summary}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase group-hover:text-background/60">
                <span>By {featured.author}</span>
                <span aria-hidden="true">/</span>
                <span>{featured.tags.join(' · ')}</span>
              </div>
            </div>

            {featuredCover ? (
              <div className="relative hidden border-l border-border md:block">
                <Image
                  src={featuredCover.src}
                  alt={featuredCover.alt}
                  width={coverSize.width}
                  height={coverSize.height}
                  sizes="16rem"
                  priority
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            ) : null}
          </Link>
        </section>
      ) : null}

      {/* Technical notes */}
      <section aria-labelledby="notes-heading" className="container-page pt-14 md:pt-20">
        <SectionHead id="notes-heading" index="01" title="Technical notes" />

        <ul className="mt-6 border-t border-border-strong">
          {rest.map((post, index) => {
            const cover = coverFor(post.slug)

            return (
              <Reveal
                key={post.slug}
                as="li"
                delay={index * 30}
                y={8}
                className="border-b border-border"
              >
                <article>
                  <Link
                    href={`/insights/${post.slug}`}
                    className="group grid items-start gap-x-6 gap-y-3 px-4 py-6 transition-colors duration-300 hover:bg-foreground hover:text-background focus-visible:bg-foreground focus-visible:text-background md:grid-cols-12 md:px-6"
                  >
                    <div className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase transition-colors group-hover:text-background/60 md:col-span-2 md:pt-1.5">
                      <span className="mr-3">{String(index + 1).padStart(2, '0')}</span>
                      <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                    </div>

                    <div className="md:col-span-6">
                      <h3 className="text-xl leading-[1.15] font-light tracking-tight text-balance md:text-2xl">
                        {post.title}
                      </h3>
                      <p className="mt-2 max-w-xl text-sm leading-relaxed font-light text-muted-foreground transition-colors group-hover:text-background/70 md:text-base">
                        {post.summary}
                      </p>
                    </div>

                    <div className="font-mono text-[10px] tracking-[0.22em] uppercase md:col-span-3 md:pt-1.5">
                      <p>{post.author}</p>
                      <p className="mt-1.5 text-muted-foreground transition-colors group-hover:text-background/60">
                        {post.readingTimeMinutes} min read
                      </p>
                      <p className="mt-1.5 text-muted-foreground transition-colors group-hover:text-background/60">
                        {post.tags.slice(0, 3).join(' · ')}
                      </p>
                    </div>

                    <div className="hidden md:col-span-1 md:block">
                      {cover ? (
                        <Image
                          src={cover.src}
                          alt=""
                          width={coverSize.width}
                          height={coverSize.height}
                          sizes="6rem"
                          loading={index < 3 ? 'eager' : 'lazy'}
                          className="aspect-square w-full border border-border object-cover"
                        />
                      ) : null}
                    </div>
                  </Link>
                </article>
              </Reveal>
            )
          })}
        </ul>
      </section>

      {/* AI practice notes — grouped because they answer specific questions. */}
      <section aria-labelledby="ai-heading" className="container-page pt-20 md:pt-28">
        <SectionHead id="ai-heading" index="02" title="How we build AI systems" />

        <p className="mt-6 max-w-2xl leading-relaxed font-light text-muted-foreground">
          The commitments we make on AI work, stated as practices you can hold us to rather than as
          claims about capability.
        </p>

        <ul className="mt-10 grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {aiPrinciples.map((principle, index) => (
            <Reveal key={principle.title} as="li" delay={index * 40} className="bg-background">
              <div className="h-full p-7 md:p-8">
                <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-4 text-xl leading-snug font-light">{principle.title}</h3>
                <p className="mt-3 text-sm leading-relaxed font-light text-muted-foreground">
                  {principle.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>

        {/* Retrieval patterns, condensed for the index. */}
        <h3 className="mt-16 font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
          Retrieval architectures
        </h3>

        <ul className="mt-6 grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {ragPatterns.map((pattern, index) => (
            <Reveal key={pattern.slug} as="li" delay={index * 40} className="bg-background">
              <Link
                href="/ai"
                className="group flex h-full flex-col p-7 transition-colors duration-300 hover:bg-foreground hover:text-background md:p-8"
              >
                <h4 className="text-xl font-light">{pattern.name}</h4>
                <p className="mt-3 flex-1 text-sm leading-relaxed font-light text-muted-foreground transition-colors group-hover:text-background/70">
                  {pattern.summary}
                </p>
                <p className="mt-5 border-t border-border pt-4 text-[13px] leading-relaxed font-light group-hover:border-background/30">
                  {pattern.tradeoff}
                </p>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Model selection reference */}
      <section aria-labelledby="models-heading" className="container-page pt-20 md:pt-28">
        <SectionHead id="models-heading" index="03" title="Model selection, in brief" />

        <p className="mt-6 max-w-2xl leading-relaxed font-light text-muted-foreground">
          Our shortlist, with the honest caveat each time. We are not model-agnostic in the
          unhelpful sense — these are the ones we have measured against client workloads.
        </p>

        <ul className="mt-10 grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {modelProviders.map((provider, index) => (
            <Reveal key={provider.vendor} as="li" delay={index * 40} className="bg-background">
              <div className="h-full p-7 md:p-8">
                <h3 className="text-xl font-light">{provider.vendor}</h3>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {provider.models.slice(0, 2).map((model) => (
                    <li key={model}>
                      <Tag>{model}</Tag>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm leading-relaxed font-light text-muted-foreground">
                  {provider.bestFor}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Everything we have measured */}
      <section aria-labelledby="evidence-heading" className="container-page py-20 md:py-28">
        <SectionHead id="evidence-heading" index="04" title="Measured outcomes" />

        <p className="mt-6 max-w-2xl leading-relaxed font-light text-muted-foreground">
          Every engagement we publish numbers for. If a metric did not move, the case study says so
          and explains why — which is rarer than it should be.
        </p>

        <div className="mt-10 grid gap-px border border-border bg-border lg:grid-cols-3">
          <OutcomeColumn
            title="Case studies"
            body="Product and platform work, reported against a baseline we captured in week one."
            href="/work"
            linkLabel="All case studies"
            items={studies.slice(0, 4).map((study) => ({
              key: study.slug,
              label: study.client,
              href: `/work/${study.slug}`,
            }))}
          />
          <OutcomeColumn
            title="AI systems"
            body="Retrieval and extraction work, each gated behind an accuracy number before launch."
            href="/ai"
            linkLabel="AI practice"
            items={aiCaseStudies.map((study) => ({ key: study.slug, label: study.client }))}
          />
          <OutcomeColumn
            title="Enterprise systems"
            body="ERP and automation implementations, reported the same way."
            href="/enterprise"
            linkLabel="Enterprise practice"
            items={enterpriseCases.map((study) => ({ key: study.slug, label: study.client }))}
          />
        </div>

        {/* Platform reference */}
        <h3 className="mt-16 font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
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
      </section>

      <CtaBand
        eyebrow="Stay in the loop"
        title="One email a quarter, when we have something worth sending."
        body="No drip sequences. If there is nothing interesting, we do not write."
        actionLabel="Read the latest"
        href={`/insights/${featured?.slug ?? ''}`}
        secondary={{ href: '/faq', label: 'Talk to us' }}
      />
    </>
  )
}

/** One column of the measured-outcomes grid. */
function OutcomeColumn({
  title,
  body,
  href,
  linkLabel,
  items,
}: {
  title: string
  body: string
  href: string
  linkLabel: string
  items: { key: string; label: string; href?: string }[]
}) {
  return (
    <div className="flex flex-col bg-background p-7 md:p-8">
      <h3 className="text-xl font-light">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed font-light text-muted-foreground">{body}</p>
      <ul className="mt-5 flex-1 space-y-1">
        {items.map((item) => (
          <li key={item.key}>
            {item.href ? (
              <Link
                href={item.href}
                className="inline-flex min-h-8 items-center gap-2 text-sm font-light text-muted-foreground transition-colors hover:text-foreground"
              >
                <span aria-hidden="true">→</span>
                {item.label}
              </Link>
            ) : (
              <span className="inline-flex min-h-8 items-center gap-2 text-sm font-light text-muted-foreground">
                <span aria-hidden="true">→</span>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className="mt-6 font-mono text-[10px] tracking-[0.25em] uppercase transition-colors hover:text-muted-foreground"
      >
        {linkLabel} →
      </Link>
    </div>
  )
}
