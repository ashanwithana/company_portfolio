import { PageHeader } from '@/components/layout/page'
import { CtaBand } from '@/components/ui/cta-band'
import { Method } from '@/components/sections/method'
import { methodSteps } from '@/content/method'

export const metadata = {
  title: 'Method',
  description:
    'See, Shape, Ship, Show, Shift — the five-phase method Northlight uses to take software from first sketch to production.',
}

/**
 * Dedicated method page: a dark header flowing straight into the five phases
 * on the dark ground, and a discovery CTA before the shared footer.
 */
export default function MethodPage() {
  return (
    <>
      <PageHeader
        eyebrow="Method"
        title="How every engagement runs."
        ghost="Method"
        className="pb-10 md:pb-14"
        lede="Discover the shape of every engagement we run: five phases, a fixed number at the end of the second, and numbers — not adjectives — at handover."
      />

      <section aria-label="The five phases">
        <Method steps={methodSteps} showIntro={false} />
      </section>

      <CtaBand
        eyebrow="Discovery"
        title="Ready to see what is actually wrong?"
        ghost="Discovery"
        body="Two weeks embedded with your team. You get the truth in writing, a plan with a fixed number — and the option to walk away with both."
        actionLabel="Start a project"
      />
    </>
  )
}
