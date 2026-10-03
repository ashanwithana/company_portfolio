import Link from 'next/link'

import { testimonials } from '@/content/company'

/**
 * Client-review strip that closes the hero.
 *
 * Mirrors the reference: a swipeable snap row of review cards — `article`
 * elements at a 400px measure with a 220px minimum height, 16px gutters, and
 * a card carrying the source label, gold stars, a light 12px quote, a pink
 * read-more link and an attribution row over a hairline rule. The row scrolls
 * natively (touch swipe, shift-wheel, drag) with a hidden scrollbar rather
 * than auto-playing, which is how the reference behaves.
 */
export function ReviewsMarquee() {
  return (
    <div
      className="relative z-10 mt-12"
      role="region"
      aria-label="Client reviews — swipe to browse"
    >
      <div className="[scrollbar-width:none] overflow-x-auto [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max items-start gap-4 px-4 pb-4 sm:px-6">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="flex min-h-[220px] w-[19rem] shrink-0 snap-start flex-col rounded-[14px] border border-border bg-transparent p-6 sm:w-[25rem]"
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
                  className="mt-3 inline-flex min-h-8 w-fit items-center gap-1.5 font-mono text-[10px] tracking-[0.08em] text-coral uppercase"
                >
                  Click to read more
                  <span aria-hidden="true">→</span>
                </Link>
              ) : null}

              <p className="mt-auto border-t border-border pt-3 text-[12px] font-light text-muted-foreground">
                {testimonial.name} · {testimonial.role} · {testimonial.company}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
