import Link from 'next/link'

import { Reveal } from '@/components/ui/reveal'
import { testimonials } from '@/content/company'

/** Client quotes, each linked to its case study where one exists. */
export function Testimonials() {
  return (
    <ul className="grid gap-5 md:grid-cols-2">
      {testimonials.map((testimonial, index) => (
        <Reveal key={testimonial.name} as="li" delay={index * 60}>
          <figure className="flex h-full flex-col rounded-3xl border border-border bg-card/40 p-7">
            <span aria-hidden="true" className="font-display text-4xl leading-none text-coral">
              &ldquo;
            </span>
            <blockquote className="mt-2 flex-1 leading-relaxed text-foreground/90">
              {testimonial.quote}
            </blockquote>
            <figcaption className="mt-6 border-t border-border pt-5">
              <p className="text-sm font-medium">
                {testimonial.name} · {testimonial.role}
              </p>
              <p className="mt-1 label text-[0.55rem] text-muted-foreground">
                {testimonial.company}
              </p>
              {testimonial.caseStudySlug ? (
                <Link
                  href={`/work/${testimonial.caseStudySlug}`}
                  className="mt-3 inline-flex min-h-8 items-center gap-2 label text-[0.6rem] transition-colors hover:text-coral"
                >
                  Read the case study
                  <span aria-hidden="true">→</span>
                </Link>
              ) : null}
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </ul>
  )
}
