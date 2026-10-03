import { PageHeader, PageSection } from '@/components/layout/page'
import { ContactForm } from '@/components/sections/contact-form'
import { FaqSchema } from '@/components/seo/faq-schema'
import { StatusBadge } from '@/components/ui/badge'
import { Reveal } from '@/components/ui/reveal'
import { FaqSection } from '@/components/ui/faq'
import { contactFaqs } from '@/content/faqs'
import { contactContent, siteConfig } from '@/content/site'

export const metadata = {
  title: 'Contact',
  description:
    'Start a project with Northlight. Tell us what you are building and what is in the way — we reply within two working days.',
}

export default function ContactPage() {
  return (
    <>
      {/* Keeps the structured data in lockstep with the visible questions. */}
      <FaqSchema items={contactFaqs} />

      <PageHeader
        ghost="Contact"
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
              <div className="rounded-3xl border border-border bg-card/40 p-7">
                <StatusBadge tone="amber">{contactContent.availability.badge}</StatusBadge>
                <p className="mt-5 leading-relaxed text-muted-foreground">
                  {contactContent.availability.body}
                </p>
              </div>
            </Reveal>

            <Reveal delay={60}>
              <div className="rounded-3xl border border-border bg-card/40 p-7">
                <h2 className="label text-muted-foreground">{contactContent.directLabel}</h2>

                <a
                  href={`mailto:${siteConfig.email}`}
                  className="mt-4 flex items-start gap-3 text-lg break-all transition-colors hover:text-brand"
                >
                  <MailIcon />
                  {siteConfig.email}
                </a>

                <p className="mt-4 label text-muted-foreground uppercase">
                  {contactContent.responseTime}
                </p>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="rounded-3xl border border-border bg-card/40 p-7">
                <h2 className="label text-muted-foreground">Studio</h2>
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

      <FaqSection
        eyebrow="Before you write"
        title="The questions we are asked most."
        items={contactFaqs}
      >
        <p className="leading-relaxed text-muted-foreground">
          Answered honestly rather than optimistically.
        </p>
      </FaqSection>
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
