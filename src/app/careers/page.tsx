import Link from 'next/link'

import { PageHeader, PageSection } from '@/components/layout/page'
import { Reveal } from '@/components/ui/reveal'
import { Tag } from '@/components/ui/badge'
import { FaqSection } from '@/components/ui/faq'
import { FaqSchema } from '@/components/seo/faq-schema'
import { careersFaqs } from '@/content/faqs'
import { allBenefits, rolesByDepartment } from '@/content/roles'

export const metadata = {
  title: 'Careers',
  description:
    'Open roles at SketchLabs — full-stack engineering and internships. Async-first, four-day week, seven people.',
}

export default function CareersPage() {
  const groups = rolesByDepartment()
  const totalRoles = groups.reduce((sum, group) => sum + group.roles.length, 0)
  const benefits = allBenefits()

  return (
    <>
      <FaqSchema items={careersFaqs} />

      <PageHeader
        eyebrow="Careers"
        title="Seven people, deliberately not seventy."
        lede="We stay small enough that everyone knows every project, which means we can hire slowly and well. Everything here is async-first, with two weeks a year in the studio together."
      />

      <PageSection className="pt-0">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-20">
          {/* Roles by department */}
          <div>
            <h2 className="label text-muted-foreground">{totalRoles} open roles</h2>

            {groups.map((group) => (
              <section key={group.department} className="mt-12 first:mt-10">
                <h3 className="text-2xl">{group.department}</h3>

                <ul className="mt-6 divide-y divide-border border-y border-border">
                  {group.roles.map((role, index) => (
                    <Reveal key={role.slug} as="li" delay={index * 50} y={12}>
                      <Link
                        href={`/careers/${role.slug}`}
                        className="group flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="max-w-2xl">
                          <h4 className="text-xl transition-colors group-hover:text-brand">
                            {role.title}
                          </h4>
                          <p className="mt-2 leading-relaxed text-muted-foreground">
                            {role.summary}
                          </p>

                          <ul className="mt-4 flex flex-wrap gap-1.5">
                            <li>
                              <Tag>{role.employment}</Tag>
                            </li>
                            <li>
                              <Tag>{role.location}</Tag>
                            </li>
                            {role.remote ? (
                              <li>
                                <Tag className="text-brand">Remote</Tag>
                              </li>
                            ) : null}
                          </ul>
                        </div>

                        <span
                          aria-hidden="true"
                          className="shrink-0 text-2xl text-muted-foreground transition-transform group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </Link>
                    </Reveal>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          {/* Benefits + speculative applications */}
          <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <div className="border border-border bg-card/40 p-7">
                <h2 className="label text-muted-foreground">What we offer</h2>
                <ul className="mt-5 space-y-3">
                  {benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                    >
                      <span aria-hidden="true" className="text-brand">
                        →
                      </span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={60}>
              <div className="border border-border bg-muted/30 p-7">
                <h2 className="text-lg">Nothing that fits?</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  We keep a shortlist of people we would like to work with when the right role
                  appears. Send a short note about what you would want to be doing.
                </p>
                <a
                  href="mailto:careers@northlight.example.com?subject=Speculative%20application"
                  className="mt-5 inline-flex min-h-11 items-center gap-2 label transition-colors hover:text-brand"
                >
                  Write to us
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </Reveal>
          </aside>
        </div>
      </PageSection>

      <FaqSection eyebrow="Before you apply" title="How we hire." items={careersFaqs}>
        <p className="leading-relaxed text-muted-foreground">
          We keep the process short and pay for any work sample. If you are put off by a multi-stage
          process, that is a reasonable position.
        </p>
      </FaqSection>
    </>
  )
}
