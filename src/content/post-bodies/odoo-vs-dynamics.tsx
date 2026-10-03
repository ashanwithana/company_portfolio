import { Prose } from '@/components/ui/prose'

export default function Content() {
  return (
    <Prose>
      <p>
        We implement both Odoo and Dynamics 365, which puts us in an unusual position: we have no
        financial reason to prefer either. This is the comparison we give clients when they ask —
        including the parts each vendor&apos;s sales team leaves out.
      </p>

      <h2>The one-paragraph version</h2>
      <p>
        Choose Odoo when you want one integrated system quickly and your processes can bend toward
        it. Choose Dynamics 365 when you have multi-entity finance, complex intercompany rules, or
        Power BI as a non-negotiable. The price gap between them is real but smaller than it looks
        once implementation is included — and implementation is most of the cost either way.
      </p>

      <h2>Where Odoo wins</h2>
      <ul>
        <li>
          <strong>Time to value.</strong> A standard Odoo implementation goes live in months, not
          quarters. The modules share one data model, so inventory, sales and invoicing agree with
          each other from day one.
        </li>
        <li>
          <strong>Total cost.</strong> Lower licences and a faster implementation typically put Odoo
          at £40k–£180k all-in for a mid-sized business, against £120k–£400k+ for Dynamics.
        </li>
        <li>
          <strong>Coherence.</strong> One vendor, one interface, one support contract. For a team of
          fifty to three hundred people, that simplicity is worth more than any feature list.
        </li>
      </ul>

      <h2>Where Dynamics 365 wins</h2>
      <ul>
        <li>
          <strong>Multi-entity finance.</strong> Dozens of legal entities, intercompany eliminations
          and complex consolidation are genuinely what Dynamics Finance is built for. Odoo can be
          stretched here, but stretching is where implementations go to die.
        </li>
        <li>
          <strong>The Microsoft estate.</strong> If your organisation runs on Teams, SharePoint and
          Power BI, Dynamics inherits authentication, audit and reporting that would each be a
          project on their own.
        </li>
        <li>
          <strong>Depth in specific modules.</strong> Advanced warehousing, demand planning and
          compliance-heavy manufacturing have more headroom in Dynamics than in Odoo&apos;s standard
          apps.
        </li>
      </ul>

      <blockquote>
        The wrong question is &quot;which is better&quot;. The right one is &quot;which set of
        trade-offs matches a company shaped like ours&quot;.
      </blockquote>

      <h2>The costs nobody puts in the proposal</h2>
      <p>Whichever you choose, budget for the same three things vendors understate:</p>
      <ol>
        <li>
          <strong>Data work.</strong> Deduplication, mapping and cleansing run 15–25% of the total
          on a typical project. Anyone quoting without asking about your data has not priced the
          actual project.
        </li>
        <li>
          <strong>Year-two licences.</strong> Dynamics licensing compounds; Odoo&apos;s is flatter
          but custom modules need upgrade discipline every release. Model five years, not one.
        </li>
        <li>
          <strong>Training the users.</strong> Not the approvers. The team that touches the system
          daily needs hands-on time in staging against migrated data.
        </li>
      </ol>

      <h2>When the answer is neither</h2>
      <p>
        Sometimes the right recommendation is SAP Business One (production planning depth without
        full SAP), sometimes Salesforce (when the problem is really the sales process), and
        sometimes no ERP at all — a targeted integration for a tenth of the cost. We have
        recommended all three this year, including to clients who arrived asking for Odoo by name.
      </p>
    </Prose>
  )
}
