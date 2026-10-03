import { PageHeader, PageSection } from '@/components/layout/page'
import { siteConfig } from '@/content/site'

export const metadata = {
  title: 'Privacy',
  description:
    'What this site collects, why, and what we do not do with it. Written to be read rather than to be legally impenetrable.',
}

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy"
        lede="Written to be read rather than to be legally impenetrable. If something here is unclear, ask and we will explain it."
      />

      <PageSection className="pt-0">
        <div className="max-w-3xl space-y-10">
          <section aria-labelledby="collect">
            <h2 id="collect" className="text-2xl">
              What this site collects
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Almost nothing. There is no analytics script, no advertising pixel, no third-party
              tracker and no session recording. We do not run cookies for behavioural purposes.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Two things are stored, both strictly functional:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 leading-relaxed text-muted-foreground">
              <li>
                <strong className="text-foreground">Theme preference.</strong> A single cookie
                recording whether you chose the light or dark theme, so the site renders correctly
                before any JavaScript runs.
              </li>
              <li>
                <strong className="text-foreground">Enquiry contents.</strong> If you submit the
                contact form, what you typed is sent to our mail provider so we can reply.
              </li>
            </ul>
          </section>

          <section aria-labelledby="thirdparties">
            <h2 id="thirdparties" className="text-2xl">
              Third parties
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Fonts are self-hosted, so reading this page does not tell anyone where you are or what
              device you use. The only external requests this site makes are to the mail provider
              when you submit a form, and to any URL you choose to follow.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              If a mail provider is configured, it becomes a processor of the data you submit. We
              will name it here once it is set.
            </p>
          </section>

          <section aria-labelledby="retention">
            <h2 id="retention" className="text-2xl">
              How long we keep it
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              The theme cookie lasts a year. Enquiries are kept for as long as needed to answer you
              and to meet tax and legal obligations, then deleted. If you ask us to delete an
              enquiry, we will, and we will confirm it in writing.
            </p>
          </section>

          <section aria-labelledby="rights">
            <h2 id="rights" className="text-2xl">
              Your rights
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              You can ask what we hold about you, ask us to correct it, or ask us to delete it.
              Write to{' '}
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-foreground underline decoration-mint/50 underline-offset-4 hover:decoration-mint"
              >
                {siteConfig.email}
              </a>{' '}
              and we will respond within 30 days.
            </p>
          </section>

          <section aria-labelledby="controller">
            <h2 id="controller" className="text-2xl">
              Who is responsible
            </h2>
            <address className="mt-4 leading-relaxed text-muted-foreground not-italic">
              {siteConfig.nameWithSuffix}
              <br />
              {siteConfig.address.street}
              <br />
              {siteConfig.address.city} {siteConfig.address.postalCode}
              <br />
              {siteConfig.address.countryName}
            </address>
            <p className="mt-4 text-sm text-muted-foreground">Last updated 1 September 2026.</p>
          </section>
        </div>
      </PageSection>
    </>
  )
}
