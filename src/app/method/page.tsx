import { PageHeader } from '@/components/layout/page'
import { BlockArt } from '@/components/ui/block-art'
import { CtaBand } from '@/components/ui/cta-band'
import { Method } from '@/components/sections/method'
import { methodSteps } from '@/content/method'

export const metadata = {
  title: 'Method',
  description:
    'Understand, Shape, Build, Prove, Hand over — the five-phase method Northlight uses to take software from first sketch to production.',
}

/**
 * Dedicated method page, mirroring the reference's /method: a dark header over
 * a wide visual band, the five phases as a pinned horizontal scroll on the
 * dark ground, and a diagnosis CTA before the shared footer.
 */
export default function MethodPage() {
  return (
    <>
      <PageHeader
        eyebrow="Method"
        title="The 5-phase method."
        ghost="Method"
        lede="Discover the shape of every engagement we run: five phases, a fixed number at the end of the second, and numbers — not adjectives — at handover."
      />

      {/* Wide visual band under the header, like the reference's media panel. */}
      <div className="container-page pb-16 md:pb-24">
        <BlockArt seed="northlight-method" ratio="wide" className="w-full" />
      </div>

      <section aria-label="The five phases">
        <Method steps={methodSteps} tone="dark" />
      </section>

      <CtaBand
        eyebrow="Diagnosis"
        title="Ready to start with the diagnosis?"
        ghost="Diagnose"
        body="Two weeks embedded with your team. You get the uncomfortable truth in writing, a plan with a fixed number — and the option to walk away with both."
        actionLabel="Book a diagnosis"
      />
    </>
  )
}
