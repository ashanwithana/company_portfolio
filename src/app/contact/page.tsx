import { PageHeader, PageSection } from '@/components/layout/page'
import { ContactForm } from '@/components/sections/contact-form'
import { StatusBadge } from '@/components/ui/badge'
import { Reveal } from '@/components/ui/reveal'
import { contactFaqs } from '@/content/faqs'
import { siteConfig } from '@/content/site'

export const metadata = {
  title: 'Contact',
  description:
    'Start a project with Northlight. Tell us what you are building and what is in the way — we reply within two working days.',
}

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Tell us what you are building."
        lede="The more specific you are about the problem, the more useful our first reply will be. We will tell you honestly whether we are the right studio for it."
      />

      <PageSection className="pt-0">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-20">
          {/* Form */}
          <ContactForm />

          {/* Direct details */}
          <aside className="space-y-8 lg:pt-2">
            <Reveal>
              <div className="rounded-2xl border border-border bg-card/40 p-7 backdrop-blur-sm">
                <StatusBadge tone="mint">
                  {siteConfig.contactContent.availability.badge}
                </StatusBadge>
                <p className="mt-5 leading-relaxed text-muted-foreground">
                  {siteConfig.contactContent.availability.body}
                </p>
              </div>
            </Reveal>

            <Reveal delay={60}>
              <div className="rounded-2xl border border-border bg-card/40 p-7 backdrop-blur-sm">
                <h2 className="font-mono text-[0.65rem] tracking-[0.3em] text-muted-foreground uppercase">
                  {siteConfig.contactContent.directLabel}
                </h2>

                <a
                  href={`mailto:${siteConfig.email}`}
                  className="mt-4 flex items-start gap-3 break-all text-lg transition-colors hover:text-coral"
                >
                  <MailIcon />
                  {siteConfig.email}
                </a>

                <p className="mt-4 font-mono text-[0.65rem] tracking-[0.15em] text-muted-foreground uppercase">
                  {siteConfig.contactContent.responseTime}
                </p>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="rounded-2xl border border-border bg-card/40 p-7 backdrop-blur-sm">
                <h2 className="font-mono text-[0.65rem] tracking-[0.3em] text-muted-foreground uppercase">
                  Studio
                </h2>
                <address className="mt-4 text-sm leading-relaxed text-muted-foreground not-italic">
                  {siteConfig.address.street}
                  <br />
                  {siteConfig.address.city} {siteConfig.address.postalCode}
                  <br />
                  {siteConfig.address.countryName}
                </address>
              </div>
            </Reveal>
          </aside>
        </div>
      </PageSection>

      {/* FAQs — rendered as real details/summary for no-JS support. */}
      <PageSection tone="muted">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-20">
          <div>
            <h2 className="font-mono text-[0.7rem] tracking-[0.3em] text-muted-foreground uppercase">
              Before you write
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              The questions we are asked most often, answered honestly rather than optimistically.
            </p>
          </div>

          <div className="divide-y divide-border border-y border-border">
            {contactFaqs.map((faq, index) => (
              <Reveal key={faq.question} as="div" delay={index * 40} y={12}>
                <details className="group py-6">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-lg transition-colors hover:text-mint">
                    {faq.question}
                    <span
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-muted-foreground transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </PageSection>
    </>
  )
}

function MailIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-1 shrink-0"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  )
}
