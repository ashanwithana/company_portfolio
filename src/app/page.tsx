import Link from 'next/link'

import { Reveal } from '@/components/ui/reveal'
import { Tag } from '@/components/ui/badge'
import { Section, SectionHeading } from '@/components/ui/section-heading'
import { Hero } from '@/components/sections/hero'
import { ServicesPreview } from '@/components/sections/services-preview'
import { ClientLogos, WorkPreview } from '@/components/sections/work-preview'
import { CtaBand } from '@/components/ui/cta-band'
import { contactContent } from '@/content/site'
import { differentiators } from '@/content/company'
import { getAllPosts } from '@/content/posts-index'
import { Testimonials } from '@/components/sections/testimonials'

/**
 * Home page composition.
 *
 * Sections alternate dark and paper to give the page a rhythm rather than one
 * continuous wall of dark — `tone="paper"` inverts whichever ground the current
 * theme is on, so the contrast holds in both themes.
 */
export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Services */}
      <Section id="services" label="What we do" dotGrid>
        <SectionHeading
          index="01"
          label="What we do"
          title="Six things we are genuinely good at."
          ghost="Services"
          description="We keep the practice deliberately narrow. Every service below is one we have delivered repeatedly, with a team that has done it before."
        />
        <ServicesPreview />
      </Section>

      {/* Specialist practice tracks */}
      <Section id="practices" label="Practice tracks" tone="paper">
        <SectionHeading
          index="02"
          label="Practice tracks"
          title="Two areas we have gone deep on."
          ghost="Practices"
          description="Most of our work sits in these two tracks, so they get their own pages, their own case studies and their own standards."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <Link
              href="/enterprise"
              className="group flex h-full flex-col rounded-3xl border border-border bg-background p-8 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-primary/40"
            >
              <p className="label text-[0.55rem] text-primary">Practice track 01</p>

              <h3 className="mt-4 display-sm transition-colors group-hover:text-primary">
                Enterprise systems
              </h3>

              <p className="mt-4 flex-1 leading-relaxed text-muted-foreground">
                Odoo, Dynamics 365, SAP Business One, Salesforce and commerce implementations.
                Data-first, migrated in rehearsed phases, handed over to a team that can run it.
              </p>

              <ul className="mt-6 flex flex-wrap gap-1.5">
                {['Odoo partner', 'Dynamics 365', 'SAP B1', 'Salesforce'].map((item) => (
                  <li key={item}>
                    <Tag>{item}</Tag>
                  </li>
                ))}
              </ul>

              <span className="mt-7 inline-flex min-h-8 items-center gap-2 label text-[0.6rem]">
                Explore
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          </Reveal>

          <Reveal delay={70}>
            <Link
              href="/ai"
              className="group flex h-full flex-col rounded-3xl border border-border bg-background p-8 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-coral/40"
            >
              <p className="label text-[0.55rem] text-coral">Practice track 02</p>

              <h3 className="mt-4 display-sm transition-colors group-hover:text-coral">
                AI engineering
              </h3>

              <p className="mt-4 flex-1 leading-relaxed text-muted-foreground">
                Retrieval pipelines, model integrations and agentic workflows — with the evaluation
                harness shipped first, so there is a number rather than a promising demo.
              </p>

              <ul className="mt-6 flex flex-wrap gap-1.5">
                {['RAG', 'Evaluation', 'Anthropic', 'pgvector'].map((item) => (
                  <li key={item}>
                    <Tag>{item}</Tag>
                  </li>
                ))}
              </ul>

              <span className="mt-7 inline-flex min-h-8 items-center gap-2 label text-[0.6rem]">
                Explore
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          </Reveal>
        </div>
      </Section>

      {/* Work */}
      <Section id="work" label="Selected work" dotGrid>
        <SectionHeading
          index="03"
          label="Selected work"
          title="Work we can show you the numbers for."
          ghost="Work"
          description="Every engagement below lists what changed, measured against the baseline we captured before we started."
        />
        <WorkPreview />

        <div className="mt-12">
          <Link
            href="/work"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border-strong px-6 label transition-colors hover:border-coral hover:text-coral"
          >
            All case studies
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Section>

      {/* Clients */}
      <Section id="clients" label="Who we work with" tone="paper">
        <SectionHeading
          index="04"
          label="Who we work with"
          title="Trusted by teams who cannot afford surprises."
          ghost="Clients"
        />
        <ClientLogos />

        {/* Why us — the three commitments competitors will not make. */}
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {differentiators.map((item, i) => (
            <Reveal key={item.title} delay={i * 60}>
              <div className="h-full rounded-3xl border border-border bg-background p-7">
                <p className="label text-[0.55rem] text-coral tabular-nums">
                  {(i + 1).toString().padStart(2, '0')}
                </p>
                <h3 className="mt-3 text-lg leading-snug">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Testimonials */}
      <Section id="testimonials" label="What clients say">
        <SectionHeading
          index="05"
          label="What clients say"
          title="In their words, with the numbers attached."
          ghost="Reviews"
          description="Every quote links to the case study behind it — so you can check the claim rather than take our word for it."
        />
        <Testimonials />
      </Section>

      {/* Approach */}
      <Section id="approach" label="How we work" tone="paper">
        <SectionHeading
          index="06"
          label="How we work"
          title="Five steps, and a fixed number at the end of the second."
          ghost="Method"
          description="No discovery phase that quietly becomes the project. Here is the shape of every engagement we run."
        />

        <Reveal>
          <ol className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-5">
            {[
              {
                step: '01',
                title: 'Understand',
                body: 'Two weeks embedded. We read the code and watch the work.',
              },
              {
                step: '02',
                title: 'Shape',
                body: 'A written plan with risks, sequence and a fixed number.',
              },
              {
                step: '03',
                title: 'Build',
                body: 'Short cycles, each ending with something demonstrable.',
              },
              {
                step: '04',
                title: 'Prove',
                body: 'Measured against the baseline. Numbers or an explanation.',
              },
              {
                step: '05',
                title: 'Hand over',
                body: 'Docs, runbooks and pairing until your team is comfortable.',
              },
            ].map((item) => (
              <li key={item.step} className="flex flex-col gap-3 bg-background p-7">
                <span className="label text-[0.55rem] text-coral">{item.step}</span>
                <h3 className="text-lg">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </Section>

      {/* Latest insight */}
      <Section id="insights" label="Latest insight">
        <SectionHeading
          index="07"
          label="Latest insight"
          title="What we have been thinking about."
          ghost="Insights"
          description="Notes from the work — written when we learn something, not on a content schedule."
        />
        <LatestInsight />
      </Section>

      <CtaBand
        eyebrow="Start a conversation"
        title="Tell us what you are building."
        ghost="Let's talk"
        body={`${contactContent.availability.body} ${contactContent.responseTime}`}
        secondary={{ href: '/careers', label: 'Join the studio' }}
      />
    </>
  )
}

/** Latest post teaser, resolved from the same registry the insights index uses. */
function LatestInsight() {
  const [latest] = getAllPosts().slice(0, 1)

  if (!latest) return null

  return (
    <Reveal>
      <Link
        href={`/insights/${latest.slug}`}
        className="group flex flex-col gap-4 rounded-3xl border border-border bg-card/40 p-7 transition-colors hover:border-border-strong md:flex-row md:items-center md:justify-between md:gap-10"
      >
        <div className="max-w-2xl">
          <p className="label text-[0.55rem] text-muted-foreground">
            {latest.tags.join(' · ')} · {latest.readingTimeMinutes} min read
          </p>
          <h3 className="mt-3 text-2xl leading-snug transition-colors group-hover:text-coral sm:text-3xl">
            {latest.title}
          </h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">{latest.summary}</p>
        </div>

        <span className="inline-flex min-h-11 shrink-0 items-center gap-2 label text-[0.65rem]">
          Read
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </span>
      </Link>
    </Reveal>
  )
}
