import { Prose } from '@/components/ui/prose'

export default function Content() {
  return (
    <Prose>
      <p>
        Salesforce rarely fails because the software is wrong. It fails because the implementation
        treated a sales process problem as a software purchase. These are the five failure modes we
        see repeatedly — all of them preventable, none of them in the sales deck.
      </p>

      <h2>1. Automating a process nobody wrote down</h2>
      <p>
        The discovery phase produces a diagram of how sales <em>should</em> work. The implementation
        encodes it. Six weeks after go-live, reps are back in spreadsheets because the actual
        process — the exceptions, the side channels, the deals that do not fit the stages — was
        never captured.
      </p>
      <p>
        Fix: shadow three reps for a week before configuring anything. The real process is visible
        only in what people do, never in what the playbook says.
      </p>

      <h2>2. Fields nobody owns</h2>
      <p>
        Every stakeholder gets their required field. Within a year the opportunity form has forty
        fields, reps fill twelve, and reporting runs on data nobody trusts. This is the most common
        Salesforce failure and the most boring to fix: delete fields until the form fits on one
        screen, and give every remaining field a named owner.
      </p>

      <blockquote>
        A CRM with forty required fields has zero required fields — because nobody fills in any of
        them accurately.
      </blockquote>

      <h2>3. Integration as an afterthought</h2>
      <p>
        Salesforce goes live disconnected from the ERP, the support desk and finance. Reps retype
        order history, support cannot see entitlements, and finance reconciles by hand. The system
        is blamed for being &quot;just a database&quot; when it was deployed as one.
      </p>
      <p>
        Fix: the integration list is part of the initial scope, not phase two. Phase two is where
        integrations go to be quietly cancelled.
      </p>

      <h2>4. Admin by committee</h2>
      <p>
        Nobody owns the org, so everybody with admin rights makes &quot;just a small change&quot;.
        Two years later there are four hundred workflow rules, half of them contradictory, and
        nobody can say what happens when an opportunity closes.
      </p>
      <p>
        Fix: one named admin, a change log, and a rule that automation over a threshold goes through
        review. Boring governance beats exciting archaeology.
      </p>

      <h2>5. Measuring activity instead of outcomes</h2>
      <p>
        Dashboards count calls, emails and meetings because those are easy to count. Reps optimise
        for the count. Pipeline quality falls while activity rises, and leadership concludes the
        team needs more tooling.
      </p>
      <p>
        Fix: report on stage conversion and forecast accuracy — the numbers that survive contact
        with a quarterly review — and treat activity metrics as diagnostic, not targets.
      </p>

      <h2>The pattern underneath</h2>
      <p>
        Four of the five are process failures wearing software costumes. That is why our Salesforce
        work starts with the sales floor rather than the setup menu, and why we will sometimes tell
        a client their problem needs a lighter CRM, or no new software at all. A smaller honest
        scope beats a large hopeful one — every time we have measured it.
      </p>
    </Prose>
  )
}
