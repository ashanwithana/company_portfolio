import { Hero } from '@/components/sections/hero'
import { Manifesto } from '@/components/sections/manifesto'
import { siteConfig } from '@/content/site'
import { Method } from '@/components/sections/method'
import { ServicesSnapshot } from '@/components/sections/services-snapshot'
import { TalkToUs, CureBand } from '@/components/sections/talk-to-us'
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

      <Manifesto text={`${siteConfig.tagline} ${methodSteps[0]?.lead ?? ''}`.trim()} />

      <section id="discipline" aria-label="Our discipline">
        <Method steps={methodSteps} />
      </section>

      <ServicesSnapshot />

      <TalkToUs />

      <CureBand />
    </>
  )
}
