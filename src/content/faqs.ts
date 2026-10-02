export type FAQItem = {
  question: string
  answer: string
}

export const contactFaqs: readonly FAQItem[] = [
  {
    question: 'How much does a typical engagement cost?',
    answer:
      'Most engagements run between £60,000 and £250,000 depending on scope and duration. We give you a fixed number after a two-week discovery phase, rather than an estimate that drifts. If your budget is materially below what the work requires, we will tell you and suggest a smaller useful first step.',
  },
  {
    question: 'How quickly can you start?',
    answer:
      'We are currently booking for the following quarter. Discovery usually starts within two to three weeks of signing, and a first demonstrable increment lands four to six weeks after that.',
  },
  {
    question: 'Do you work with existing teams?',
    answer:
      'Most of our engagements are with in-house teams rather than in place of them. We prefer pairing and handover over pure outsourcing — the work should not stop when we leave.',
  },
  {
    question: 'What happens at the end of a project?',
    answer:
      'You get the code, the documentation, the runbooks and paired working until your team is comfortable. We do not hold anything back, and we do not offer ongoing support as a condition of the handover.',
  },
  {
    question: 'Can you work with our existing vendor or contractor?',
    answer:
      'Yes. We regularly work alongside agencies and independent specialists. We are happy to be one part of a delivery team rather than insisting on owning it.',
  },
  {
    question: 'Do you take on equity instead of fees?',
    answer:
      'Occasionally, for early-stage companies with no funding and a genuinely strong team, but rarely. Fees keep the advice honest — we would rather be able to tell you something is wrong.',
  },
] as const
