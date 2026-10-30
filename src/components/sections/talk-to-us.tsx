import Link from 'next/link'

import { Manifesto } from '@/components/sections/manifesto'
import { StudioStats } from '@/components/sections/studio-stats'
import { Eyebrow } from '@/components/ui/badge'
import { siteConfig } from '@/content/site'

/**
 * Closing beat, set exactly like the home Manifesto: the pinned stage with
 * outlined thin uppercase lines that fill in as you scroll, the last word
 * bold, a numbered label with a filling rule, and the faint page rails. It
 * reuses that component rather than copying its styles, so the two cannot
 * drift apart. A shorter track than the opening manifesto, since it is two
 * lines, followed by the studio's four figures. No buttons: the "Talk to us" cards are in the footer just below.
 */
export function CureBand() {
  return (
    <Manifesto
      id="the-point"
      ariaLabel="The point"
      label="05 / The point"
      trackClassName="h-[180vh]"
      lines={[
        { text: 'Bring us the problem.', strongWords: 0 },
        { text: "We'll bring the breakthrough.", strongWords: 1 },
      ]}
    >
      <StudioStats embedded className="mt-10 md:mt-16" />
    </Manifesto>
  )
}

/**
 * "Talk to us" contact cards: a left-aligned eyebrow over two cards, email on
 * the left and the project route on the right. Each card carries a circled
 * icon, a bold title, the address lines and a rightward arrow.
 *
 * Renders only its content; the footer supplies the surrounding section, so
 * the cards sit on the footer's silk field rather than on a ground of their own.
 */
export function TalkToUs() {
  return (
    <div className="relative container-page w-full">
      <Eyebrow soft className="justify-start">
        Talk to us
      </Eyebrow>

      <div className="mt-10 grid gap-px border border-border-strong bg-border-strong md:grid-cols-2">
        <a
          href={`mailto:${siteConfig.email}`}
          className="group flex items-center gap-5 bg-background p-6 transition-colors duration-300 hover:bg-foreground hover:text-background focus-visible:bg-foreground focus-visible:text-background sm:p-8"
        >
          <span className="min-w-0 flex-1">
            <span className="block font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase group-hover:text-background/60">
              Email us
            </span>
            <span className="mt-3 block text-xl font-light tracking-tight break-all md:text-2xl">
              {siteConfig.email}
            </span>
          </span>

          <span
            aria-hidden="true"
            className="shrink-0 text-3xl font-thin transition-transform duration-300 group-hover:translate-x-1.5"
          >
            →
          </span>
        </a>

        <Link
          href="/start-a-project"
          className="group flex items-center gap-5 bg-background p-6 transition-colors duration-300 hover:bg-foreground hover:text-background focus-visible:bg-foreground focus-visible:text-background sm:p-8"
        >
          <span className="min-w-0 flex-1">
            <span className="block font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase group-hover:text-background/60">
              Start a project
            </span>
            <span className="mt-3 block text-xl font-light tracking-tight md:text-2xl">
              Tell us what you are building
            </span>
          </span>

          <span
            aria-hidden="true"
            className="shrink-0 text-3xl font-thin transition-transform duration-300 group-hover:translate-x-1.5"
          >
            →
          </span>
        </Link>
      </div>
    </div>
  )
}
