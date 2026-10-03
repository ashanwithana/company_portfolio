import { PageHeader, PageSection } from '@/components/layout/page'
import { Reveal } from '@/components/ui/reveal'
import { Tag } from '@/components/ui/badge'
import { CtaBand } from '@/components/ui/cta-band'
import { FaqSection } from '@/components/ui/faq'
import { FaqSchema } from '@/components/seo/faq-schema'
import { servicesFaqs } from '@/content/faqs'
import {
  depthLabels,
  enterpriseCases,
  enterpriseService,
  platforms,
  type Platform,
} from '@/content/enterprise'

export const metadata = {
  title: 'Enterprise Systems',
  description:
    'Odoo, Dynamics 365, SAP Business One, Salesforce, HubSpot and commerce implementations. Data-first, phased migration, trained teams — no demo-shaped go-lives.',
}

const DEPTH_TONE: Record<Platform['depth'], string> = {
  partner: 'text-coral',
  certified: 'text-primary',
  'hands-on': 'text-coral',
}

export default function EnterprisePage() {
  return (
    <>
      <FaqSchema items={servicesFaqs} />

      <PageHeader
        eyebrow="Enterprise systems"
        ghost="Enterprise"
        title="Start with the data, not the configuration."
        lede={enterpriseService.summary}
      />

      {/* The pitch */}
      <PageSection className="pt-0">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-20">
          <div className="max-w-3xl space-y-6 leading-relaxed text-muted-foreground">
            {enterpriseService.body.split('\n\n').map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <aside className="rounded-3xl border border-border bg-card/40 p-7">
            <h2 className="font-mono text-[0.6rem] tracking-[0.3em] text-muted-foreground uppercase">
              What you get
            </h2>
            <ul className="mt-4 space-y-3">
              {enterpriseService.deliverables.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <span aria-hidden="true" className="text-coral">
                    →
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </PageSection>

      {/* Platforms */}
      <PageSection tone="muted">
        <h2 className="label text-muted-foreground">Platforms we implement</h2>

        <p className="mt-6 max-w-3xl leading-relaxed text-muted-foreground">
          We are listed by depth rather than by logo wall. If a platform is not here, it is because
          we could not commit to doing it well — we would rather refer you to someone who could.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {platforms.map((platform, index) => (
            <Reveal key={platform.name} delay={index * 40}>
              <div className="flex h-full flex-col rounded-3xl border border-border bg-background p-6">
                <h3 className="text-lg leading-tight">{platform.name}</h3>

                <p
                  className={`mt-2 font-mono text-[0.55rem] tracking-[0.2em] uppercase ${DEPTH_TONE[platform.depth]}`}
                >
                  {depthLabels[platform.depth]}
                </p>

                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {platform.note}
                </p>

                <ul className="mt-5 flex flex-wrap gap-1.5 border-t border-border pt-4">
                  {platform.focus.slice(0, 3).map((item) => (
                    <li key={item}>
                      <Tag>{item}</Tag>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </PageSection>

      {/* Platform comparison — the question every buyer actually asks. */}
      <PageSection tone="muted">
        <h2 className="label text-muted-foreground">Which platform fits</h2>

        <p className="mt-6 max-w-3xl leading-relaxed text-muted-foreground">
          The honest version of the comparison competitors bury in PDFs. There is no best platform —
          there is the one whose trade-offs match your situation.
        </p>

        <div className="mt-10 overflow-x-auto rounded-3xl border border-border">
          <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
            <caption className="sr-only">
              Comparison of Odoo, Dynamics 365, SAP Business One and Salesforce
            </caption>
            <thead>
              <tr className="border-b border-border bg-background">
                <th scope="col" className="p-5 label text-[0.55rem] text-muted-foreground">
                  Platform
                </th>
                <th scope="col" className="p-5 label text-[0.55rem] text-muted-foreground">
                  Best when
                </th>
                <th scope="col" className="p-5 label text-[0.55rem] text-muted-foreground">
                  Watch out for
                </th>
                <th scope="col" className="p-5 label text-[0.55rem] text-muted-foreground">
                  Typical range
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                {
                  name: 'Odoo',
                  fit: 'Manufacturing, distribution and services up to a few hundred users; you want one system, fast.',
                  risk: 'Custom modules need upgrade discipline — every Odoo version moves the API.',
                  cost: '£40k – £180k implemented',
                },
                {
                  name: 'Dynamics 365',
                  fit: 'Multi-entity finance, complex intercompany, or Power BI as a hard requirement.',
                  risk: 'Licensing compounds yearly; scope creep arrives via the Microsoft catalogue.',
                  cost: '£120k – £400k+ implemented',
                },
                {
                  name: 'SAP Business One',
                  fit: 'Mid-market with production planning needs and no appetite for full SAP.',
                  risk: 'Smaller partner ecosystem; add-ons vary wildly in quality.',
                  cost: '£80k – £250k implemented',
                },
                {
                  name: 'Salesforce',
                  fit: 'Sales-led organisations where CPQ or Service Cloud is genuinely load-bearing.',
                  risk: 'Becomes the teuerste spreadsheet you own without strict admin governance.',
                  cost: '£60k – £300k+ implemented',
                },
              ].map((row) => (
                <tr key={row.name} className="bg-card/40 align-top">
                  <th scope="row" className="p-5 text-base text-foreground">
                    {row.name}
                  </th>
                  <td className="p-5 leading-relaxed text-muted-foreground">{row.fit}</td>
                  <td className="p-5 leading-relaxed text-muted-foreground">{row.risk}</td>
                  <td className="p-5 font-mono text-[0.7rem] whitespace-nowrap tabular-nums">
                    {row.cost}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Ranges include discovery, data work, implementation and training — not licences. Anyone
          quoting without asking about your data has not priced the actual project.
        </p>
      </PageSection>

      {/* Migration checklist */}
      <PageSection>
        <h2 className="label text-muted-foreground">The migration checklist</h2>

        <p className="mt-6 max-w-3xl leading-relaxed text-muted-foreground">
          The same seven steps, in the same order, on every implementation. Skipping one is always
          the step that causes the go-live incident.
        </p>

        <ol className="mt-10 grid gap-5 md:grid-cols-2">
          {[
            {
              title: 'Inventory every source',
              body: 'Every export, every spreadsheet, an honest record count. The number is always larger than the estimate.',
            },
            {
              title: 'Deduplicate before migrating',
              body: '8–15% of customer and supplier records are duplicates. Merge them first — post-migration merges break foreign keys.',
            },
            {
              title: 'Set a cut-off policy',
              body: 'Decide what migrates and what stays read-only. Migrating eleven years of history buys eleven years of bad data.',
            },
            {
              title: 'Mirror production in staging',
              body: 'Same volumes, same integrations. A migration that only works on sample data does not work.',
            },
            {
              title: 'Rehearse twice, minimum',
              body: 'First run finds the discrepancies, second proves the fix. Each phase needs a tested rollback.',
            },
            {
              title: 'Migrate in phases',
              body: 'Entity by entity with a rollback between each. Big-bang go-lives are how weekends disappear.',
            },
            {
              title: 'Train the users',
              body: 'In staging, against migrated data. The team that uses the system gets the training, not just the team that approves it.',
            },
          ].map((step, index) => (
            <Reveal key={step.title} as="li" delay={index * 40}>
              <div className="flex h-full gap-4 rounded-3xl border border-border bg-card/40 p-6">
                <span className="font-mono text-xs text-coral tabular-nums">
                  {(index + 1).toString().padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-lg leading-snug">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </PageSection>

      {/* Enterprise case studies */}
      <PageSection>
        <h2 className="label text-muted-foreground">Implementation case studies</h2>

        <div className="mt-12 space-y-20">
          {enterpriseCases.map((study) => (
            <article key={study.slug}>
              <div className="grid gap-8 border-b border-border pb-16 last:border-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
                <div>
                  <p className="label text-[0.55rem] text-muted-foreground">
                    {study.client} · {study.year}
                  </p>

                  <h3 className="mt-4 text-3xl leading-tight sm:text-4xl">{study.title}</h3>

                  <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                    {study.summary}
                  </p>

                  <ol className="mt-7 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                    {study.approach.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>

                <div className="flex flex-col gap-6">
                  <div>
                    <h4 className="font-mono text-[0.6rem] tracking-[0.25em] text-coral uppercase">
                      Outcome
                    </h4>
                    <p className="mt-2 leading-relaxed text-muted-foreground">{study.outcome}</p>
                  </div>

                  <dl className="grid grid-cols-2 gap-6 border-t border-border pt-6">
                    {study.metrics.map((metric) => (
                      <div key={metric.label}>
                        <dt className="font-mono text-[0.55rem] tracking-[0.2em] text-muted-foreground uppercase">
                          {metric.label}
                        </dt>
                        <dd className="mt-1 display-sm tabular-nums">{metric.value}</dd>
                      </div>
                    ))}
                  </dl>

                  <ul className="flex flex-wrap gap-1.5">
                    {study.stack.map((item) => (
                      <li key={item}>
                        <Tag>{item}</Tag>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </PageSection>

      <FaqSection
        eyebrow="Enterprise"
        title="Questions we get about implementations."
        items={servicesFaqs}
      />

      <CtaBand
        eyebrow="Talk to us"
        title="Tell us what is in the database."
        body="The data is usually the hard part, and it is the part most projects underestimate. Bring the messy reality and we will tell you what it actually takes."
        secondary={{ href: '/insights/migration-not-rewrite', label: 'How we migrate' }}
      />
    </>
  )
}
