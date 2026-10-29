import { Hero } from '@/components/sections/hero'
import { Manifesto, type ManifestoLine } from '@/components/sections/manifesto'
import { siteConfig } from '@/content/site'
import { Method } from '@/components/sections/method'
import { ServicesSnapshot } from '@/components/sections/services-snapshot'
import { CureBand } from '@/components/sections/talk-to-us'
import { methodSteps } from '@/content/method'

/**
 * Breaks a sentence into display lines of the given word counts, so the
 * manifesto is built from the existing copy rather than a second hand-typed
 * version that could drift from it.
 */
function toLines(text: string, perLine: readonly number[], strongOnLast = 0): ManifestoLine[] {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: ManifestoLine[] = []
  let at = 0
  perLine.forEach((count, index) => {
    const chunk = words.slice(at, at + count)
    at += count
    if (chunk.length > 0) {
      lines.push({
        text: chunk.join(' '),
        strongWords: index === perLine.length - 1 ? strongOnLast : 0,
      })
    }
  })
  return lines
}

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
          ...toLines(siteConfig.tagline, [5, 4], 2),
          ...toLines(methodSteps[0]?.lead ?? '', [6, 7], 0),
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
