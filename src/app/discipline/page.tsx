import { PageHeader, PageSection } from '@/components/layout/page'
import { CtaBand } from '@/components/ui/cta-band'
import { Reveal } from '@/components/ui/reveal'
import { methodSteps } from '@/content/method'

export const metadata = {
  title: 'Discipline',
  description:
    'Observe, Reason, Imagine, Craft, Temper, Release — the six-phase discipline Northlight uses to take software from first sketch to production.',
}

/**
 * Dedicated discipline page: a dark header flowing straight into the long
 * telling — every phase unpacked with what actually happens inside it. The
 * sliding journey lives only on the home page, so the two never duplicate
 * each other's styles or effects.
 */
export default function MethodPage() {
  return (
    <>
      <PageHeader
        ghost="Discipline"
        eyebrow="Discipline"
        title="How every engagement runs."
        className="pb-10 md:pb-14"
        lede="The shape of every engagement we run: six phases, a fixed number at the end of the second, and numbers — not adjectives — at handover."
      />

      <PageSection tone="muted" dotGrid>
        <p className="label-wide text-muted-foreground">
          <span aria-hidden="true">[</span> <span className="text-foreground">In detail</span>{' '}
          <span aria-hidden="true">]</span>
        </p>
        <h2 className="mt-5 max-w-3xl display-md">Phase by phase, no hand-waving.</h2>

        <div className="mt-14 md:mt-20">
          {methodSteps.map((step, i) => (
            <Reveal key={step.numeral} delay={Math.min(i, 3) * 60}>
              <article
                id={`phase-${step.numeral}`}
                aria-label={`Phase ${step.numeral}: ${step.word}`}
                className="grid scroll-mt-32 gap-4 border-t border-border py-10 last:border-b md:grid-cols-[minmax(0,9rem)_minmax(0,1fr)] md:gap-10 md:py-12"
              >
                <p className="label text-brand tabular-nums">
                  {step.numeral} / {String(methodSteps.length).padStart(2, '0')}
                </p>
                <div>
                  <h3 className="display-sm">{step.word}</h3>
                  <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-foreground/90">
                    {step.lead}
                  </p>
                  <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
                    {step.detail}
                  </p>
                  <ul className="mt-6 flex max-w-2xl flex-wrap gap-2">
                    {step.points.map((point) => (
                      <li
                        key={point}
                        className="rounded-full border border-border px-3.5 py-1.5 font-mono text-[11px] tracking-wide text-muted-foreground"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 flex max-w-2xl items-baseline gap-3 text-[13px]">
                    <span className="shrink-0 label text-[0.6rem] text-brand">Ends with</span>
                    <span className="text-foreground">{step.endsWith}</span>
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </PageSection>

      <CtaBand
        ghost="Discovery"
        eyebrow="Discovery"
        title="Ready to see what is actually wrong?"
        body="Two weeks embedded with your team. You get the truth in writing, a plan with a fixed number — and the option to walk away with both."
        actionLabel="Start a project"
      />
    </>
  )
}
