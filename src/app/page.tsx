import { Hero } from '@/components/sections/hero'
import { Manifesto } from '@/components/sections/manifesto'
import { Method } from '@/components/sections/method'
import { ServicesSnapshot } from '@/components/sections/services-snapshot'
import { CureBand } from '@/components/sections/talk-to-us'
import { methodSteps } from '@/content/method'

/**
 * Home page composition, mirroring the reference section for section:
 * globe hero, the six-phase discipline,
 * what's-slowing-you-down scatter, and the closing CTA. Services, work,
 * insights and company detail live on their own routes, reached through the
 * nav dropdowns and the footer — which is where the reference puts them too.
 */
export default function HomePage() {
  return (
    <>
      <Hero />

      <Manifesto
        label="02 / Manifesto"
        keywords={methodSteps.map((step) => step.label)}
        lines={[
          { text: 'Ambition begins', strongWords: 0 },
          { text: 'as a sketch.', strongWords: 2 },
          { text: 'We draw it, prove it, then build it', strongWords: 0 },
          { text: 'to carry real weight.', strongWords: 2 },
        ]}
      />

      <section id="discipline" aria-label="Our discipline">
        <Method steps={methodSteps} />
      </section>

      <ServicesSnapshot />

      <CureBand />
    </>
  )
}
