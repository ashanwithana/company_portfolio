import Link from 'next/link'

import { Eyebrow } from '@/components/ui/badge'
import { siteConfig } from '@/content/site'

/**
 * Closing beat: a left-aligned eyebrow over a giant two-line title with
 * the last word in pink. No buttons — the actions live in the talk-to-us
 * cards above and the footer below.
 */
export function CureBand() {
  return (
    <section aria-label="The point" className="relative overflow-hidden pt-8 pb-24 md:pb-32">
      <div
        className="pointer-events-none absolute inset-0 dot-grid mask-fade-radial opacity-60"
        aria-hidden="true"
      />

      <div className="relative container-page">
        <Eyebrow soft className="justify-start">
          The point
        </Eyebrow>

        <h2 className="mt-7 display-xl">
          Bring us the problem.
          <br />
          We&apos;ll bring the <span className="text-brand">method.</span>
        </h2>
      </div>
    </section>
  )
}
/**
 * "Talk to us" contact cards on the home page, mirroring the reference: a
 * left-aligned eyebrow over two cards — email on the left, the project route
 * on the right. Each card carries a circled icon, a bold title, the address
 * lines and a rightward arrow.
 */
export function TalkToUs() {
  return (
    <section aria-label="Talk to us" className="relative overflow-hidden py-24 md:py-32">
      <div
        className="pointer-events-none absolute inset-0 dot-grid mask-fade-radial opacity-60"
        aria-hidden="true"
      />

      <div className="relative container-page">
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
            href="/contact"
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
    </section>
  )
}
