import { PageHeader, PageSection } from '@/components/layout/page'

export const metadata = {
  title: 'Accessibility',
  description:
    'Our accessibility statement — the standard we hold this site to, what we have tested, and how to report a barrier.',
}

const checks = [
  {
    label: 'Target',
    value: 'WCAG 2.2 Level AA',
    detail: 'The standard we design and build to, and the one we test against.',
  },
  {
    label: 'Keyboard',
    value: 'Fully operable',
    detail:
      'Every interactive element is reachable and usable by keyboard, with a visible focus indicator at every step.',
  },
  {
    label: 'Colour contrast',
    value: 'AA or better',
    detail:
      'All text and meaningful interface components meet or exceed the minimum contrast ratios in both themes.',
  },
  {
    label: 'Motion',
    value: 'Respected',
    detail:
      'Animations, the typewriter, marquees and the WebGL hero all stop when your system requests reduced motion.',
  },
  {
    label: 'Structure',
    value: 'Semantic landmarks',
    detail:
      'Landmarks, a skip link, one h1 per page and a logical heading order, so assistive technology can navigate rather than guess.',
  },
  {
    label: 'Forms',
    value: 'Labelled and announced',
    detail:
      'Every field has a real label, errors are tied to their input and announced through a live region.',
  },
] as const

export default function AccessibilityPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Accessibility"
        lede="An inaccessible product is a broken product, so this is a standard we hold our own work to rather than a policy we wrote afterwards."
      />

      <PageSection className="pt-0">
        <dl className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {checks.map((check) => (
            <div key={check.label} className="bg-background p-7">
              <dt className="label text-[0.55rem] text-brand">{check.label}</dt>
              <dd className="mt-3">
                <p className="text-xl leading-snug">{check.value}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{check.detail}</p>
              </dd>
            </div>
          ))}
        </dl>
      </PageSection>

      <PageSection tone="muted">
        <div className="max-w-3xl space-y-8">
          <section aria-labelledby="known">
            <h2 id="known" className="text-2xl">
              What we have not tested
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              We test with keyboard navigation, screen readers and automated tooling, but we have
              not completed a formal audit with manual assistive-technology testing by disabled
              users. That is a real gap and we would rather state it than imply otherwise.
            </p>
          </section>

          <section aria-labelledby="report">
            <h2 id="report" className="text-2xl">
              Found a barrier?
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Please tell us, including what you were trying to do and which browser and assistive
              technology you were using. We will treat a report as a bug and prioritise it
              accordingly — usually the same day.
            </p>
            <a
              href="mailto:hello@northlight.example.com?subject=Accessibility%20barrier"
              className="mt-6 inline-flex h-12 items-center justify-center gap-2 border border-border-strong px-6 label transition-colors hover:border-border-strong"
            >
              Report a barrier
              <span aria-hidden="true" className="ml-2">
                →
              </span>
            </a>
          </section>
        </div>
      </PageSection>
    </>
  )
}
