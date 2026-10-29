import type { MethodStep } from '@/components/sections/method'

/**
 * The studio's six-phase discipline, shared by the home page section and the
 * dedicated /discipline page. One source so the two can never disagree about what
 * the phases are called or what each one hands over.
 *
 * Every phase ends with a concrete artifact — that is the "one number" idea:
 * the engagement is accountable at every step, not just at the end.
 */
export const methodSteps: readonly MethodStep[] = [
  {
    word: 'Immerse',
    numeral: '01',
    label: 'Immerse',
    lead: 'Every outcome is decided long before the first line of code is written.',
    points: [
      'two weeks embedded in your team and your codebase',
      'we study the work as it is, not as the org chart describes it',
      'the problem set out in your language, not ours',
    ],
    endsWith: 'a written diagnosis of what is actually wrong',
    detail:
      'Two weeks inside your team: studying the codebase, observing the people who rely on the software, and speaking with those who fund it. The result is a diagnosis in your own language — the real problem, who it affects, and what success looks like — so every decision that follows is anchored in fact rather than assumption.',
  },
  {
    word: 'Architect',
    numeral: '02',
    label: 'Architect',
    lead: 'A written plan covering risk, sequence and a committed price, agreed before any build begins.',
    points: [
      'architecture, data flows and dependencies documented',
      'a committed price after discovery, not an estimate that drifts',
      'you approve the plan itself, not a mood board',
    ],
    endsWith: 'a committed price, in writing',
    detail:
      'The diagnosis becomes architecture: data flows, dependencies, the principal unknowns named alongside their mitigations, and the order of work. A committed price is then attached to that scope. You approve a plan you could hand to any other studio, which is precisely why the price holds.',
  },
  {
    word: 'Envision',
    numeral: '03',
    label: 'Envision',
    lead: 'A working prototype in your hands, before anything is built on top of it.',
    points: [
      'the riskiest flow first, not the easiest',
      'your real content throughout, never placeholder text',
      'approval on behaviour, not on static screens',
    ],
    endsWith: 'a working prototype you have used',
    detail:
      'We prototype the flow carrying the most uncertainty first, populated with your real content and connected to the systems it will rely on. You experience the behaviour that could define the project while a change of direction still costs days rather than sprints, and you approve how it behaves, not how a screenshot looks.',
  },
  {
    word: 'Engineer',
    numeral: '04',
    label: 'Engineer',
    lead: 'Short, disciplined cycles, each concluding with something demonstrable. Never a single big reveal.',
    points: [
      'working software at the close of every cycle',
      'enterprise data migrated in rehearsed stages',
      'a codebase handed over clean, not archived',
    ],
    endsWith: 'working software, every cycle',
    detail:
      'Delivery runs in short cycles against a staging environment that mirrors production, each ending with something you can use rather than a progress report. Enterprise data migrates in rehearsed stages with a rollback for every step, and the codebase remains orderly throughout: plain file structures, explicit data flow, and documentation written for the next engineer.',
  },
  {
    word: 'Assure',
    numeral: '05',
    label: 'Assure',
    lead: 'The rigorous, unseen work that decides whether it endures beyond its first year.',
    points: [
      'performance and accessibility budgets enforced in CI',
      'AI features earn production with measured accuracy',
      'load, failure and rollback paths tested before launch',
    ],
    endsWith: 'a launch checklist with nothing outstanding',
    detail:
      'Before launch, everything is measured against the baseline captured in week one: Core Web Vitals on real devices, keyboard and screen-reader testing, load and failure drills, and rehearsed rollbacks. AI features ship only with measured accuracy and a path to human escalation for low-confidence answers. Nothing launches with an item outstanding.',
  },
  {
    word: 'Transfer',
    numeral: '06',
    label: 'Transfer',
    lead: 'Documentation, runbooks and paired working until your team is fully self-sufficient. Then we step away.',
    points: [
      'documentation your team will genuinely read',
      'training on migrated staging data, not a PDF',
      'a clean handover, never lock-in',
    ],
    endsWith: 'a team that no longer needs us',
    detail:
      'Transfer is a handover, not a ceremony: runbooks for everything that could wake someone at 3am, paired sessions until your team has shipped without us watching, and training against the migrated staging data they will operate. Then we step away. The engagement is complete only when you no longer need us.',
  },
]
