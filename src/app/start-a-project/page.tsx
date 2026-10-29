import { PageHeader, PageSection } from '@/components/layout/page'
import { ContactForm } from '@/components/sections/contact-form'
import { Reveal } from '@/components/ui/reveal'
import { contactContent } from '@/content/site'

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

          {/* Availability */}
          <aside className="space-y-8 lg:pt-2">
            <Reveal>
              <div className="rounded-3xl border border-border bg-card/40 p-7">
                <p className="label text-brand">{contactContent.availability.badge}</p>
                <p className="mt-5 leading-relaxed text-muted-foreground">
                  {contactContent.availability.body}
                </p>
              </div>
            </Reveal>
          </aside>
        </div>
      </PageSection>
    </>
  )
}
