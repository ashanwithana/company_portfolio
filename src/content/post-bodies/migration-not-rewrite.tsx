import { Prose } from '@/components/ui/prose'

export default function Content() {
  return (
    <Prose>
      <p>
        Every few months someone asks us why we have spent years arguing against rewrites. The short
        answer is that we keep meeting the consequences of them. This is the longer one.
      </p>

      <h2>The seduction of the clean slate</h2>
      <p>
        A rewrite is the most appealing project in software. It has a start, an end, and a
        definition of done that everyone can point at. The existing system is visibly broken, which
        makes the case unanswerable in a meeting. And there is a deep structural bias toward
        overestimation: the new thing only has to contain the features you know about, not the ones
        that only surface once customers depend on them.
      </p>
      <p>
        Two decades of edge cases do not appear in your requirements document. They appear in
        production, usually at 2am, usually the week after you thought you were finished.
      </p>

      <blockquote>
        The rewrite will be faster than fixing it — right up until the month it is not.
      </blockquote>

      <h2>What a migration actually looks like</h2>
      <p>
        The alternative is not "never touch it". It is characterisation, a routing layer, and
        incremental replacement. Concretely, on a recent engagement for a retail bank:
      </p>
      <ol>
        <li>
          <strong>Characterise before changing.</strong> We wrote tests against the existing
          behaviour first. Not to keep it forever — to make every subsequent change visible. Without
          this, you cannot tell a refactor from a regression.
        </li>
        <li>
          <strong>Put a facade in front.</strong> A routing layer that could send any request to
          either the legacy core or a new service. From that day, migration was a configuration
          change rather than a deployment.
        </li>
        <li>
          <strong>Move one capability at a time</strong>, behind a flag, with the ability to revert
          in seconds. Fourteen of them over eleven months.
        </li>
        <li>
          <strong>Retire the duplicate.</strong> The worst outcomes come from systems that run in
          parallel forever because nobody owns the decommission.
        </li>
      </ol>

      <h2>The economics</h2>
      <p>
        The team's instinct was to rewrite. What actually happened, measured against the baseline we
        captured in week one:
      </p>
      <ul>
        <li>Release lead time went from one day to forty minutes.</li>
        <li>P95 page load went from 4.8 seconds to 0.9.</li>
        <li>Infrastructure cost fell 64%.</li>
        <li>Deploy frequency went from twice a month to thirty times a month.</li>
      </ul>
      <p>
        Eleven months, no planned downtime, no customer-visible incidents. A rewrite would have
        taken roughly the same time and delivered a fraction of it, with considerably more risk.
      </p>

      <h2>When a rewrite is right</h2>
      <p>
        We are not dogmatic. Sometimes the existing system genuinely cannot be evolved: the hardware
        it depends on is discontinued, the licence cannot be renewed, or the domain has changed so
        much that the old model actively misrepresents the business. The test we apply is simple —{' '}
        <em>can we put a facade in front of it and move one capability at a time?</em> If yes,
        migrate. If the answer is no because the thing cannot be isolated at all, then rewrite, but
        budget for the discovery you skipped.
      </p>

      <h2>The part people forget</h2>
      <p>
        The hardest part of a migration is not technical, it is organisational. There is always a
        migration in progress, and a team splitting its attention between the thing that pays the
        bills and the thing that does not. That is why the facade has to be genuinely incremental.
        Nine months of "nearly there" is worse than a year of steady, visible progress — because
        nine months of nearly-there is when everyone quietly starts looking for another job.
      </p>
    </Prose>
  )
}
