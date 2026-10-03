import { Prose } from '@/components/ui/prose'

export default function Content() {
  return (
    <Prose>
      <p>
        Everyone agrees RAG systems should be evaluated. Fewer teams can say what their evaluation
        actually consists of. This is the checklist we run before any retrieval system answers a
        real question — steal it wholesale.
      </p>

      <h2>1. A labelled set built from real queries</h2>
      <p>
        Two hundred questions minimum, drawn from support tickets, search logs or the questions your
        team already answers. Each one needs the answer a domain expert considers correct, and —
        this is the part people skip — the documents that answer should come from.
      </p>
      <p>
        Synthetic questions test whether your system handles clean input. Your users will not
        provide any. The gap between the two is exactly where retrieval fails.
      </p>

      <h2>2. Chunking decided by measurement, not intuition</h2>
      <p>
        Test at least three chunking strategies against the labelled set: naive fixed-size,
        structure-aware (headings, sections), and small-chunks-with-rich-metadata. On our last four
        engagements the obvious choice won once.
      </p>
      <ul>
        <li>
          Record recall@k for k = 3, 5 and 10 separately — the right k is an output, not an input.
        </li>
        <li>Keep the failing queries. They are the specification for every future improvement.</li>
        <li>Re-run whenever the corpus changes shape, not just when the code changes.</li>
      </ul>

      <h2>3. A decline threshold, calibrated</h2>
      <p>
        The system must be able to say it does not know. Set the similarity threshold from the
        labelled set: the score below which answers are more often wrong than right. Then escalate
        those to a human instead of generating.
      </p>
      <blockquote>A refusal costs seconds. A confident wrong answer costs a customer.</blockquote>

      <h2>4. Citation checks on every answer</h2>
      <p>
        Every generated claim should trace to a retrieved passage. We grade this automatically with
        a second model pass, and anything ungrounded is either revised against its sources or
        escalated. The checker needs its own spot-checks — an unevaluated checker is just confidence
        with extra steps.
      </p>

      <h2>5. Shadow mode before launch</h2>
      <p>
        Run against live traffic silently for at least a week. You get real queries, zero user risk,
        and an honest accuracy number before anyone relies on the output. Twice now this has caught
        a corpus change that broke chunk boundaries days before launch.
      </p>

      <h2>6. Cost per resolved task, tracked from week one</h2>
      <p>
        Retrieval cost scales with usage in ways that are easy to miss during evaluation. Track
        tokens, embedding calls and reranking separately, per resolved task — not per query, since
        agentic patterns issue several. On our last engagement, tightening top-k and adding a cache
        cut this 78% with no measurable accuracy change.
      </p>

      <h2>7. A regression run on every change</h2>
      <p>
        Prompts, models, chunking, corpus updates — all of it goes through the labelled set before
        it ships. The run takes minutes and has caught three pre-launch regressions this year alone,
        including a model upgrade that was better on generic benchmarks and three points worse on
        the client&apos;s domain.
      </p>

      <h2>What &quot;done&quot; looks like</h2>
      <p>
        A number you can put in writing: accuracy against the labelled set, the decline rate, and
        the cost per resolution. If a vendor or a team cannot give you those three, they have
        changed the system rather than improved it — and you cannot tell the difference.
      </p>
    </Prose>
  )
}
