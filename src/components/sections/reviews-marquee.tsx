import Link from 'next/link'

import { testimonials } from '@/content/company'

/**
 * Client-review strip that closes the hero.
 *
 * Mirrors the reference card for card: a transparent `article` with a hairline
 * border, 14px radius and 24px padding; a small source label; gold five-star
 * row; a light 12px quote; a pink "read more" link; and an attribution row
 * over a hairline rule. The track is duplicated once and translated -50% on a
 * loop, so there is no visible seam.
 */
export function ReviewsMarquee() {
  const cards = [...testimonials, ...testimonials]

  return (
    <div
      className="relative mt-16 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      aria-label="Client reviews"
    >
      <div className="flex w-max animate-marquee gap-5 pr-5">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex gap-5" aria-hidden={copy === 1}>
            {cards.map((testimonial, i) => (
              <article
                key={`${testimonial.name}-${i}`}
                className="w-[19rem] shrink-0 rounded-[14px] border border-border bg-transparent p-6 sm:w-[25rem]"
              >
                <p className="font-mono text-[10px] leading-[1.4] tracking-[0.08em] text-muted-foreground uppercase">
                  {testimonial.company} reviews
                </p>

                <div
                  className="mt-3 text-[12px] leading-[1.6] tracking-[2px] text-[#f5b90a]"
                  aria-label="Five out of five stars"
                >
                  ★★★★★
                </div>

                <blockquote className="mt-3 line-clamp-3 text-[12px] leading-[1.6] font-light text-foreground/90">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                {testimonial.caseStudySlug ? (
                  <Link
                    href={`/work/${testimonial.caseStudySlug}`}
                    className="mt-3 inline-flex min-h-8 items-center gap-1.5 font-mono text-[10px] tracking-[0.08em] text-coral uppercase"
                    tabIndex={copy === 1 ? -1 : undefined}
                  >
                    Click to read more
                    <span aria-hidden="true">→</span>
                  </Link>
                ) : null}

                <p className="mt-3 border-t border-border pt-3 text-[12px] font-light text-muted-foreground">
                  {testimonial.name} · {testimonial.role} · {testimonial.company}
                </p>
              </article>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
