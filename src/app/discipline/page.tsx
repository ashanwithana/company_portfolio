import { PageHeader } from '@/components/layout/page'
import { CtaBand } from '@/components/ui/cta-band'
import { Method } from '@/components/sections/method'
import { methodSteps } from '@/content/method'

export const metadata = {
  title: 'Method',
  description:
    'Brief, Map, Prototype, Build, Harden, Hand over — the six-phase method Northlight uses to take software from first sketch to production.',
}

/**
 * Dedicated method page: a dark header flowing straight into the six phases
 * on the dark ground, and a discovery CTA before the shared footer.
 */
export default function MethodPage() {
  return (
    <>
      <PageHeader
        ghost="Method"
        eyebrow="Method"
        title="How every engagement runs."
        className="pb-10 md:pb-14"
        lede="The shape of every engagement we run: six phases, a fixed number at the end of the second, and numbers — not adjectives — at handover."
      />

      <section aria-label="The six phases">
        <Method steps={methodSteps} showIntro={false} />
      </section>

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
