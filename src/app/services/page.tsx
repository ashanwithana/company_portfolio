import Link from 'next/link'

import { PageHeader, PageSection } from '@/components/layout/page'
import { Reveal } from '@/components/ui/reveal'
import { Tag } from '@/components/ui/badge'
import { CtaBand } from '@/components/ui/cta-band'
import { services, studioStats } from '@/content/services'
import { ACCENT_TEXT } from '@/lib/accent'

export const metadata = {
  title: 'Services',
  description:
    'Product design, web engineering, backend systems, AI integration, design systems and performance audits — the six things Northlight does well.',
}

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="A deliberately narrow practice."
        lede="We could offer everything. We do not, because the value of working with us is that everyone here has done the specific thing you need before. Each service below has been delivered dozens of times, not once."
      />

      {/* Service list — the index for the /services/[slug] pages. */}
      <PageSection>
        <ol className="divide-y divide-border border-y border-border">
          {services.map((service, index) => (
            <Reveal key={service.slug} as="li" delay={index * 50} y={16}>
              <Link
                href={service.canonicalHref ?? `/services/${service.slug}`}
                className="group grid gap-6 py-10 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:gap-12"
              >
                <div>
                  <p className="font-mono text-xs tracking-[0.25em] text-muted-foreground tabular-nums">
                    {(index + 1).toString().padStart(2, '0')}
                  </p>
                  <h2 className="mt-3 text-2xl transition-colors group-hover:text-mint sm:text-3xl">
                    {service.title}
                  </h2>
                </div>

                <div>
                  <p className="max-w-2xl leading-relaxed text-muted-foreground">
                    {service.summary}
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {service.deliverables.slice(0, 3).map((item) => (
                      <li key={item}>
                        <Tag className={ACCENT_TEXT[service.tint]}>{item}</Tag>
                      </li>
                    ))}
                  </ul>
                </div>

                <span
                  aria-hidden="true"
                  className="hidden text-2xl text-muted-foreground transition-transform group-hover:translate-x-2 md:flex md:items-center"
                >
                  →
                </span>
              </Link>
            </Reveal>
          ))}
        </ol>
      </PageSection>

      {/* Practice stats */}
      <PageSection tone="muted">
        <dl className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {studioStats.map((stat) => (
            <div key={stat.label}>
              <dt className="font-mono text-[0.6rem] tracking-[0.25em] text-muted-foreground uppercase">
                {stat.label}
              </dt>
              <dd className="mt-2 font-display text-4xl font-semibold tabular-nums sm:text-5xl">
                {stat.value}
                <span className="text-coral">{stat.suffix}</span>
              </dd>
            </div>
          ))}
        </dl>
      </PageSection>

      {/* Engagement models — sets expectations before the first call. */}
      <PageSection>
        <h2 className="font-mono text-[0.7rem] tracking-[0.3em] text-muted-foreground uppercase">
          How we engage
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              title: 'Discovery',
              price: 'Two weeks',
              body: 'Embedded with your team, reading the code and watching the work. Ends with a written plan and a fixed number.',
            },
            {
              title: 'Delivery',
              price: '8–32 weeks',
              body: 'Short cycles, each ending in something demonstrable. Performance and accessibility budgets enforced from day one.',
            },
            {
              title: 'Embedded',
              price: 'Rolling',
              body: 'A senior pair inside your team for a quarter at a time, with an explicit exit at the end of each.',
            },
          ].map((model, index) => (
            <Reveal key={model.title} delay={index * 70}>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card/40 p-7">
                <h3 className="text-xl">{model.title}</h3>
                <p className="mt-2 font-mono text-[0.65rem] tracking-[0.2em] text-coral uppercase">
                  {model.price}
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">{model.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </PageSection>

      <CtaBand
        eyebrow="Not sure which you need?"
        title="Describe the problem, not the service."
        body="Most engagements combine two or three of the above. Tell us what is in the way and we will tell you what we would do about it."
      />
    </>
  )
}
