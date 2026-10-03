import Link from 'next/link'

import { testimonials } from '@/content/company'

/**
 * Client-review strip that closes the hero.
 *
 * Mirrors the reference: a full-bleed, auto-scrolling row of review cards, each
 * with a source label, a five-star row and a short quote. The quotes are ours
 * (each links to its case study); the rhythm — label, stars, quote — is theirs.
 *
 * The track is duplicated once and translated -50% on a loop, so there is no
 * visible seam. Paused for reduced motion via the global reduced-motion reset,
 * which collapses the animation to its first frame.
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
              <figure
                key={`${testimonial.name}-${i}`}
                className="w-[19rem] shrink-0 rounded-[22px] border border-border bg-card/60 p-6 sm:w-[22rem]"
              >
                <figcaption className="label text-[0.6rem] text-muted-foreground">
                  {testimonial.company} reviews
                </figcaption>

                <div
                  className="mt-3 text-[12px] tracking-[0.2em] text-coral"
                  aria-label="Five out of five stars"
                >
                  ★★★★★
                </div>

                <blockquote className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-foreground/90">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                {testimonial.caseStudySlug ? (
                  <Link
                    href={`/work/${testimonial.caseStudySlug}`}
                    className="mt-4 inline-flex min-h-8 items-center gap-2 label text-[0.6rem] transition-colors hover:text-coral"
                    tabIndex={copy === 1 ? -1 : undefined}
                  >
                    Read the case study
                    <span aria-hidden="true">→</span>
                  </Link>
                ) : null}
              </figure>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
