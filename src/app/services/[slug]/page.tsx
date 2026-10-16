import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BreadcrumbSchema, PageHeader, PageSection } from '@/components/layout/page'
import { Prose } from '@/components/ui/prose'
import { Reveal } from '@/components/ui/reveal'
import { Tag } from '@/components/ui/badge'
import { CtaBand } from '@/components/ui/cta-band'
import { FaqSection } from '@/components/ui/faq'
import { FaqSchema } from '@/components/seo/faq-schema'
import { servicesFaqs } from '@/content/faqs'
import { contactContent } from '@/content/site'
import { getService, services } from '@/content/services'

export function generateStaticParams() {
  // Specialist tracks redirect to their canonical practice pages (see
  // redirects in next.config.ts), so they are excluded here.
  return services.filter((s) => !s.canonicalHref).map((service) => ({ slug: service.slug }))
}

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const service = getService(slug)

  if (!service) return { title: 'Service not found' }

  return {
    title: service.title,
    description: service.summary,
    alternates: { canonical: `/services/${service.slug}` },
  }
}

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params
  const service = getService(slug)

  if (!service) notFound()

  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: service.title },
  ]

  // Sibling services, so the page is a hub rather than a dead end.
  // Canonical practice pages are used where they exist.
  const ghost = service.title.split(' ')[0] ?? service.title
  const others = services.filter((item) => item.slug !== service.slug)
  const paragraphs = service.body.split('\n\n')

  return (
    <>
      <BreadcrumbSchema items={crumbs} />
      <FaqSchema items={servicesFaqs} />

      <PageHeader ghost={ghost} eyebrow="Services" title={service.title} lede={service.summary} />

      {/* Standing description plus the deliverables and stack card. */}
      <PageSection className="pt-0">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-16">
          <Prose>
            {paragraphs.map((paragraph) =>
              paragraph.startsWith('## ') ? (
                // `## ` in the body marks a subheading. Parsed here rather than
                // stored as JSX so the content layer stays plain data, which is
                // what lets the listings, palette and command palette read the
                // same source. It also gives each service page a real h2
                // outline instead of one undifferentiated block of text.
                <h2 key={paragraph.slice(3, 27)}>{paragraph.slice(3)}</h2>
              ) : (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ),
            )}
          </Prose>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl border border-border bg-card/40 p-7">
              <h2 className="label text-muted-foreground">What you get</h2>
              <ul className="mt-4 space-y-3">
                {service.deliverables.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span aria-hidden="true" className="text-brand">
                      →
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              {service.stack ? (
                <>
                  <h2 className="mt-8 label text-muted-foreground">Common stack</h2>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {service.stack.map((item) => (
                      <li key={item}>
                        <Tag>{item}</Tag>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

              <Link
                href="/start-a-project"
                className="mt-8 inline-flex min-h-11 items-center gap-2 label transition-colors hover:text-brand"
              >
                Discuss this
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </aside>
        </div>
      </PageSection>

      {/* Approach, as numbered rows — the same device as the AI pattern list. */}
      {service.approach ? (
        <PageSection tone="muted">
          <h2 className="label text-muted-foreground">How we run it</h2>

          <p className="mt-6 max-w-3xl leading-relaxed text-muted-foreground">
            Every engagement follows the same sequence. The steps below are in delivery order — each
            one is independently useful, so an engagement can stop after any of them with something
            finished.
          </p>

          <ul className="mt-12 divide-y divide-border border-y border-border">
            {service.approach.map((step, index) => (
              <Reveal key={step.name} as="li" delay={index * 50} y={16}>
                <div className="grid gap-5 py-10 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-14">
                  <div>
                    <p className="label text-muted-foreground tabular-nums">
                      {(index + 1).toString().padStart(2, '0')}
                    </p>
                    <h3 className="mt-3 text-2xl leading-tight sm:text-3xl">{step.name}</h3>
                    <p className="mt-3 leading-relaxed text-muted-foreground">{step.summary}</p>
                  </div>

                  <div className="lg:pt-10">
                    <p className="max-w-2xl leading-relaxed text-muted-foreground">{step.detail}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </PageSection>
      ) : null}

      {/* When this service is the wrong answer — the honest section. */}
      {service.wrongWhen ? (
        <PageSection tone="muted">
          <h2 className="label text-muted-foreground">
            {service.wrongTitle ?? `When ${service.title.toLowerCase()} is the wrong answer`}
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {service.wrongWhen.map((item, index) => (
              <Reveal key={item.title} delay={index * 50}>
                <div className="h-full rounded-3xl border border-border bg-background p-7">
                  <h3 className="text-xl leading-snug">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </PageSection>
      ) : null}

      <FaqSection
        eyebrow="Services"
        title="Questions we get about this kind of work."
        items={servicesFaqs}
      />

      {/* Other services */}
      <nav aria-label="Other services" className="bg-muted">
        <div className="container-page py-14">
          <h2 className="label text-muted-foreground">Other services</h2>

          <ul className="mt-8 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-3">
            {others.map((other, index) => (
              <li key={other.slug}>
                <Reveal delay={index * 50} y={12}>
                  <Link
                    href={other.canonicalHref ?? `/services/${other.slug}`}
                    className="group flex h-full flex-col justify-between gap-3 bg-background p-6 transition-colors hover:bg-muted/40"
                  >
                    <span className="text-lg leading-snug transition-colors group-hover:text-brand">
                      {other.title}
                    </span>
                    <span className="label text-[0.55rem] text-muted-foreground">Explore</span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <CtaBand
        eyebrow="Next step"
        title={`Ready to talk about ${service.title.toLowerCase()}?`}
        body={`${contactContent.responseTime} If it is not a fit we will say so rather than waste your time.`}
        secondary={{ href: '/insights', label: 'Read our notes' }}
      />
    </>
  )
}
