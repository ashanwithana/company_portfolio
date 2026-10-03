import { Prose } from '@/components/ui/prose'

export default function Content() {
  return (
    <Prose>
      <p>
        Most design systems fail for the same reason, and it is not usually technical. The component
        library works. Nobody uses it.
      </p>

      <h2>Why the first two attempts fail</h2>
      <p>
        A design system is usually sold as a technical consolidation: nine products have drifted
        apart, so we will build one shared library. That is the right diagnosis and the wrong
        intervention, because the libraries that ship this way tend to be technically correct and
        practically ignored.
      </p>
      <p>There are two predictable reasons:</p>
      <ol>
        <li>
          <strong>Contributing was harder than circumventing.</strong> If adopting the system saves
          a team four hours and contributing to it costs them a week of review, the rational choice
          is to build locally.
        </li>
        <li>
          <strong>Nobody decided what belonged in it.</strong> Without a clear boundary and a named
          owner per component, the library becomes a dumping ground or a bottleneck — and both
          outcomes kill adoption.
        </li>
      </ol>

      <blockquote>
        A design system is an agreement. The component folder is just the receipt.
      </blockquote>

      <h2>Tokens first, components second</h2>
      <p>
        Start with the token architecture — colour, type, spacing, radius, motion. Before any
        component exists, this makes theming and density a configuration change rather than a
        refactor. It also forces the underlying disagreements into the open early, which is much
        better than discovering them during component review.
      </p>
      <p>
        Then build components with accessibility and tests <em>before</em> they ship, and make
        failing tests a merge blocker. A component library that is easy to use but subtly wrong
        about focus order is worse than none, because it distributes the bug.
      </p>

      <h2>Make contribution cheaper than circumventing</h2>
      <p>
        This is the whole game. We require a named owner per component, a published review cadence
        with a response-time commitment, and a template that makes the common case a five-minute
        job. When the path of least resistance leads into the system, adoption follows.
      </p>

      <h2>Measure adoption honestly</h2>
      <p>
        Count production surfaces using the system, not components imported. The second number is
        easy to inflate and says nothing useful. On our last design system engagement, adoption
        reached 94% of production surfaces in eight months, and the metric that predicted it was
        time-to-merge for a system contribution, tracked from week one.
      </p>
      <p>
        The other number worth watching: visual and accessibility defects across products fell 71%.
        That was the outcome the business cared about, and it is a direct consequence of nine teams
        shipping against one reviewed set of components rather than nine.
      </p>
    </Prose>
  )
}
