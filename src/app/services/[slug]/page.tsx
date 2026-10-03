import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Breadcrumbs, BreadcrumbSchema } from '@/components/layout/page'
import { Prose } from '@/components/ui/prose'
import { Reveal } from '@/components/ui/reveal'
import { CtaBand } from '@/components/ui/cta-band'
import { FaqSection } from '@/components/ui/faq'
import { FaqSchema } from '@/components/seo/faq-schema'
import { aiFaqs, servicesFaqs } from '@/content/faqs'
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

  const faqs =
    service.slug === 'enterprise-systems'
      ? servicesFaqs
      : service.slug === 'ai-engineering'
        ? aiFaqs
        : null

  // Sibling services, so the page is a hub rather than a dead end.
  // Canonical practice pages are used where they exist.
  const others = services.filter((item) => item.slug !== service.slug)

  return (
    <>
      <BreadcrumbSchema items={crumbs} />
      {faqs ? <FaqSchema items={faqs} /> : null}

      <header className="container-page pt-32 pb-12 md:pt-40 md:pb-16">
        <Breadcrumbs items={crumbs} />

        <h1 className="mt-8 max-w-4xl text-4xl leading-[1.05] text-balance sm:text-5xl lg:text-6xl">
          {service.title}
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {service.summary}
        </p>
      </header>

      <div className="container-page grid gap-12 pb-20 md:pb-28 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-20">
        <Prose>{<p>{service.body}</p>}</Prose>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="font-mono text-[0.6rem] tracking-[0.3em] text-muted-foreground uppercase">
            What you get
          </h2>
          <ul className="mt-4 space-y-3">
            {service.deliverables.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                <span aria-hidden="true" className="text-coral">
                  →
                </span>
                {item}
              </li>
            ))}
          </ul>

          <Link
            href="/contact"
            className="mt-10 inline-flex min-h-11 items-center gap-2 font-mono text-[0.7rem] tracking-[0.2em] uppercase transition-colors hover:text-coral"
          >
            Discuss this
            <span aria-hidden="true">→</span>
          </Link>
        </aside>
      </div>

      {/* Other services */}
      <nav aria-label="Other services" className="border-t border-border bg-muted/20">
        <div className="container-page py-14">
          <h2 className="label text-muted-foreground">Other services</h2>

          <ul className="mt-8 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
            {others.map((other, index) => (
              <li key={other.slug}>
                <Reveal delay={index * 50} y={12}>
                  <Link
                    href={other.canonicalHref ?? `/services/${other.slug}`}
                    className="group flex h-full flex-col justify-between gap-3 bg-background p-6 transition-colors hover:bg-muted/40"
                  >
                    <span className="text-lg leading-snug transition-colors group-hover:text-coral">
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

      {/* Specialist tracks have their own pages and their own FAQs. */}
      {service.slug === 'enterprise-systems' ? (
        <FaqSection
          eyebrow="Enterprise"
          title="Questions we get about implementations."
          items={servicesFaqs}
        />
      ) : null}

      {service.slug === 'ai-engineering' ? (
        <FaqSection eyebrow="AI" title="Questions we get about AI work." items={aiFaqs} />
      ) : null}

      <CtaBand
        eyebrow="Next step"
        title={`Ready to talk about ${service.title.toLowerCase()}?`}
        body={`${contactContent.responseTime} If it is not a fit we will say so rather than waste your time.`}
        secondary={{ href: '/insights', label: 'Read our notes' }}
      />
    </>
  )
}
