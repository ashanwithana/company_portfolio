import { Prose } from '@/components/ui/prose'

export default function Content() {
  return (
    <Prose>
      <p>
        The teams we meet are not short of metrics. They are short of metrics that reflect what
        users actually experience. This is the gap we close in week one, before writing a line of
        code.
      </p>

      <h2>Lab scores measure the wrong thing</h2>
      <p>
        Lighthouse and synthetic monitoring are genuinely useful — for regression detection, for
        comparing builds, for catching a change that accidentally doubles your JavaScript. What they
        cannot tell you is whether your page is fast, because they test on a simulated mid-range
        phone on a simulated network that does not resemble your users.
      </p>
      <p>
        A site can score 98 in the lab and still feel sluggish on the four-year-old Android that
        accounts for 11% of your traffic. It will feel worse on the phone your users are holding
        while commuting, which is a materially different network from your office Wi-Fi.
      </p>

      <blockquote>Optimise for the device in your pocket, not the device on your desk.</blockquote>

      <h2>Measure real users, then segment</h2>
      <p>
        We start with real-user monitoring, because the aggregate tells you something and the
        distribution tells you why. The useful question is not "what is our p75 LCP" but "what is
        our p75 for users on the slowest third of devices, on mobile, who arrived from paid search."
      </p>
      <p>
        Segment before you optimise. Averages hide the exact users having the exact problem you were
        hired to fix.
      </p>

      <h2>Budgets, not aspirations</h2>
      <p>
        A performance budget that lives in a document will be breached. One that fails the build
        will not. We set explicit thresholds in CI early enough that they are cheap to meet, and we
        treat a breach the same way we treat a failing test — as something to fix, not discuss.
      </p>
      <pre>
        <code>{`// budget assertions in CI
expect(lcp).toBeLessThan(2500)
expect(cls).toBeLessThan(0.1)
expect(inp).toBeLessThan(200)`}</code>
      </pre>
      <p>
        The exact numbers depend on the product. The important part is that they exist, they are
        agreed with the team that owns the outcome, and they are enforced automatically.
      </p>

      <h2>Fix by measured impact</h2>
      <p>
        Once you have real-user data, rank candidate fixes by effort against measured impact rather
        than by how interesting they are. On a recent engagement the largest single win — 1.8
        seconds of LCP — came from properly sizing and preloading one hero image. The team's first
        instinct had been to rewrite the component tree.
      </p>
      <p>
        That is the pattern. The interesting refactor is rarely the highest-value one, and the
        boring fix is rarely as small as it looks until you have measured it.
      </p>

      <h2>Re-measure and say so</h2>
      <p>
        Last: verify the improvement against the baseline you captured. If a number did not move,
        explain why before anyone asks. We have been wrong often enough that this is not bookkeeping
        — it is the reason clients trust the numbers we give them.
      </p>
    </Prose>
  )
}
