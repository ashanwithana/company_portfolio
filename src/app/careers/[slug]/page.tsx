import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Breadcrumbs, BreadcrumbSchema } from '@/components/layout/page'
import { CtaBand } from '@/components/ui/cta-band'
import { Prose } from '@/components/ui/prose'
import { Tag } from '@/components/ui/badge'
import { getRole, roles } from '@/content/roles'
import { siteConfig } from '@/content/site'

export function generateStaticParams() {
  return roles.map((role) => ({ slug: role.slug }))
}

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const role = getRole(slug)

  if (!role) return { title: 'Role not found' }

  return {
    title: role.title,
    description: role.summary,
    alternates: { canonical: `/careers/${role.slug}` },
  }
}

export default async function RolePage({ params }: Params) {
  const { slug } = await params
  const role = getRole(slug)

  if (!role) notFound()

  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Careers', href: '/careers' },
    { label: role.title },
  ]

  const others = roles.filter((item) => item.slug !== role.slug)
  const applySubject = encodeURIComponent(`Application — ${role.title}`)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: role.title,
    description: role.summary,
    datePosted: '2026-01-01',
    employmentType:
      role.employment === 'Full-time'
        ? 'FULL_TIME'
        : role.employment === 'Part-time'
          ? 'PART_TIME'
          : role.employment === 'Internship'
            ? 'INTERN'
            : 'CONTRACTOR',
    hiringOrganization: {
      '@type': 'Organization',
      name: siteConfig.nameWithSuffix,
      sameAs: siteConfig.url,
    },
    jobLocationType: role.remote ? 'TELECOMMUTE' : undefined,
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: siteConfig.address.city,
        addressCountry: siteConfig.address.country,
      },
    },
    industry: 'Software Development',
    skills: [...role.requirements],
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

        <p className="mt-8 label text-coral uppercase">{role.department}</p>

        <h1 className="mt-6 max-w-4xl text-4xl leading-[1.05] text-balance sm:text-5xl">
          {role.title}
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {role.summary}
        </p>

        <ul className="mt-8 flex flex-wrap gap-2">
          <li>
            <Tag>{role.employment}</Tag>
          </li>
          <li>
            <Tag>{role.location}</Tag>
          </li>
          {role.remote ? (
            <li>
              <Tag className="text-coral">Remote-first</Tag>
            </li>
          ) : null}
        </ul>

        <a
          href={`mailto:careers@northlight.example.com?subject=${applySubject}`}
          className="mt-10 inline-flex h-14 items-center justify-center rounded-full bg-coral px-8 font-mono text-sm tracking-[0.2em] text-white uppercase shadow-[0_10px_30px_-12px_var(--coral)] transition-shadow hover:shadow-[0_16px_40px_-10px_var(--coral)]"
        >
          Apply for this role
          <span aria-hidden="true" className="ml-2">
            →
          </span>
        </a>
      </header>

      <div className="container-page grid gap-12 pb-20 md:pb-28 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-20">
        <div className="space-y-12">
          <section aria-labelledby="about-role">
            <h2 id="about-role" className="mb-4 label text-muted-foreground">
              About the role
            </h2>
            <Prose>
              {role.about.split('\n\n').map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Prose>
          </section>

          <section aria-labelledby="responsibilities">
            <h2 id="responsibilities" className="mb-4 label text-muted-foreground">
              What you will do
            </h2>
            <Prose>
              <ul>
                {role.responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Prose>
          </section>

          <section aria-labelledby="requirements">
            <h2 id="requirements" className="mb-4 label text-muted-foreground">
              What we are looking for
            </h2>
            <Prose>
              <ul>
                {role.requirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Prose>
          </section>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="label text-muted-foreground">At a glance</h2>
          <dl className="mt-4 space-y-4 text-sm">
            {[
              { term: 'Department', detail: role.department },
              { term: 'Type', detail: role.employment },
              { term: 'Location', detail: role.location },
              { term: 'Working style', detail: role.remote ? 'Async-first, remote' : 'Hybrid' },
            ].map((item) => (
              <div key={item.term}>
                <dt className="label text-[0.55rem] text-muted-foreground">{item.term}</dt>
                <dd className="mt-1">{item.detail}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      {role.benefits ? (
        <section aria-labelledby="benefits" className="bg-muted">
          <div className="container-page py-14">
            <h2 id="benefits" className="label text-muted-foreground">
              What we offer
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {role.benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex gap-3 rounded-xl border border-border bg-background p-5 text-sm leading-relaxed"
                >
                  <span aria-hidden="true" className="text-coral">
                    →
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Other roles */}
      <nav aria-label="Other roles" className="border-t border-border">
        <div className="container-page py-14">
          <h2 className="label text-muted-foreground">Other open roles</h2>
          <ul className="mt-8 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2">
            {others.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/careers/${other.slug}`}
                  className="group flex h-full flex-col gap-2 bg-background p-6 transition-colors hover:bg-muted/40"
                >
                  <span className="text-lg leading-snug transition-colors group-hover:text-coral">
                    {other.title}
                  </span>
                  <span className="label text-[0.55rem] text-muted-foreground">
                    {other.department} · {other.employment}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <CtaBand
        eyebrow="Not quite right?"
        title="Send us a note anyway."
        body="We would rather hear from someone who is close to the right fit than wait for a role that never opens."
        actionLabel="Write to us"
        href={`mailto:careers@northlight.example.com?subject=${applySubject}`}
      />
    </article>
  )
}
