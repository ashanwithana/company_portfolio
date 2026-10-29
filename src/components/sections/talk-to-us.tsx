import Link from 'next/link'

import { Manifesto } from '@/components/sections/manifesto'
import { Eyebrow } from '@/components/ui/badge'
import { siteConfig } from '@/content/site'

/**
 * Closing beat, set exactly like the home Manifesto: the pinned stage with
 * outlined thin uppercase lines that fill in as you scroll, the last word
 * bold, a numbered label with a filling rule, and the faint page rails. It
 * reuses that component rather than copying its styles, so the two cannot
 * drift apart. A shorter track than the opening manifesto, since it is two
 * lines. No buttons: the "Talk to us" cards are in the footer just below.
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
    />
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

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <a
          href={`mailto:${siteConfig.email}`}
          className="group flex items-center gap-5 rounded-[22px] border border-border bg-card/40 p-6 transition-colors duration-300 hover:border-border-strong sm:p-8"
        >
          <span
            aria-hidden="true"
            className="flex size-14 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </span>

          <span className="min-w-0 flex-1">
            <span className="block font-display text-xl font-bold tracking-tight text-foreground">
              email
            </span>
            <span className="mt-1 block text-sm break-all text-muted-foreground">
              email us · {siteConfig.email}
            </span>
          </span>

          <span
            aria-hidden="true"
            className="shrink-0 text-xl text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand"
          >
            →
          </span>
        </a>

        <Link
          href="/start-a-project"
          className="group flex items-center gap-5 rounded-[22px] border border-border bg-card/40 p-6 transition-colors duration-300 hover:border-border-strong sm:p-8"
        >
          <span
            aria-hidden="true"
            className="flex size-14 shrink-0 items-center justify-center rounded-full border border-border font-display text-xl font-bold text-muted-foreground"
          >
            →
          </span>

          <span className="min-w-0 flex-1">
            <span className="block font-display text-xl font-bold tracking-tight text-foreground">
              start a project
            </span>
            <span className="mt-1 block text-sm text-muted-foreground">
              tell us what you are building
            </span>
          </span>

          <span
            aria-hidden="true"
            className="shrink-0 text-xl text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand"
          >
            →
          </span>
        </Link>
      </div>
    </div>
  )
}
