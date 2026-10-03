import { Prose } from '@/components/ui/prose'

export default function Content() {
  return (
    <Prose>
      <p>
        Most Odoo projects we are called into have the same shape: the software was installed
        correctly, the data was migrated hopefully, and go-live revealed the difference. This is the
        implementation guide we wish every project had started with.
      </p>

      <h2>Start with the data, not the modules</h2>
      <p>
        Odoo will happily import whatever you give it. That is the problem. Duplicate customers,
        three spellings of the same supplier, open orders from 2019 that nobody closed — all of it
        imports cleanly and then poisons every report you run afterwards.
      </p>
      <p>Before any module is switched on, we insist on three artefacts:</p>
      <ol>
        <li>
          <strong>A data inventory.</strong> Every source system, every export, and an honest count
          of records in each. The number is always larger than the estimate.
        </li>
        <li>
          <strong>A deduplication pass.</strong> Usually 8–15% of customer and supplier records are
          duplicates. Merge them before migration, not after, because post-migration merges break
          foreign keys you will spend weeks repairing.
        </li>
        <li>
          <strong>A cut-off policy.</strong> Decide what migrates and what stays read-only in the
          old system. Migrating eleven years of history feels thorough and mostly buys you eleven
          years of bad data in a new database.
        </li>
      </ol>

      <blockquote>
        The demo works because someone curated the data. Production fails because nobody planned for
        the exceptions already sitting in the database.
      </blockquote>

      <h2>Which Odoo, and where it runs</h2>
      <p>
        For most businesses we recommend Odoo Online or Odoo.sh on a current long-term release (17
        or 18 at the time of writing). Self-hosting makes sense only when you have a specific reason
        — custom modules that need server access, or data that cannot leave your infrastructure.
      </p>
      <ul>
        <li>
          <strong>Odoo Online</strong> — fastest to start, least customisable. Right when your
          processes fit Odoo rather than the other way round.
        </li>
        <li>
          <strong>Odoo.sh</strong> — our default. Staging branches mirror production, so every
          migration phase can be rehearsed exactly as it will run.
        </li>
        <li>
          <strong>On-premise</strong> — justified for regulated data or heavy custom modules, and
          only with someone who will own the upgrades.
        </li>
      </ul>

      <h2>The modules that actually matter</h2>
      <p>
        Odoo sells breadth; implementations succeed on depth in four or five modules. For
        manufacturing and distribution, the order that works is:
      </p>
      <ol>
        <li>
          <strong>Inventory and Purchase first.</strong> Stock accuracy is the foundation everything
          else reports on. If this is wrong, the financials built on top of it are fiction.
        </li>
        <li>
          <strong>Sales and Invoicing second.</strong> Wired to the same stock truth, so the
          storefront stops overselling.
        </li>
        <li>
          <strong>Manufacturing (MRP) third.</strong> Bills of materials deserve their own phase
          because they encode tribal knowledge nobody has written down.
        </li>
        <li>
          <strong>Everything else after go-live.</strong> CRM, helpdesk and marketing automation are
          easier to adopt once the operational core is trusted.
        </li>
      </ol>

      <h2>Rehearse the migration, then rehearse it again</h2>
      <p>
        Every migration phase runs at least twice in staging: once to find the discrepancies, once
        to prove the fix. Each phase has a tested rollback, because the question is never whether
        something goes wrong but whether you can reverse it in minutes rather than days.
      </p>
      <p>
        On a recent consolidation of four Odoo instances into one, the third rehearsal caught a
        chart-of-accounts mapping error that would have misposted six weeks of transactions. The
        rehearsal took an afternoon. The alternative would have taken a quarter to unwind.
      </p>

      <h2>Train the users, not the approvers</h2>
      <p>
        Training budgets get spent on the team that approves the system. The team that uses it gets
        a PDF. Reverse that. We train in the staging environment against the migrated data, so the
        first day on the new system feels like the fiftieth day of practice — because it is.
      </p>

      <h2>When Odoo is the wrong answer</h2>
      <p>
        We are an Odoo partner and we will tell you when not to buy it: when you need multi-entity
        consolidation across dozens of legal entities with complex intercompany rules (look at
        Dynamics 365 Finance), when your sales process genuinely needs Salesforce CPQ, or when your
        problem is a single integration rather than an ERP at all.
      </p>
    </Prose>
  )
}
