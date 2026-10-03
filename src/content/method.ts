import type { MethodStep } from '@/components/sections/method'

/**
 * The studio's six-phase method, shared by the home page section and the
 * dedicated /method page. One source so the two can never disagree about what
 * the phases are called or what each one hands over.
 *
 * Every phase ends with a concrete artifact — that is the "one number" idea:
 * the engagement is accountable at every step, not just at the end.
 */
export const methodSteps: readonly MethodStep[] = [
  {
    word: 'Brief',
    numeral: '01',
    label: 'Brief',
    lead: 'Most software failures are decided before the first line of code is written.',
    points: [
      'two weeks embedded: we read the code and watch the work',
      'we start with what is actually happening, not the org chart',
      'the problem written down in your words, not ours',
    ],
    endsWith: 'a written brief of what is actually wrong',
  },
  {
    word: 'Map',
    numeral: '02',
    label: 'Map',
    lead: 'A written plan with risks, sequence and a fixed number — before you commit.',
    points: [
      'architecture, data flows and dependencies in writing',
      'a fixed number after discovery, not an estimate that drifts',
      'you approve the plan, not just a mood board',
    ],
    endsWith: 'the number — fixed, in writing',
  },
  {
    word: 'Prototype',
    numeral: '03',
    label: 'Prototype',
    lead: 'Something you can click, before we build anything on top of it.',
    points: [
      'the risky part first, not the easy part',
      'real content in the prototype, never lorem ipsum',
      'sign-off on behaviour, not on static screens',
    ],
    endsWith: 'a working prototype you have used',
  },
  {
    word: 'Build',
    numeral: '04',
    label: 'Build',
    lead: 'Short cycles, each ending with something demonstrable — never a big bang.',
    points: [
      'something you can click at the end of every cycle',
      'enterprise data migrated in rehearsed phases',
      'the codebase handed over clean, not archived',
    ],
    endsWith: 'working software, every cycle',
  },
  {
    word: 'Harden',
    numeral: '05',
    label: 'Harden',
    lead: 'The unglamorous work that decides whether it survives its first year.',
    points: [
      'performance and accessibility budgets enforced in CI',
      'AI features earn production with measured accuracy',
      'load, failure and rollback paths tested before launch',
    ],
    endsWith: 'a launch checklist with nothing open on it',
  },
  {
    word: 'Hand over',
    numeral: '06',
    label: 'Hand over',
    lead: 'Docs, runbooks and paired working until your team is comfortable. Then we leave.',
    points: [
      'documentation your team will actually read',
      'training against migrated data in staging, not a PDF',
      'handover, not lock-in',
    ],
    endsWith: 'a team that does not need us',
  },
]
