import { Reveal } from '@/components/ui/reveal'
import { differentiators } from '@/content/company'

/**
 * "Three things you can hold us to."
 *
 * The homepage's accountability beat after the method: three oversized
 * editorial rows, each pairing a one-word tag with a commitment and its
 * terms. Calm where the method is mechanical — generous whitespace, hairline
 * rules, and a hover nudge are the entire interaction. Nothing here moves on
 * its own; the confidence is the point.
 */
export function WhyUs() {
  return (
    <section aria-label="Why us" className="tone-paper relative overflow-hidden py-24 md:py-32">
      <div
        className="pointer-events-none absolute inset-0 dot-grid mask-fade-radial opacity-60"
        aria-hidden="true"
      />

      <div className="relative container-page">
        <header className="relative text-center">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-[0.12em] left-1/2 -translate-x-1/2 font-display text-[clamp(9rem,54vh,32rem)] text-ghost"
          >
            Trust
          </span>

          <p className="relative text-center label-wide text-muted-foreground">
            <span aria-hidden="true">[</span> <span className="text-foreground">Why us</span>{' '}
            <span aria-hidden="true">]</span>
          </p>

          <h2 className="relative mx-auto mt-5 max-w-3xl display-lg">
            Three things you can hold us to.
          </h2>
        </header>

        <div className="mx-auto mt-14 max-w-4xl md:mt-20">
          {differentiators.map((item, i) => (
            <Reveal key={item.title} delay={i * 70}>
              <div className="group grid gap-3 border-t border-border py-10 transition-transform duration-500 ease-out last:border-b hover:translate-x-2 md:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] md:gap-8 md:py-12">
                <p className="flex items-baseline gap-4 md:flex-col md:gap-2">
                  <span className="label text-[0.6rem] text-coral tabular-nums">
                    {(i + 1).toString().padStart(2, '0')}
                  </span>
                  <span className="label text-[0.6rem] text-muted-foreground">{item.tag}</span>
                </p>

                <div>
                  <h3 className="display-md">{item.title}</h3>
                  <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
