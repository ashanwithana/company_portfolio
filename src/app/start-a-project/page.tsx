import { PageHeader, PageSection } from '@/components/layout/page'
import { ContactForm } from '@/components/sections/contact-form'
import { Reveal } from '@/components/ui/reveal'
import { contactContent, siteConfig } from '@/content/site'

export const metadata = {
  title: 'Start a project',
  description:
    'Tell us what you are building and what is in the way — budget, timeline and all. We reply within two working days.',
}

export default function StartAProjectPage() {
  return (
    <>
      <PageHeader
        eyebrow="Start a project"
        title="Tell us what you are building."
        lede="The more specific you are about the problem, the more useful our first reply will be. We will tell you honestly whether we are the right studio for it."
      />

      <PageSection className="pt-0">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-20">
          {/* Form */}
          <ContactForm />

          {/* Sidebar */}
          <aside className="space-y-8 lg:pt-2">
            {/* Availability */}
            <Reveal>
              <div className="border border-border bg-card/40 p-7">
                <p className="label text-brand">{contactContent.availability.badge}</p>
                <p className="mt-5 leading-relaxed text-muted-foreground">
                  {contactContent.availability.body}
                </p>
              </div>
            </Reveal>

            {/* Direct Contact */}
            <Reveal>
              <div className="border border-border bg-card/40 p-7">
                <p className="label text-brand">Direct contact</p>
                <div className="mt-5 space-y-3 text-sm">
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="block text-foreground hover:text-brand transition-colors"
                  >
                    Email: {siteConfig.email}
                  </a>
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="block text-foreground hover:text-brand transition-colors"
                  >
                    Phone: {siteConfig.phone}
                  </a>
                  <a
                    href={`https://wa.me/${siteConfig.phone.replace(/\D/g, '')}?text=Hi%2C%20I%27m%20interested%20in%20discussing%20a%20project`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-foreground hover:text-brand transition-colors"
                  >
                    WhatsApp: {siteConfig.phone}
                  </a>
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </PageSection>
    </>
  )
}
