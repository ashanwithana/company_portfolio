import { CtaBand } from '@/components/ui/cta-band'
import { Hero } from '@/components/sections/hero'
import { Method, type MethodStep } from '@/components/sections/method'
import { PainPoints } from '@/components/sections/pain-points'
import { contactContent } from '@/content/site'

/**
 * Home page composition, mirroring the reference section for section:
 * globe hero with review strip, the pinned five-phase method, the
 * what's-slowing-you-down scatter, and the closing CTA. Services, work,
 * insights and company detail live on their own routes, reached through the
 * nav dropdowns and the footer — which is where the reference puts them too.
 */
const methodSteps: readonly MethodStep[] = [
  {
    word: 'Understand',
    numeral: '01',
    label: 'Understand',
    lead: '80% of software projects fail because no one asked the right question first.',
    points: [
      'we start at the uncomfortable truth, not the solution',
      'two weeks embedded: we read the code and watch the work',
      'clarity before code, always',
    ],
  },
  {
    word: 'Shape',
    numeral: '02',
    label: 'Shape',
    lead: 'A written plan with risks, sequence and a fixed number — before you commit.',
    points: [
      'approach, risks and sequence in writing',
      'fixed price after discovery, not an estimate that drifts',
      'you approve the plan, not just a mood board',
    ],
  },
  {
    word: 'Build',
    numeral: '03',
    label: 'Build',
    lead: 'Short cycles, each ending with something demonstrable — never a big bang.',
    points: [
      'something you can click at the end of every cycle',
      'performance and accessibility budgets enforced in CI',
      'enterprise data migrated in rehearsed phases',
    ],
  },
  {
    word: 'Prove',
    numeral: '04',
    label: 'Prove',
    lead: 'Code without adoption is debt with ego. We measure against the week-one baseline.',
    points: [
      'victory is your team running it without us',
      'AI features ship behind an accuracy gate, not a demo',
      'if a number did not move, we explain why',
    ],
  },
  {
    word: 'Hand over',
    numeral: '05',
    label: 'Hand over',
    lead: 'Docs, runbooks and paired working until your team is comfortable. Then we leave.',
    points: [
      'documentation your team will actually read',
      'understood without a manual, improved without permission',
      'handover, not lock-in',
    ],
  },
]

export default function HomePage() {
  return (
    <>
      <Hero />

      <section id="method" aria-label="Our method">
        <Method steps={methodSteps} />
      </section>

      <PainPoints />

      <CtaBand
        eyebrow="Start a conversation"
        title="And every business deserves to evolve."
        ghost="Evolve"
        body={`${contactContent.availability.body} ${contactContent.responseTime}`}
        actionLabel="Start a project"
        secondary={{ href: '/work', label: 'See our work' }}
      />
    </>
  )
}
