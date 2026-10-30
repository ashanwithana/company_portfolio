import { PageSection } from '@/components/layout/page'
import { PageHero } from '@/components/sections/page-hero'
import { PhaseStack } from '@/components/sections/phase-stack'
import { CtaBand } from '@/components/ui/cta-band'
import { methodSteps } from '@/content/method'
import { siteConfig } from '@/content/site'

export const metadata = {
  title: 'Discipline',
  description: `Immerse, Architect, Envision, Engineer, Assure, Transfer — the six-phase discipline ${siteConfig.name} applies to take software from first sketch to production.`,
}

/**
 * Dedicated discipline page: a left-aligned hero with a linked phase index,
 * then every phase as a card in a sticky stack. The sideways journey lives only
 * on the home page, so the two present the same six phases in different forms.
 */
export default function MethodPage() {
  return (
    <>
      <PageHero
        label="01 / Discipline"
        title={'Six phases.\nOne standard.'}
        lede="Every engagement follows the same six phases: a committed price agreed at the close of the second, and measured results, not adjectives, at handover."
        itemsLabel="The six phases"
        items={methodSteps.map((step) => ({
          index: step.numeral,
          label: step.label,
          href: `#phase-${step.numeral}`,
        }))}
      />

      <PageSection className="pt-8 md:pt-12">
        <div id="phases" className="scroll-mt-24">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
              02 / In full
            </span>
            <span aria-hidden="true" className="h-px max-w-[280px] flex-1 bg-border" />
          </div>
          <h2 className="mt-6 max-w-4xl text-[clamp(2rem,4.6vw,4.25rem)] leading-[0.95] font-light tracking-tight">
            Each phase, <span className="font-bold">in full.</span>
          </h2>
        </div>

        <div className="mt-14 md:mt-20">
          <PhaseStack steps={methodSteps} />
        </div>
      </PageSection>

      <CtaBand
        eyebrow="Discovery"
        title="Begin with a clear diagnosis."
        body="Two weeks embedded with your team. You receive the findings in writing and a plan with a committed price, and the freedom to take both elsewhere."
        actionLabel="Start a project"
      />
    </>
  )
}
