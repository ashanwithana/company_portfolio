import Link from 'next/link'

import { PageHeader } from '@/components/layout/page'
import { FaqSchema } from '@/components/seo/faq-schema'
import { FaqSection } from '@/components/ui/faq'
import { contactFaqs } from '@/content/faqs'

export const metadata = {
  title: 'FAQ',
  description:
    'Reach the studio directly, or read the answers to the questions every engagement starts with.',
}

export default function ContactPage() {
  return (
    <>
      {/* Keeps the structured data in lockstep with the visible questions. */}
      <FaqSchema items={contactFaqs} />

      <PageHeader
        eyebrow="FAQ"
        title="Questions, answered."
        lede="Starting a project instead? That lives on its own page."
      />

      <FaqSection
        eyebrow="Before you write"
        title="The questions we are asked most."
        items={contactFaqs}
      >
        <p className="leading-relaxed text-muted-foreground">
          Answered honestly rather than optimistically.
        </p>
        <p className="mt-6">
          <Link
            href="/start-a-project"
            className="inline-flex min-h-11 items-center gap-2 label transition-colors hover:text-brand"
          >
            Start a project
            <span aria-hidden="true">→</span>
          </Link>
        </p>
      </FaqSection>
    </>
  )
}
