import type { MethodStep } from '@/components/sections/method'

/**
 * The studio's five-phase method, shared by the home page section and the
 * dedicated /method page. One source so the two can never disagree about
 * what the phases are called or what each one hands over.
 *
 * Every phase ends with a concrete artifact — that is the "one number" idea:
 * the engagement is accountable at every step, not just at the end.
 */
export const methodSteps: readonly MethodStep[] = [
  {
    word: 'Understand',
    numeral: '01',
    label: 'Understand',
    lead: 'Most software failures are decided before the first line of code is written.',
    points: [
      'we start with what is actually happening, not the org chart',
      'two weeks embedded: we read the code and watch the work',
      'understand first, build second, always',
    ],
    endsWith: 'a written brief of what is actually wrong',
  },
  {
    word: 'Shape',
    numeral: '02',
    label: 'Shape',
    lead: 'A written plan with risks, sequence and a fixed number — before you commit.',
    points: [
      'approach, risks and sequence in writing',
      'a fixed number after discovery, not an estimate that drifts',
      'you approve the plan, not just a mood board',
    ],
    endsWith: 'the number — fixed, in writing',
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
    endsWith: 'working software, every cycle',
  },
  {
    word: 'Prove',
    numeral: '04',
    label: 'Prove',
    lead: 'Shipped is not the same as used. We measure against the week-one baseline.',
    points: [
      'done means your team runs it without calling us',
      'AI features earn production with measured accuracy',
      'if a number did not move, we explain why',
    ],
    endsWith: 'numbers against the baseline, or an explanation',
  },
  {
    word: 'Hand over',
    numeral: '05',
    label: 'Hand over',
    lead: 'Docs, runbooks and paired working until your team is comfortable. Then we leave.',
    points: [
      'documentation your team will actually read',
      'clear enough to run, open enough to improve',
      'handover, not lock-in',
    ],
    endsWith: 'a team that does not need us',
  },
]
