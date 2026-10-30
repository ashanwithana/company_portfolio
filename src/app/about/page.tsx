import Link from 'next/link'

import { PageHeader } from '@/components/layout/page'
import { Reveal } from '@/components/ui/reveal'
import { Tag } from '@/components/ui/badge'
import { SectionHead } from '@/components/ui/section-head'
import { CtaBand } from '@/components/ui/cta-band'
import { StudioStats } from '@/components/sections/studio-stats'
import { ClientLogos } from '@/components/sections/client-logos'
import { modelProviders } from '@/content/ai'
import { milestones, team, values } from '@/content/company'
import { platforms } from '@/content/enterprise'

export const metadata = {
  title: 'About',
  description:
    'SketchLabs is a seven-person product studio in Colombo. We design and build software, and we are deliberately small enough to know every project by name.',
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
        eyebrow="About"
        title="Seven people who would rather be right than fast."
        lede="SketchLabs is an independent product studio in Colombo. We design and build software for teams that cannot afford to get it wrong twice — usually because the software is load-bearing for something regulated, expensive or irreversible."
      />

      {/* Platforms and models — concrete capability rather than adjectives. */}
      <section aria-labelledby="work-with-heading" className="container-page pt-14 md:pt-20">
        <SectionHead id="work-with-heading" index="01" title="What we work with" />

        <div className="mt-8 grid gap-px border border-border bg-border lg:grid-cols-3">
          <Reveal className="bg-background">
            <div className="flex h-full flex-col p-7 md:p-8">
              <h3 className="text-xl font-light">Enterprise platforms</h3>
              <p className="mt-3 text-sm leading-relaxed font-light text-muted-foreground">
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
                className="mt-auto inline-flex min-h-8 items-center gap-2 pt-6 font-mono text-[10px] tracking-[0.25em] uppercase transition-colors hover:text-muted-foreground"
              >
                Enterprise practice →
              </Link>
            </div>
          </Reveal>

          <Reveal delay={60} className="bg-background">
            <div className="flex h-full flex-col p-7 md:p-8">
              <h3 className="text-xl font-light">Models we build against</h3>
              <p className="mt-3 text-sm leading-relaxed font-light text-muted-foreground">
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
                className="mt-auto inline-flex min-h-8 items-center gap-2 pt-6 font-mono text-[10px] tracking-[0.25em] uppercase transition-colors hover:text-muted-foreground"
              >
                AI practice →
              </Link>
            </div>
          </Reveal>

          <Reveal delay={120} className="bg-background">
            <div className="flex h-full flex-col p-7 md:p-8">
              <h3 className="text-xl font-light">Everything else</h3>
              <p className="mt-3 text-sm leading-relaxed font-light text-muted-foreground">
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
      </section>

      {/* Studio stats */}
      <StudioStats className="mt-14 md:mt-20" />

      {/* Technologies we use — an endless slider, PHP first. */}
      <section
        aria-labelledby="tech-heading"
        className="container-page overflow-hidden pt-14 md:pt-20"
      >
        <SectionHead id="tech-heading" index="02" title="Technologies we use" />

        <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {[0, 1].map((half) => (
              <div key={half} aria-hidden={half === 1} className="flex shrink-0 items-center">
                {techStack.map((tech) => (
                  <span
                    key={tech.slug}
                    title={tech.label}
                    className="group mr-px flex size-16 items-center justify-center border border-border transition-colors duration-300 hover:border-border-strong sm:size-20"
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
      </section>

      {/* Values */}
      <section aria-labelledby="values-heading" className="container-page pt-20 md:pt-28">
        <SectionHead id="values-heading" index="03" title="What we believe" />

        <ol className="mt-8 grid border-t border-border-strong md:grid-cols-2">
          {values.map((value, index) => (
            <Reveal
              key={value.title}
              as="li"
              delay={index * 40}
              y={10}
              className="border-b border-border md:odd:border-r md:odd:pr-8 md:even:pl-8"
            >
              <div className="grid grid-cols-[3rem_1fr] gap-4 py-8">
                <span className="pt-1 font-mono text-[10px] tracking-[0.25em] text-muted-foreground">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-xl leading-snug font-light md:text-2xl">{value.title}</h3>
                  <p className="mt-3 leading-relaxed font-light text-muted-foreground">
                    {value.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Team */}
      <section aria-labelledby="team-heading" className="container-page pt-20 md:pt-28">
        <SectionHead id="team-heading" index="04" title="The studio" />

        <ul className="mt-8 border-t border-border-strong">
          {team.map((member, index) => (
            <Reveal
              key={member.name}
              as="li"
              delay={index * 30}
              y={8}
              className="border-b border-border"
            >
              <div className="group grid items-start gap-x-8 gap-y-3 px-4 py-6 transition-colors duration-300 hover:bg-foreground hover:text-background md:grid-cols-12 md:px-6">
                <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground group-hover:text-background/60 md:col-span-1 md:pt-2">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-2xl leading-tight font-light tracking-tight md:col-span-4 md:text-3xl">
                  {member.name}
                </h3>
                <p className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase group-hover:text-background/60 md:col-span-3 md:pt-2">
                  {member.role}
                </p>
                <p className="text-sm leading-relaxed font-light text-muted-foreground group-hover:text-background/70 md:col-span-4 md:text-base">
                  {member.bio}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* History */}
      <section aria-labelledby="history-heading" className="container-page pt-20 md:pt-28">
        <SectionHead id="history-heading" index="05" title="How we got here" />

        <ol className="mt-8 border-t border-border-strong">
          {milestones.map((milestone, index) => (
            <Reveal
              key={milestone.year}
              as="li"
              delay={index * 40}
              y={10}
              className="border-b border-border"
            >
              <div className="grid gap-x-8 gap-y-2 py-8 md:grid-cols-12">
                <p className="text-4xl leading-none font-thin tracking-tighter tabular-nums md:col-span-3 md:text-6xl">
                  {milestone.year}
                </p>
                <div className="md:col-span-7 md:col-start-5">
                  <h3 className="text-xl font-light md:text-2xl">{milestone.title}</h3>
                  <p className="mt-2 max-w-2xl leading-relaxed font-light text-muted-foreground">
                    {milestone.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <section aria-labelledby="clients-heading" className="container-page py-20 md:py-28">
        <SectionHead id="clients-heading" index="06" title="Clients" />
        <div className="mt-8">
          <ClientLogos />
        </div>
      </section>

      <CtaBand
        eyebrow="Work with us"
        title="We are hiring, and we take on projects."
        body="If you are looking for a studio that will tell you when something will not work, get in touch. We are also always happy to meet people who want to join."
        secondary={{ href: '/careers', label: 'See open roles' }}
      />
    </>
  )
}
