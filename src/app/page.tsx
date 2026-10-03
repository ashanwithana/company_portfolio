import { Hero } from '@/components/sections/hero'
import { Method } from '@/components/sections/method'
import { WhyUs } from '@/components/sections/why-us'
import { TalkToUs, CureBand } from '@/components/sections/talk-to-us'
import { methodSteps } from '@/content/method'

/**
 * Home page composition, mirroring the reference section for section:
 * globe hero with review strip, the pinned five-phase method, the
 * what's-slowing-you-down scatter, and the closing CTA. Services, work,
 * insights and company detail live on their own routes, reached through the
 * nav dropdowns and the footer — which is where the reference puts them too.
 */
export default function HomePage() {
  return (
    <>
      <Hero />

      <section id="method" aria-label="Our method">
        <Method steps={methodSteps} />
      </section>

      <WhyUs />

      <TalkToUs />

      <CureBand />
    </>
  )
}
