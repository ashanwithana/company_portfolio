import { Reveal } from '@/components/ui/reveal'
import { Section, SectionHeading } from '@/components/ui/section-heading'
import { Hero } from '@/components/sections/hero'
import { ServicesPreview } from '@/components/sections/services-preview'
import { ClientLogos, WorkPreview } from '@/components/sections/work-preview'
import { CtaBand } from '@/components/ui/cta-band'
import { siteConfig } from '@/content/site'

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Services */}
      <Section id="services" label="What we do">
        <SectionHeading
          id="services"
          index="01"
          label="What we do"
          title="Six things we are genuinely good at."
          description="We keep the practice deliberately narrow. Every service below is one we have delivered repeatedly, with a team that has done it before."
        />
        <ServicesPreview />
      </Section>

      {/* Work */}
      <Section id="work" label="Selected work">
        <SectionHeading
          id="work"
          index="02"
          label="Selected work"
          title="Work we can show you the numbers for."
          description="Every engagement below lists what changed, measured against the baseline we captured before we started."
        />
        <WorkPreview />

        <div className="mt-12 flex flex-wrap gap-4">
          <a
            href="/work"
            className="inline-flex h-12 items-center justify-center rounded-full border border-border px-6 font-mono text-xs tracking-[0.2em] uppercase transition-colors hover:border-foreground/25"
          >
            All case studies
            <span aria-hidden="true" className="ml-2">
              →
            </span>
          </a>
        </div>
      </Section>

      {/* Clients */}
      <Section id="clients" label="Who we work with" tone="muted">
        <SectionHeading
          id="clients"
          index="03"
          label="Who we work with"
          title="Trusted by teams who cannot afford surprises."
        />
        <ClientLogos />
      </Section>

      {/* Approach */}
      <Section id="approach" label="How we work">
        <SectionHeading
          id="approach"
          index="04"
          label="How we work"
          title="Five steps, and a fixed number at the end of the second."
          description="No discovery phase that quietly becomes the project. Here is the shape of every engagement we run."
        />

        <Reveal>
          <ol className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-5">
            {[
              { step: '01', title: 'Understand', body: 'Two weeks embedded. We read the code and watch the work.' },
              { step: '02', title: 'Shape', body: 'A written plan with risks, sequence and a fixed number.' },
              { step: '03', title: 'Build', body: 'Short cycles, each ending with something demonstrable.' },
              { step: '04', title: 'Prove', body: 'Measured against the baseline. Numbers or an explanation.' },
              { step: '05', title: 'Hand over', body: 'Docs, runbooks and pairing until your team is comfortable.' },
            ].map((item) => (
              <li key={item.step} className="flex flex-col gap-3 bg-background p-7">
                <span className="font-mono text-xs tracking-[0.2em] text-mint">{item.step}</span>
                <h3 className="text-xl">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </Section>

      {/* Latest insight */}
      <Section id="insights" label="Latest insight">
        <SectionHeading
          id="insights"
          index="05"
          label="Latest insight"
          title="What we have been thinking about."
          description="Notes from the work — written when we learn something, not on a content schedule."
        />
        <LatestInsight />
      </Section>

      <CtaBand
        eyebrow="Start a conversation"
        title="Tell us what you are building."
        body={`${siteConfig.contactContent.availability.body} ${siteConfig.contactContent.responseTime}`}
        secondary={{ href: '/careers', label: 'Join the studio' }}
      />
    </>
  )
}

/**
 * Latest post teaser.
 *
 * Imported lazily at module scope so the home page stays a server component;
 * the actual post list is resolved from the aggregate index.
 */
async function LatestInsight() {
  const { getAllPosts, sortPosts } = await import('@/content/posts/index')
  const [latest] = sortPosts(getAllPosts()).slice(0, 1)

  if (!latest) return null

  return (
    <Reveal>
      <article className="group flex flex-col gap-4 rounded-2xl border border-border bg-card/40 p-7 transition-colors hover:border-foreground/25 md:flex-row md:items-center md:justify-between md:gap-10">
        <div className="max-w-2xl">
          <p className="font-mono text-[0.6rem] tracking-[0.25em] text-muted-foreground uppercase">
            {latest.tags.join(' · ')}
          </p>
          <h3 className="mt-3 text-2xl leading-snug transition-colors group-hover:text-mint sm:text-3xl">
            {latest.title}
          </h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">{latest.summary}</p>
        </div>

        <a
          href={`/blog/${latest.slug}`}
          className="inline-flex min-h-11 shrink-0 items-center gap-2 font-mono text-[0.7rem] tracking-[0.2em] uppercase"
        >
          Read
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </a>
      </article>
    </Reveal>
  )
}
