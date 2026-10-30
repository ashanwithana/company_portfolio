import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Breadcrumbs, BreadcrumbSchema, splitHeadline } from '@/components/layout/page'
import { HairlineGrid } from '@/components/ui/hairline-grid'
import { HeadlineReveal } from '@/components/ui/headline-reveal'
import { Tag } from '@/components/ui/badge'
import { caseStudies, getCaseStudy, publishedCaseStudies } from '@/content/case-studies'
import { siteConfig } from '@/content/site'

/**
 * Pre-render every case study at build time.
 *
 * Returning all studies (not just published ones) means an unpublished draft
 * still 404s cleanly rather than 500-ing on a missing static path.
 */
export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }))
}

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const study = getCaseStudy(slug)

  if (!study) return { title: 'Case study not found' }

  const description = `${study.summary} A SketchLabs case study for ${study.client}.`

  return {
    title: `${study.client} — ${study.title}`,
    description,
    alternates: { canonical: `/work/${study.slug}` },
    openGraph: {
      title: `${study.client} — ${study.title}`,
      description,
      url: `${siteConfig.url}/work/${study.slug}`,
      type: 'article',
    },
  }
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params
  const study = getCaseStudy(slug)

  if (!study || study.published === false) notFound()

  const all = publishedCaseStudies()
  const index = all.findIndex((item) => item.slug === slug)
  const next = all[index + 1]

  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Work', href: '/work' },
    { label: study.client },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: study.title,
    description: study.summary,
    datePublished: `${study.year}-01-01`,
    author: { '@type': 'Organization', name: siteConfig.nameWithSuffix },
    publisher: { '@type': 'Organization', name: siteConfig.nameWithSuffix },
    about: study.services,
    keywords: study.tech.join(', '),
  }

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

          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-4">
                <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
                  {String(index + 1).padStart(2, '0')} / {study.categoryLabel} · {study.year}
                </span>
                <span aria-hidden="true" className="h-px max-w-[160px] flex-1 bg-border-strong" />
              </div>

              <h1 className="mt-8 max-w-5xl text-[clamp(2.25rem,5vw,5.25rem)] leading-[0.92] font-thin tracking-tighter text-balance uppercase">
                <HeadlineReveal text={splitHeadline(study.title)} emphasizeLast />
              </h1>

              <p
                className="mt-10 max-w-2xl text-base leading-relaxed font-light text-muted-foreground md:text-lg"
                style={{ animation: 'fade-up .8s cubic-bezier(.16,1,.3,1) 620ms both' }}
              >
                {study.summary}
              </p>
            </div>

            <dl
              className="lg:col-span-4 lg:self-end"
              style={{ animation: 'fade-up .8s cubic-bezier(.16,1,.3,1) 760ms both' }}
            >
              {[
                ['Client', study.client],
                ['Type', study.categoryLabel],
                ['Year', String(study.year)],
                ['Delivered', study.services.join(' · ')],
              ].map(([term, value]) => (
                <div
                  key={term}
                  className="grid grid-cols-[6rem_1fr] gap-4 border-t border-border py-3.5 first:border-border-strong last:border-b"
                >
                  <dt className="pt-0.5 font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
                    {term}
                  </dt>
                  <dd className="text-base font-light">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </header>

      {/* Headline results, stated before the narrative. */}
      <section aria-label="Results" className="border-b border-border">
        <dl className="mx-auto grid w-full max-w-[1600px] grid-cols-2 lg:grid-cols-4">
          {study.metrics.map((metric, i) => (
            <div
              key={metric.label}
              className={`px-4 py-10 md:px-8 md:py-14 ${i > 0 ? 'lg:border-l lg:border-border' : ''} ${i % 2 === 1 ? 'border-l border-border' : ''}`}
            >
              <dt className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
                {metric.label}
              </dt>
              <dd className="mt-4 text-2xl font-light tracking-tight tabular-nums md:text-4xl">
                {metric.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Narrative: a label on the left, the account on the right. */}
      <div className="mx-auto w-full max-w-[1600px] px-4 md:px-8">
        <CaseSection id="challenge" index="01" title="The challenge">
          <p className="max-w-3xl text-lg leading-relaxed font-light md:text-xl">
            {study.challenge}
          </p>
        </CaseSection>

        <CaseSection id="approach" index="02" title="What we did">
          <ol className="max-w-3xl border-t border-border-strong">
            {study.approach.map((step, i) => (
              <li
                key={step}
                className="grid grid-cols-[3rem_1fr] gap-4 border-b border-border py-6"
              >
                <span className="pt-1 font-mono text-[10px] tracking-[0.25em] text-muted-foreground">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="leading-relaxed font-light text-foreground/85 md:text-lg">{step}</p>
              </li>
            ))}
          </ol>
        </CaseSection>

        <CaseSection id="outcome" index="03" title="Outcome">
          <p className="max-w-3xl text-lg leading-relaxed font-light md:text-xl">{study.outcome}</p>

          <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-6">
            <div>
              <p className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
                Built with
              </p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {study.tech.map((tech) => (
                  <li key={tech}>
                    <Tag>{tech}</Tag>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/start-a-project"
              className="inline-flex min-h-11 items-center gap-3 border border-border-strong px-6 font-mono text-[10px] tracking-[0.25em] uppercase transition-colors hover:bg-foreground hover:text-background"
            >
              Start a similar project
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </CaseSection>
      </div>

      {/* Next case study */}
      {next ? (
        <nav aria-label="More case studies" className="border-t border-border-strong">
          <Link
            href={`/work/${next.slug}`}
            className="group mx-auto flex w-full max-w-[1600px] flex-col gap-4 px-4 py-14 transition-colors hover:bg-foreground hover:text-background focus-visible:bg-foreground focus-visible:text-background sm:flex-row sm:items-center sm:justify-between md:px-8 md:py-20"
          >
            <div>
              <p className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase group-hover:text-background/60">
                Next case study
              </p>
              <p className="mt-4 text-2xl font-light tracking-tight sm:text-4xl">{next.title}</p>
            </div>

            <span
              aria-hidden="true"
              className="text-4xl font-thin transition-transform group-hover:translate-x-2"
            >
              →
            </span>
          </Link>
        </nav>
      ) : null}
    </article>
  )
}

/** One narrative block: a numbered label on the left, the account on the right. */
function CaseSection({
  id,
  index,
  title,
  children,
}: {
  id: string
  index: string
  title: string
  children: ReactNode
}) {
  return (
    <section
      aria-labelledby={`${id}-heading`}
      className="grid gap-6 border-b border-border py-14 md:py-20 lg:grid-cols-12 lg:gap-8"
    >
      <div className="lg:col-span-3">
        <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
          {index} /
        </p>
        <h2 id={`${id}-heading`} className="mt-3 text-2xl font-light tracking-tight md:text-3xl">
          {title}
        </h2>
      </div>
      <div className="lg:col-span-9">{children}</div>
    </section>
  )
}
