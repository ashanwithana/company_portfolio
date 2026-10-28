import { PageHeader, PageSection } from '@/components/layout/page'
import { PhaseSheet } from '@/components/sections/method'
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

      <PageSection>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
            02 / In detail
          </span>
          <span aria-hidden="true" className="h-px max-w-[280px] flex-1 bg-border" />
        </div>
        <h2 className="mt-6 max-w-4xl text-[clamp(2rem,4.6vw,4.25rem)] leading-[0.95] font-light tracking-tight">
          Phase by phase, <span className="font-bold">no hand-waving.</span>
        </h2>

        <div className="mt-14 flex max-w-4xl flex-col gap-4 md:mt-20 md:gap-5">
          {methodSteps.map((step, i) => (
            <Reveal key={step.numeral} delay={Math.min(i, 3) * 60}>
              <div id={`phase-${step.numeral}`} className="scroll-mt-32">
                <PhaseSheet step={step} total={methodSteps.length} detail />
              </div>
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
