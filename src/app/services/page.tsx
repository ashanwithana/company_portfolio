import Link from 'next/link'

import { PageHeader, PageSection } from '@/components/layout/page'
import { Reveal } from '@/components/ui/reveal'
import { CtaBand } from '@/components/ui/cta-band'
import { services, studioStats } from '@/content/services'
import { ACCENT_DOT } from '@/lib/accent'
import { cn } from '@/lib/utils'

export const metadata = {
  title: 'Services',
  description:
    'Web engineering, backend systems, product design, AI engineering and ERP implementation — plus design systems and performance audits. The seven things Northlight does well.',
}

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        ghost="Services"
        title="A deliberately narrow practice."
        lede="We could offer everything. We do not, because the value of working with us is that everyone here has done the specific thing you need before. Each service below has been delivered dozens of times, not once."
      />

      {/* Service list — the index for the /services/[slug] pages. */}
      <PageSection>
        <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="label text-muted-foreground">Index</h2>
          <p
            className="label text-[0.6rem] text-muted-foreground tabular-nums"
            role="status"
            aria-live="polite"
          >
            {String(services.length).padStart(2, '0')} services
          </p>
        </div>

        <ol className="divide-y divide-border border-y border-border">
          {services.map((service, index) => (
            <Reveal key={service.slug} as="li" delay={index * 50} y={16}>
              <Link
                href={service.canonicalHref ?? `/services/${service.slug}`}
                className="group grid gap-6 py-10 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:gap-12"
              >
                <div>
                  <p className="label text-muted-foreground tabular-nums">
                    {(index + 1).toString().padStart(2, '0')}
                  </p>
                  <h2 className="mt-3 text-2xl transition-colors group-hover:text-coral sm:text-3xl">
                    {service.title}
                  </h2>
                </div>

                <div>
                  <p className="max-w-2xl leading-relaxed text-muted-foreground">
                    {service.summary}
                  </p>

                  {/* Ruled list rather than chips: the deliverables are full phrases. */}
                  <ul className="mt-5 space-y-2">
                    {service.deliverables.slice(0, 3).map((item) => (
                      <li
                        key={item}
                        className="relative pl-5 text-sm leading-snug text-muted-foreground"
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            'absolute top-[0.65em] left-0 h-px w-3',
                            ACCENT_DOT[service.tint],
                          )}
                        />
                        {item}
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
      <PageSection tone="paper">
        <dl className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {studioStats.map((stat) => (
            <div key={stat.label}>
              <dt className="label text-[0.55rem] text-muted-foreground">{stat.label}</dt>
              <dd className="mt-2 display-lg tabular-nums">
                {stat.value}
                <span className="text-coral">{stat.suffix}</span>
              </dd>
            </div>
          ))}
        </dl>
      </PageSection>

      {/* Engagement models — sets expectations before the first call. */}
      <PageSection>
        <h2 className="label text-muted-foreground">How we engage</h2>

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
              <div className="flex h-full flex-col rounded-3xl border border-border bg-card/40 p-7">
                <h3 className="text-xl">{model.title}</h3>
                <p className="mt-2 label text-[0.6rem] text-coral">{model.price}</p>
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
