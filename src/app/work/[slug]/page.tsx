import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Breadcrumbs, BreadcrumbSchema } from '@/components/layout/page'
import { CasePlate } from '@/components/ui/case-plate'
import { Tag } from '@/components/ui/badge'
import { Prose } from '@/components/ui/prose'
import { caseStudies, getCaseStudy, publishedCaseStudies } from '@/content/case-studies'
import { siteConfig } from '@/content/site'
import { ACCENT_TEXT } from '@/lib/accent'

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

  const description = `${study.summary} A Northlight case study for ${study.client}.`

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

      <header className="container-page pt-32 pb-12 md:pt-40 md:pb-16">
        <Breadcrumbs items={crumbs} />

        <p className="mt-8 label text-brand uppercase">
          {study.categoryLabel} · {study.year}
        </p>

        <h1 className="mt-6 max-w-4xl text-4xl leading-[1.05] text-balance sm:text-5xl lg:text-6xl">
          {study.title}
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {study.summary}
        </p>

        <ul className="mt-8 flex flex-wrap gap-2" aria-label="Services delivered">
          {study.services.map((service) => (
            <li key={service}>
              <Tag className={ACCENT_TEXT[study.tint]}>{service}</Tag>
            </li>
          ))}
        </ul>
      </header>

      <div className="container-page">
        <CasePlate
          client={study.client}
          index={caseStudies.findIndex((item) => item.slug === study.slug) + 1}
          tint={study.tint}
          ratio="wide"
          className="w-full"
        />
      </div>

      {/* Headline results, stated before the narrative. */}
      <section aria-label="Results" className="container-page py-16 md:py-20">
        <dl className="grid gap-8 border-y border-border py-10 sm:grid-cols-2 lg:grid-cols-4">
          {study.metrics.map((metric) => (
            <div key={metric.label}>
              <dt className="label text-[0.55rem] text-muted-foreground">{metric.label}</dt>
              <dd className="mt-2 display-md tabular-nums">{metric.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="container-page pb-20 md:pb-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-20">
          <div className="space-y-12">
            <section aria-labelledby="challenge-heading">
              <h2 id="challenge-heading" className="mb-4 label text-muted-foreground">
                The challenge
              </h2>
              <Prose>{<p>{study.challenge}</p>}</Prose>
            </section>

            <section aria-labelledby="approach-heading">
              <h2 id="approach-heading" className="mb-4 label text-muted-foreground">
                What we did
              </h2>
              <Prose>
                <ol>
                  {study.approach.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </Prose>
            </section>

            <section aria-labelledby="outcome-heading">
              <h2 id="outcome-heading" className="mb-4 label text-muted-foreground">
                Outcome
              </h2>
              <Prose>{<p>{study.outcome}</p>}</Prose>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="label text-muted-foreground">Client</h2>
            <p className="mt-2 text-lg">{study.client}</p>

            <h2 className="mt-8 label text-muted-foreground uppercase">Built with</h2>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {study.tech.map((tech) => (
                <li key={tech}>
                  <Tag>{tech}</Tag>
                </li>
              ))}
            </ul>

            <Link
              href="/contact"
              className="mt-10 inline-flex min-h-11 items-center gap-2 label transition-colors hover:text-brand"
            >
              Start a similar project
              <span aria-hidden="true">→</span>
            </Link>
          </aside>
        </div>
      </div>

      {/* Next case study */}
      {next ? (
        <nav aria-label="More case studies" className="bg-muted">
          <Link
            href={`/work/${next.slug}`}
            className="group container-page flex flex-col gap-4 py-14 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="label text-[0.55rem] text-muted-foreground">Next case study</p>
              <p className="mt-2 text-2xl transition-colors group-hover:text-brand sm:text-3xl">
                {next.title}
              </p>
            </div>

            <span
              aria-hidden="true"
              className="text-3xl text-muted-foreground transition-transform group-hover:translate-x-2"
            >
              →
            </span>
          </Link>
        </nav>
      ) : null}
    </article>
  )
}
