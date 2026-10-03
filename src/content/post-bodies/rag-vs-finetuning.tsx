import { Prose } from '@/components/ui/prose'

export default function Content() {
  return (
    <Prose>
      <p>
        &quot;Should we fine-tune or use RAG?&quot; is the most common first question we hear about
        AI features, and it is usually the wrong question. They solve different problems. Here is
        how to tell which problem you actually have.
      </p>

      <h2>What each one actually does</h2>
      <p>
        Retrieval grounds the model in <em>your documents at query time</em>. The knowledge stays in
        your corpus, stays current, and every answer can cite its sources. Fine-tuning changes{' '}
        <em>how the model behaves</em> — its tone, its format, its skill at a task — by training on
        examples.
      </p>
      <p>
        The confusion comes from demos where both appear to &quot;teach the model&quot; something.
        Only one of them keeps teaching it after the demo ends.
      </p>

      <h2>The decision in one table</h2>
      <ul>
        <li>
          <strong>Knowledge changes often → RAG.</strong> Documents update; retraining schedules do
          not keep up. Retrieval reads the current version every time.
        </li>
        <li>
          <strong>Answers must cite sources → RAG.</strong> A fine-tuned model cannot point at the
          paragraph it used, because there is no paragraph — the knowledge is in the weights.
        </li>
        <li>
          <strong>Consistent format or tone → fine-tune.</strong> House style, structured output
          schemas, classification labels: behaviour, not knowledge.
        </li>
        <li>
          <strong>High volume, narrow task → fine-tune a small model.</strong> A fine-tuned 8B model
          answering one question type will beat a frontier model on cost by an order of magnitude —
          once you have proven the task with retrieval first.
        </li>
      </ul>

      <blockquote>
        Prototype with retrieval, measure with an evaluation set, and fine-tune only the parts the
        numbers say retrieval cannot do.
      </blockquote>

      <h2>The sequence that works</h2>
      <ol>
        <li>
          <strong>Start with baseline RAG</strong> over your real corpus and a labelled set of real
          questions. This takes days and tells you whether the knowledge is even retrievable — which
          is the thing most likely to be wrong.
        </li>
        <li>
          <strong>Fix the data before the model.</strong> Chunking, metadata and deduplication move
          accuracy more than any model choice. We have never seen an engagement where this was not
          true.
        </li>
        <li>
          <strong>Fine-tune narrowly, if at all.</strong> Format adherence, refusal behaviour,
          domain phrasing — small, testable behaviours with their own spot-checks.
        </li>
        <li>
          <strong>Keep the harness running.</strong> Whatever you chose, the regression set runs on
          every change: prompts, models, corpus updates. All of it.
        </li>
      </ol>

      <h2>What about training on our data from scratch?</h2>
      <p>
        Almost certainly not. Pre-training is a capital expenditure measured in millions, and the
        result is a model that knows your 2024 documentation the way a graduate remembers a textbook
        — approximately, and without citations. Retrieval over your live corpus beats it on
        accuracy, freshness and cost in every engagement we have scoped.
      </p>

      <h2>The cost angle</h2>
      <p>
        A fine-tuned small model is the cheapest thing to <em>run</em> at volume and among the most
        expensive things to <em>build well</em> — data curation, training runs, evaluation of the
        tuned behaviour itself. RAG is the reverse: cheap to start, with costs that scale per query.
        For anything under a few million queries a month, retrieval wins on total cost. Past that,
        measure both and let the numbers decide.
      </p>
    </Prose>
  )
}
