/**
 * FAQ content.
 *
 * Keyed by page so each page can render only the questions that are actually
 * relevant to it, and emit matching FAQPage structured data.
 */

export type Faq = {
  question: string
  answer: string
}

export const contactFaqs: readonly Faq[] = [
  {
    question: 'How much does a typical engagement cost?',
    answer:
      'Most engagements run between £60,000 and £250,000 depending on scope and duration. Enterprise implementations with data migration sit at the higher end. You get a fixed number after discovery rather than an estimate that drifts — and if your budget is materially below what the work requires, we will tell you and suggest a smaller useful first step.',
  },
  {
    question: 'Do you work on Odoo, Dynamics 365 or SAP Business One?',
    answer:
      'All three, plus Salesforce, HubSpot, Shopify and WooCommerce. We are an accredited Odoo partner and hold certifications in Dynamics 365 and Salesforce. We are candid when one of those is the wrong choice for your situation.',
  },
  {
    question: 'Can you help with AI and RAG systems?',
    answer:
      'Yes. We build retrieval-augmented generation pipelines, tool-calling workflows and agentic systems. The evaluation harness ships before the feature does, so you have a measurable accuracy number rather than a promising demo.',
  },
  {
    question: 'How quickly can you start?',
    answer:
      'We are currently booking for the following quarter. Discovery usually starts within two to three weeks of signing, and a first demonstrable increment lands four to six weeks after that.',
  },
  {
    question: 'Do you work with existing in-house teams?',
    answer:
      'Most of our engagements are with in-house teams rather than in place of them. We prefer pairing and handover over pure outsourcing — the work should not stop when we leave.',
  },
  {
    question: 'How do you handle data migration?',
    answer:
      'It is usually the hardest part of an enterprise project, so we start with it. We audit and map the existing data before configuring anything, then rehearse every migration phase in staging with a tested rollback before it touches production.',
  },
  {
    question: 'What happens at the end of a project?',
    answer:
      'You get the code, the documentation, the runbooks and paired working until your team is comfortable. We do not hold anything back, and we do not sell ongoing support as a condition of the handover.',
  },
  {
    question: 'Can you work alongside our existing vendor or contractor?',
    answer:
      'Yes. We regularly work alongside agencies and independent specialists. We are happy to be one part of a delivery team rather than insisting on owning it.',
  },
  {
    question: 'Do you take on equity instead of fees?',
    answer:
      'Occasionally, for early-stage companies with no funding and a genuinely strong team, but rarely. Fees keep the advice honest — we would rather be able to tell you something is wrong.',
  },
]

export const servicesFaqs: readonly Faq[] = [
  {
    question: 'Do you implement enterprise systems or just advise on them?',
    answer:
      'Both, but implementation is most of what we do. Advice without implementation tends to produce a document nobody acts on. We are Odoo partners and certified in Dynamics 365, Salesforce and SAP Business One, and we implement all of them.',
  },
  {
    question: 'Will you tell us not to buy something?',
    answer:
      'Regularly. A full ERP replacement is usually the wrong answer to a problem that a targeted integration solves for a tenth of the cost, and we would rather say so before you sign than after.',
  },
  {
    question: 'How do you price enterprise work?',
    answer:
      'Fixed price after a two-week discovery. The discovery itself is the phase where scope becomes knowable — after it, you get a number you can hold us to rather than a rate card and an estimate.',
  },
  {
    question: 'Can you take over a project that has already gone wrong?',
    answer:
      'Yes, and it is a meaningful part of what we do. We start by assessing what is salvageable, because the honest answer is often that less needs rebuilding than the previous vendor implied.',
  },
]

export const aiFaqs: readonly Faq[] = [
  {
    question: 'Which AI model should we use?',
    answer:
      'The cheapest one that clears your evaluation bar. We build against OpenAI, Anthropic, Google, Mistral and self-hosted Llama, and we will recommend a specific model only after testing candidates against a set of your real queries. The expensive frontier model is often buying accuracy you do not need.',
  },
  {
    question: 'Do we need RAG, or would fine-tuning work?',
    answer:
      'Retrieval, almost certainly. Fine-tuning changes how a model behaves; it does not teach it your documents. If you need grounding in current, specific knowledge, retrieval is the right tool — and we will tell you if you do not need either.',
  },
  {
    question: 'How do you prevent hallucinations?',
    answer:
      'We make the system able to decline. Confidence thresholds escalate to a human instead of guessing, every answer stores the passages it was derived from, and the accuracy number comes from an evaluation set built from your real queries rather than a generic benchmark.',
  },
  {
    question: 'What does an AI engagement cost?',
    answer:
      'A focused retrieval feature with a proper evaluation harness typically runs £40,000 to £120,000. The harness is not optional overhead — without it you have changed the system rather than improved it, and you cannot tell the difference.',
  },
  {
    question: 'Can you work with our existing data science team?',
    answer:
      'Yes. We are often the engineering half of that team, building the serving infrastructure, the evaluation harness and the integration into the product while they handle modelling.',
  },
]

export const careersFaqs: readonly Faq[] = [
  {
    question: 'Do you support remote work?',
    answer:
      'Fully async, with two team weeks a year in the studio together. Our four-day week is at full pay for everyone, including the roles that are nominally on-site.',
  },
  {
    question: 'How does the interview process work?',
    answer:
      'A conversation about your background, then a paid work sample that is scoped to two to three hours. If we ask you to do something, we pay for it. Final stage is with two people you would actually work alongside.',
  },
  {
    question: 'Will you consider an application without a CV?',
    answer:
      'Yes. A short note about what you have built and what you want to build next is more useful to us than a formatted document. Send that instead.',
  },
  {
    question: 'Do you sponsor visas?',
    answer:
      'Not at the moment. We are registered for Skilled Worker sponsorship but have not needed it yet, so the process is untested and we would rather not ask someone to rely on it.',
  },
]
