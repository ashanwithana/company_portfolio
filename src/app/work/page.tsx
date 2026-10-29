import { PageHeader } from '@/components/layout/page'
import { CaseStudyGrid } from '@/components/sections/case-study-grid'
import { CtaBand } from '@/components/ui/cta-band'
import { caseStudyFilters, publishedCaseStudies } from '@/content/case-studies'

export const metadata = {
  title: 'Work',
  description:
    'Selected engagements from the studio — websites, platforms, AI and enterprise systems, each named and described.',
}

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Selected work"
        title="Every project, told plainly."
        lede="The problem it started with, what we did about it, and what we can honestly say changed."
      />

      <div className="container-page pb-24 md:pb-32">
        <CaseStudyGrid studies={publishedCaseStudies()} filters={caseStudyFilters} />
      </div>

      <CtaBand
        eyebrow="Your turn"
        title="The next one on this page could be yours."
        body="Tell us what you are building and what is in the way. We will tell you whether we are the right studio for it — including when we are not."
      />
    </>
  )
}
