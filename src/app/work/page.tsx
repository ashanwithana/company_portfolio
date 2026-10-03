import { PageHeader } from '@/components/layout/page'
import { CaseStudyGrid } from '@/components/sections/case-study-grid'
import { CtaBand } from '@/components/ui/cta-band'
import { caseStudyFilters, publishedCaseStudies } from '@/content/case-studies'

export const metadata = {
  title: 'Work',
  description:
    'Selected engagements from Northlight — platform rebuilds, product design, design systems and AI integration, each with the measured outcome.',
}

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Selected work"
        ghost="Work"
        title="Every engagement listed here comes with the numbers."
        lede="We capture a baseline in week one and report against it at the end. If a metric did not move, the case study says so and explains why."
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
