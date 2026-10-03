import { PageHeader, PageSection } from '@/components/layout/page'
import { BlockArt } from '@/components/ui/block-art'
import { Reveal } from '@/components/ui/reveal'
import { Tag } from '@/components/ui/badge'
import { CtaBand } from '@/components/ui/cta-band'
import { FaqSection } from '@/components/ui/faq'
import { FaqSchema } from '@/components/seo/faq-schema'
import { aiCaseStudies, aiPrinciples, modelProviders, ragPatterns } from '@/content/ai'
import { aiFaqs } from '@/content/faqs'

export const metadata = {
  title: 'AI Engineering',
  description:
    'RAG pipelines, model integrations and evaluation harnesses. We build retrieval systems that are measured before they are shipped — and that can decline when they do not know.',
}

export default function AiPage() {
  return (
    <>
      <FaqSchema items={aiFaqs} />

      <PageHeader
        eyebrow="AI engineering"
        ghost="AI"
        title="We build the evaluation harness first."
        lede="Most AI projects fail quietly. A retrieval system produces a confident, fluent, wrong answer and nobody notices until a customer does. Our approach is to make that impossible: measure before you ship, keep every answer traceable, and let the system say it does not know."
      />

      {/* Principles */}
      <PageSection className="pt-0">
        <h2 className="label text-muted-foreground">Our commitments</h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {aiPrinciples.map((principle, index) => (
            <Reveal key={principle.title} delay={index * 50}>
              <div className="flex h-full flex-col rounded-3xl border border-border bg-card/40 p-7">
                <h3 className="text-xl leading-snug">{principle.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{principle.body}</p>
                <p className="mt-5 border-t border-border pt-4 label leading-relaxed text-coral">
                  {principle.evidence}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </PageSection>

      {/* RAG patterns */}
      <PageSection tone="paper">
        <h2 className="label text-muted-foreground">Retrieval architectures</h2>

        <p className="mt-6 max-w-3xl leading-relaxed text-muted-foreground">
          &quot;RAG&quot; covers a lot of ground, and the honest answer to &quot;which one do I
          need?&quot; is usually &quot;the simplest one that passes your evaluation set&quot;. These
          are the patterns we deploy, in ascending order of cost and complexity.
        </p>

        <ul className="mt-12 divide-y divide-border border-y border-border">
          {ragPatterns.map((pattern, index) => (
            <Reveal key={pattern.slug} as="li" delay={index * 50} y={16}>
              <div className="grid gap-5 py-10 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-14">
                <div>
                  <p className="label text-muted-foreground tabular-nums">
                    {(index + 1).toString().padStart(2, '0')}
                  </p>
                  <h3 className="mt-3 text-2xl leading-tight sm:text-3xl">{pattern.name}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{pattern.summary}</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <h4 className="label text-[0.55rem] text-coral">Use it when</h4>
                    <p className="mt-2 leading-relaxed text-muted-foreground">{pattern.useWhen}</p>
                  </div>

                  <div>
                    <h4 className="label text-[0.55rem] text-coral">The trade-off</h4>
                    <p className="mt-2 leading-relaxed text-muted-foreground">{pattern.tradeoff}</p>
                  </div>

                  <ul className="flex flex-wrap gap-1.5 pt-1">
                    {pattern.stack.map((item) => (
                      <li key={item}>
                        <Tag>{item}</Tag>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </PageSection>

      {/* Models */}
      <PageSection>
        <h2 className="label text-muted-foreground">Models we build against</h2>

        <p className="mt-6 max-w-3xl leading-relaxed text-muted-foreground">
          We are deliberately not model-agnostic in the unhelpful sense — we have opinions backed by
          measurement. Where a task is routine, we will argue for the cheapest model that clears the
          bar, because the expensive one is usually buying accuracy you do not need.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {modelProviders.map((provider, index) => (
            <Reveal key={provider.vendor} delay={index * 50}>
              <div className="flex h-full flex-col rounded-3xl border border-border bg-card/40 p-7">
                <h3 className="text-xl">{provider.vendor}</h3>

                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {provider.models.map((model) => (
                    <li key={model}>
                      <Tag>{model}</Tag>
                    </li>
                  ))}
                </ul>

                <dl className="mt-6 space-y-4 border-t border-border pt-5 text-sm">
                  <div>
                    <dt className="label text-[0.55rem] text-coral">Best for</dt>
                    <dd className="mt-1.5 leading-relaxed text-muted-foreground">
                      {provider.bestFor}
                    </dd>
                  </div>
                  <div>
                    <dt className="label text-[0.55rem] text-coral">Avoid when</dt>
                    <dd className="mt-1.5 leading-relaxed text-muted-foreground">
                      {provider.avoidWhen}
                    </dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          ))}
        </div>
      </PageSection>

      {/* Cost model — the table competitors avoid publishing. */}
      <PageSection>
        <h2 className="label text-muted-foreground">What it actually costs to run</h2>

        <p className="mt-6 max-w-3xl leading-relaxed text-muted-foreground">
          Retrieval cost scales with usage in ways that are easy to miss during a demo. These are
          indicative figures from our engagements — your corpus and query shape move them, which is
          why we track cost per resolved task from week one.
        </p>

        <div className="mt-10 overflow-x-auto rounded-3xl border border-border">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <caption className="sr-only">Indicative monthly cost by retrieval pattern</caption>
            <thead>
              <tr className="border-b border-border bg-background">
                <th scope="col" className="p-5 label text-[0.55rem] text-muted-foreground">
                  Pattern
                </th>
                <th scope="col" className="p-5 label text-[0.55rem] text-muted-foreground">
                  At 10k queries/mo
                </th>
                <th scope="col" className="p-5 label text-[0.55rem] text-muted-foreground">
                  At 500k queries/mo
                </th>
                <th scope="col" className="p-5 label text-[0.55rem] text-muted-foreground">
                  Dominant cost
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                {
                  name: 'Baseline RAG',
                  low: '£80 – £200',
                  high: '£2k – £5k',
                  driver: 'Generation tokens',
                },
                {
                  name: 'Hybrid + rerank',
                  low: '£150 – £400',
                  high: '£4k – £10k',
                  driver: 'Reranker + generation',
                },
                {
                  name: 'Agentic (3 hops)',
                  low: '£400 – £1k',
                  high: '£12k – £30k',
                  driver: 'Repeated generation',
                },
                {
                  name: 'Self-correcting',
                  low: '£250 – £600',
                  high: '£7k – £16k',
                  driver: 'Checker passes',
                },
              ].map((row) => (
                <tr key={row.name} className="bg-card/40">
                  <th scope="row" className="p-5 text-base text-foreground">
                    {row.name}
                  </th>
                  <td className="p-5 font-mono text-sm whitespace-nowrap tabular-nums">
                    {row.low}
                  </td>
                  <td className="p-5 font-mono text-sm whitespace-nowrap tabular-nums">
                    {row.high}
                  </td>
                  <td className="p-5 text-muted-foreground">{row.driver}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Self-hosting open models flips this: high fixed cost, near-zero marginal cost. It wins
          past roughly 2M queries a month — and only if someone operates the GPUs.
        </p>
      </PageSection>

      {/* When RAG is wrong — the honest section competitors skip. */}
      <PageSection tone="paper">
        <h2 className="label text-muted-foreground">When RAG is the wrong answer</h2>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            {
              title: 'The answer fits in a database query',
              body: 'If the question is "what is the status of order 4821", you need a lookup, not retrieval. RAG adds latency, cost and hallucination risk to something SQL answers exactly.',
            },
            {
              title: 'The corpus changes faster than you re-index',
              body: 'Sub-minute freshness requirements (live prices, seat availability) break the embed-and-retrieve loop. Retrieve the pointer, not the content — then read live.',
            },
            {
              title: 'Nobody can define a right answer',
              body: 'If domain experts disagree on what correct looks like, no evaluation set exists and no accuracy number is meaningful. Fix the process first; automate it second.',
            },
          ].map((item, index) => (
            <Reveal key={item.title} delay={index * 50}>
              <div className="h-full rounded-3xl border border-border bg-background p-7">
                <h3 className="text-xl leading-snug">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </PageSection>

      {/* AI case studies */}
      <PageSection tone="paper">
        <h2 className="label text-muted-foreground">AI case studies</h2>

        <div className="mt-12 space-y-20">
          {aiCaseStudies.map((study) => (
            <article key={study.slug}>
              <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-16">
                <div>
                  <p className="label text-[0.55rem] text-muted-foreground">
                    {study.client} · {study.year}
                  </p>

                  <h3 className="mt-4 text-3xl leading-tight sm:text-4xl">{study.title}</h3>

                  <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                    {study.summary}
                  </p>

                  <h4 className="mt-8 label text-coral uppercase">The challenge</h4>
                  <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
                    {study.challenge}
                  </p>

                  <h4 className="mt-8 label text-coral uppercase">What we did</h4>
                  <ol className="mt-3 max-w-2xl list-decimal space-y-2 pl-5 text-muted-foreground">
                    {study.approach.map((step) => (
                      <li key={step} className="leading-relaxed">
                        {step}
                      </li>
                    ))}
                  </ol>

                  <h4 className="mt-8 label text-[0.55rem] text-muted-foreground">Outcome</h4>
                  <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
                    {study.outcome}
                  </p>
                </div>

                <aside className="flex flex-col gap-5">
                  <BlockArt seed={study.slug} ratio="square" />

                  <dl className="grid grid-cols-2 gap-5">
                    {study.metrics.map((metric) => (
                      <div key={metric.label}>
                        <dt className="label text-muted-foreground uppercase">{metric.label}</dt>
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
                </aside>
              </div>
            </article>
          ))}
        </div>
      </PageSection>

      <FaqSection eyebrow="AI" title="Questions we get about AI work." items={aiFaqs} />

      <CtaBand
        eyebrow="Start here"
        title="Bring us a retrieval problem."
        body="The first conversation is usually the most useful one we have: tell us what you are trying to answer and we will tell you which pattern — including whether you need one at all."
        secondary={{ href: '/insights/evaluating-ai-features', label: 'Read how we evaluate' }}
      />
    </>
  )
}
