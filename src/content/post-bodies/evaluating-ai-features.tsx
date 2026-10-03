import { Prose } from '@/components/ui/prose'

export default function Content() {
  return (
    <Prose>
      <p>
        Retrieval-augmented generation fails quietly. That is what makes it dangerous. A traditional
        bug produces an error; a retrieval bug produces a confident, fluent, wrong answer, and
        nobody notices until a customer does.
      </p>

      <h2>Measure before you ship</h2>
      <p>
        The first thing we build is never the assistant. It is the evaluation harness — a labelled
        set of real questions with the answers a domain expert considers correct, plus a runner that
        scores the system against it.
      </p>
      <p>
        Build it from historical data rather than invented examples. Support tickets, search logs,
        or the questions your team already answers repeatedly. Real questions have the awkward
        phrasing and the missing context that synthetic ones never do, and that gap is exactly where
        retrieval systems fall over.
      </p>
      <blockquote>
        If you cannot measure whether it got better, you have not improved it — you have changed it.
      </blockquote>

      <h2>Confidence thresholds, not just answers</h2>
      <p>
        A retrieval system should be able to decline. When the top retrieved passage is below a
        similarity threshold, escalate to a human rather than producing something plausible.
      </p>
      <p>This has a cost — you deflect fewer tickets. That is the correct trade:</p>
      <ul>
        <li>A deflection rate measured against a wrong answer rate you would not accept.</li>
        <li>A refusal, which costs a few seconds of someone's time.</li>
        <li>A confidently wrong answer, which costs a customer relationship.</li>
      </ul>

      <h2>Trace every answer</h2>
      <p>
        Log the retrieved documents, their scores, and the final response for every query. This is
        not optional for debugging, and it turns out to be the thing that makes non-technical
        stakeholders comfortable with the system: they can see the sources.
      </p>
      <p>
        It also makes regression analysis possible. When accuracy drops, you need to know whether
        the documents changed, the retrieval configuration changed, or the model changed. Without
        traces you are guessing between those three.
      </p>

      <h2>Run in shadow mode first</h2>
      <p>
        Before the assistant answers a single real question, let it answer all of them silently and
        score the output. You get real traffic, zero risk, and an honest accuracy number before
        anyone is relying on it.
      </p>
      <p>
        On one recent engagement this caught two regressions that would otherwise have shipped — one
        from a documentation restructure that quietly broke chunk boundaries, one from a model
        upgrade that was three points worse on their specific domain and better on our generic
        benchmark.
      </p>

      <h2>Then watch the cost</h2>
      <p>
        Retrieval systems have a cost that scales with usage in a way that is easy to miss during
        evaluation. Track cost per resolved ticket from the start. On our last engagement, adding
        caching and tightening the top-k got that down 78% without a measurable accuracy cost — but
        only because someone had been tracking it since week one.
      </p>
    </Prose>
  )
}
