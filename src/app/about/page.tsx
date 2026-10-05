import Link from 'next/link'

import { PageHeader, PageSection } from '@/components/layout/page'
import { InitialsAvatar } from '@/components/ui/initials-avatar'
import { Reveal } from '@/components/ui/reveal'
import { Tag } from '@/components/ui/badge'
import { CtaBand } from '@/components/ui/cta-band'
import { ClientLogos } from '@/components/sections/client-logos'
import { modelProviders } from '@/content/ai'
import { milestones, team, values } from '@/content/company'
import { platforms } from '@/content/enterprise'
import { studioStats } from '@/content/services'

export const metadata = {
  title: 'About',
  description:
    'Northlight is a seven-person product studio in Colombo. We design and build software, and we are deliberately small enough to know every project by name.',
}

/** Every technology the studio works with, PHP first: file slug and label. */
const techStack = [
  { slug: 'php', label: 'PHP' },
  { slug: 'typescript', label: 'TypeScript' },
  { slug: 'react', label: 'React' },
  { slug: 'nextdotjs', label: 'Next.js' },
  { slug: 'nodedotjs', label: 'Node.js' },
  { slug: 'python', label: 'Python' },
  { slug: 'postgresql', label: 'PostgreSQL' },
  { slug: 'redis', label: 'Redis' },
  { slug: 'tailwindcss', label: 'Tailwind CSS' },
  { slug: 'graphql', label: 'GraphQL' },
  { slug: 'docker', label: 'Docker' },
  { slug: 'kubernetes', label: 'Kubernetes' },
  { slug: 'odoo', label: 'Odoo' },
  { slug: 'sap', label: 'SAP' },
  { slug: 'salesforce', label: 'Salesforce' },
  { slug: 'figma', label: 'Figma' },
  { slug: 'playwright', label: 'Playwright' },
] as const

export default function AboutPage() {
  return (
    <>
      <PageHeader
        ghost="About"
        eyebrow="About"
        title="Seven people who would rather be right than fast."
        lede="Northlight is an independent product studio in Colombo. We design and build software for teams that cannot afford to get it wrong twice — usually because the software is load-bearing for something regulated, expensive or irreversible."
      />

      {/* Platforms and models — concrete capability rather than adjectives. */}
      <PageSection className="pt-0">
        <h2 className="label text-muted-foreground">What we work with</h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <Reveal>
            <div className="flex h-full flex-col rounded-3xl border border-border bg-card/40 p-7">
              <h3 className="text-lg">Enterprise platforms</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Accredited or certified, and implementing them weekly rather than once a year.
              </p>
              <ul className="mt-6 flex flex-wrap gap-1.5">
                {platforms.map((platform) => (
                  <li key={platform.name}>
                    <Tag>{platform.name}</Tag>
                  </li>
                ))}
              </ul>
              <Link
                href="/enterprise"
                className="mt-auto inline-flex min-h-8 items-center gap-2 pt-6 label text-[0.6rem] transition-colors hover:text-brand"
              >
                Enterprise practice
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={60}>
            <div className="flex h-full flex-col rounded-3xl border border-border bg-card/40 p-7">
              <h3 className="text-lg">Models we build against</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Chosen per task against an evaluation set, never by default.
              </p>
              <ul className="mt-6 flex flex-wrap gap-1.5">
                {modelProviders.map((provider) => (
                  <li key={provider.vendor}>
                    <Tag>{provider.vendor}</Tag>
                  </li>
                ))}
              </ul>
              <Link
                href="/ai"
                className="mt-auto inline-flex min-h-8 items-center gap-2 pt-6 label text-[0.6rem] transition-colors hover:text-brand"
              >
                AI practice
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="flex h-full flex-col rounded-3xl border border-border bg-card/40 p-7">
              <h3 className="text-lg">Everything else</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Boring, well-understood tools. Novelty is a cost, and we spend it only where it
                actually differentiates the product.
              </p>
              <ul className="mt-6 flex flex-wrap gap-1.5">
                {['TypeScript', 'React', 'Next.js', 'PostgreSQL', 'Kubernetes', 'Python'].map(
                  (item) => (
                    <li key={item}>
                      <Tag>{item}</Tag>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </Reveal>
        </div>
      </PageSection>

      {/* Studio stats */}
      <PageSection>
        <dl className="grid gap-10 border-y border-border py-12 sm:grid-cols-2 lg:grid-cols-4">
          {studioStats.map((stat) => (
            <div key={stat.label}>
              <dt className="label text-[0.55rem] text-muted-foreground">{stat.label}</dt>
              <dd className="mt-2 display-lg tabular-nums">
                {stat.value}
                <span className="text-brand">{stat.suffix}</span>
              </dd>
            </div>
          ))}
        </dl>
      </PageSection>

      {/* Technologies we use — an endless slider, PHP first. */}
      <PageSection tone="muted" className="overflow-hidden">
        <h2 className="label text-muted-foreground">Technologies we use</h2>

        <div className="relative mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {[0, 1].map((half) => (
              <div key={half} aria-hidden={half === 1} className="flex shrink-0 items-center">
                {techStack.map((tech) => (
                  <span
                    key={tech.slug}
                    title={tech.label}
                    className="group mr-3 flex size-16 items-center justify-center rounded-xl border border-border bg-card transition-colors duration-300 hover:border-border-strong sm:size-20"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/logos/${tech.slug}.svg`}
                      alt={half === 0 ? tech.label : ''}
                      loading="lazy"
                      className="size-8 opacity-70 grayscale transition-[filter,opacity] duration-300 group-hover:opacity-100 group-hover:grayscale-0 sm:size-10"
                    />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </PageSection>

      {/* Values */}
      <PageSection>
        <h2 className="label text-muted-foreground">What we believe</h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {values.map((value, index) => (
            <Reveal key={value.title} delay={index * 60}>
              <div className="h-full rounded-3xl border border-border bg-card/40 p-7">
                <h3 className="text-xl leading-snug">{value.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{value.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </PageSection>

      {/* Team */}
      <PageSection tone="muted">
        <h2 className="label text-muted-foreground">The studio</h2>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member, index) => (
            <Reveal key={member.name} as="li" delay={index * 50}>
              <div className="flex h-full gap-4 rounded-3xl border border-border bg-background p-6">
                <InitialsAvatar initials={member.initials} className="size-12 shrink-0" />

                <div>
                  <h3 className="text-lg leading-tight">{member.name}</h3>
                  <p className="mt-1 label text-brand uppercase">{member.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </PageSection>

      {/* History */}
      <PageSection>
        <h2 className="label text-muted-foreground">How we got here</h2>

        <ol className="mt-10 space-y-8">
          {milestones.map((milestone, index) => (
            <Reveal key={milestone.year} as="li" delay={index * 60} y={16}>
              <div className="grid gap-3 border-b border-border pb-8 md:grid-cols-[8rem_minmax(0,1fr)] md:gap-10">
                <p className="label text-muted-foreground tabular-nums">{milestone.year}</p>
                <div>
                  <h3 className="text-xl">{milestone.title}</h3>
                  <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
                    {milestone.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </PageSection>

      <PageSection>
        <h2 className="label text-muted-foreground">Clients</h2>
        <div className="mt-10">
          <ClientLogos />
        </div>
      </PageSection>

      <CtaBand
        eyebrow="Work with us"
        title="We are hiring, and we take on projects."
        body="If you are looking for a studio that will tell you when something will not work, get in touch. We are also always happy to meet people who want to join."
        secondary={{ href: '/careers', label: 'See open roles' }}
      />
    </>
  )
}
