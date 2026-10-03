import type { Service } from '@/content/services'

/**
 * Enterprise systems practice.
 *
 * Separate from the studio's general services list because enterprise
 * implementations have a different shape: longer sales cycles, a compliance
 * dimension, and a heavy customisation surface. Separate files keep the main
 * services page readable while still letting both appear in navigation, search
 * and the command palette.
 */

export const enterpriseCategories = ['all', 'erp', 'crm', 'ecommerce', 'automation'] as const

export type EnterpriseCategory = Exclude<(typeof enterpriseCategories)[number], 'all'>

/**
 * Platforms we implement and integrate.
 *
 * `depth` is our honest self-assessment rather than a marketing claim —
 * 'partner' means accredited, 'certified' means formally trained, 'hands-on'
 * means we ship against it regularly.
 */
export type Platform = {
  name: string
  depth: 'partner' | 'certified' | 'hands-on'
  /** What we actually do with it. */
  note: string
  /** Modules or areas we work in most. */
  focus: readonly string[]
  category: EnterpriseCategory
}

export const platforms: readonly Platform[] = [
  {
    name: 'Odoo',
    depth: 'partner',
    note: 'Our deepest ERP relationship. We implement, customise and integrate Odoo across manufacturing, distribution and services businesses.',
    focus: [
      'Odoo Online',
      'Manufacturing MRP',
      'Purchase & Inventory',
      'Odoo.sh hosting',
      'Odoo 17/18 migration',
    ],
    category: 'erp',
  },
  {
    name: 'Microsoft Dynamics 365',
    depth: 'certified',
    note: 'ERP and CRM for organisations already invested in the Microsoft stack, particularly where Power BI reporting is a hard requirement.',
    focus: ['Finance & Operations', 'Dynamics CRM', 'Power BI', 'Power Automate', 'Dataverse'],
    category: 'erp',
  },
  {
    name: 'SAP Business One',
    depth: 'certified',
    note: 'Mid-market ERP where a full SAP deployment would be disproportionate. Frequently a consolidation target.',
    focus: ['Financials', 'Sales & Purchasing', 'Production Planning', 'Data migration'],
    category: 'erp',
  },
  {
    name: 'Salesforce',
    depth: 'certified',
    note: 'CRM implementation and integration where the sales process genuinely needs Salesforce rather than a lighter alternative.',
    focus: ['Sales Cloud', 'Service Cloud', 'CPQ', 'Data Cloud', 'MuleSoft integration'],
    category: 'crm',
  },
  {
    name: 'HubSpot',
    depth: 'hands-on',
    note: 'Marketing and sales automation for teams outgrowing spreadsheets but not ready for a Salesforce programme.',
    focus: ['Marketing Hub', 'Sales Hub', 'Custom objects', 'Workflow automation'],
    category: 'crm',
  },
  {
    name: 'Shopify Plus',
    depth: 'hands-on',
    note: 'Headless and Plus commerce, usually wired into a custom fulfilment or ERP backbone.',
    focus: ['Headless Hydrogen', 'Checkout extensibility', 'ERP sync', 'Subscription commerce'],
    category: 'ecommerce',
  },
  {
    name: 'WooCommerce',
    depth: 'hands-on',
    note: 'Commerce where WordPress is already the right CMS and a heavyweight platform would be over-engineering.',
    focus: ['Custom checkout', 'Performance', 'B2B pricing', 'ERP integration'],
    category: 'ecommerce',
  },
  {
    name: 'Make / n8n / Zapier',
    depth: 'hands-on',
    note: 'Integration layers. We treat these as glue, not architecture — and we will tell you when a real service is warranted.',
    focus: ['Integration design', 'Error handling', 'Retries & idempotency', 'Cost modelling'],
    category: 'automation',
  },
] as const

/** Enterprise implementation offer, mirrored from the services pattern. */
export const enterpriseService: Service = {
  slug: 'enterprise-systems',
  title: 'Enterprise systems',
  summary:
    'ERP, CRM and commerce implementations that survive contact with real data and real users.',
  body: 'Most enterprise software projects fail in the gap between the demo and production. The demo works because someone curated the data; production fails because nobody planned for the eleven years of exceptions already sitting in the database.\n\nWe start with the data, not the configuration. Mapping and cleaning your existing records comes before any module is switched on, because that work is what determines whether the go-live succeeds. We implement in a staging environment that mirrors production, migrate in rehearsed phases with a tested rollback for each, and train the team who will actually use it — not just the team who will approve it.\n\nWe work with Odoo, Dynamics 365, SAP Business One, Salesforce, HubSpot, Shopify and WooCommerce, and we are candid when one of those is the wrong choice for your situation. Fewer platforms, deeply known, beat a long list superficially supported.',
  deliverables: [
    'Data assessment, mapping and cleansing plan',
    'Platform selection advisory and fit analysis',
    'Configuration, customisation and integration build',
    'Phased migration with rehearsed rollback',
    'Staging environment mirroring production',
    'Team training and hypercare support',
  ],
  tint: 'primary',
}

/** Case-study-shaped entries for the ERP / automation track. */
export type EnterpriseCase = {
  slug: string
  title: string
  client: string
  year: number
  category: EnterpriseCategory
  summary: string
  approach: readonly string[]
  outcome: string
  metrics: readonly { label: string; value: string }[]
  stack: readonly string[]
}

export const enterpriseCases: readonly EnterpriseCase[] = [
  {
    slug: 'o-manufacturing-consolidation',
    title: 'Consolidating four Odoo instances into one',
    client: 'Precision Components',
    year: 2026,
    category: 'erp',
    summary:
      'Four acquired companies, four Odoo instances, one manufacturing group. We consolidated without stopping production.',
    approach: [
      'Audited all four instances and produced a single target data model, resolving the conflicts before any migration ran.',
      'Built a repeatable migration harness with dry-run reporting, so each rehearsal surfaced discrepancies before they hit production.',
      'Migrated entity by entity in four phases, with a tested rollback between each.',
      'Trained the four finance teams on one process rather than four dialects.',
    ],
    outcome:
      'The group now runs one instance, one chart of accounts and one set of KPIs. Month-end close dropped from eleven days to three.',
    metrics: [
      { label: 'Odoo instances', value: '4 → 1' },
      { label: 'Month-end close', value: '11 days → 3 days' },
      { label: 'Duplicate POs', value: '−82%' },
      { label: 'Production downtime', value: '0 hours' },
    ],
    stack: ['Odoo 18', 'PostgreSQL', 'Python', 'Odoo.sh', 'Docker'],
  },
  {
    slug: 'retail-erp-integration',
    title: 'Wiring Shopify to an Odoo backbone',
    client: 'Halden Retail',
    year: 2025,
    category: 'ecommerce',
    summary:
      'A Shopify storefront whose stock counts were wrong roughly 40% of the time, and a warehouse paying the difference.',
    approach: [
      'Traced the discrepancy to three separate stock sources with no single authority.',
      'Made Odoo the source of truth for stock and pushed updates to Shopify through a thin, rate-limited sync service.',
      'Added a reconciliation job with alerting, so a drift does not quietly become a stockout.',
      'Handled partial fulfilment, returns and multi-warehouse transfers in the sync model.',
    ],
    outcome:
      'Stock accuracy is now within 0.4%, overselling has effectively stopped, and the reconciliation alert has caught three supplier errors before customers saw them.',
    metrics: [
      { label: 'Stock accuracy', value: '60% → 99.6%' },
      { label: 'Oversell incidents', value: '−94%' },
      { label: 'Sync latency', value: '< 30 seconds' },
      { label: 'Manual corrections', value: '−88%' },
    ],
    stack: ['Shopify Plus', 'Odoo', 'Node.js', 'Redis', 'webhooks'],
  },
  {
    slug: 'finance-process-automation',
    title: 'Automating a month-end close that took nine days',
    client: 'Ashgrove Group',
    year: 2025,
    category: 'automation',
    summary:
      'A finance team spending most of their month on reconciliation. We fixed the process, not just the tooling.',
    approach: [
      'Shadowed the close and classified every manual step by frequency and risk.',
      'Found that 70% of effort went to reconciliations that a system should have done — upstream data was simply not being validated.',
      'Added validation at the point of entry so bad data cannot reach the reconciliation stage.',
      'Automated the remaining reconciliations with explicit exception handling, not optimistic logging.',
    ],
    outcome:
      'The close now takes two and a half days and needs no weekend work. Two junior roles moved onto work they found more interesting.',
    metrics: [
      { label: 'Close duration', value: '9 days → 2.5 days' },
      { label: 'Manual steps', value: '−76%' },
      { label: 'Weekend overtime', value: 'Eliminated' },
      { label: 'Audit findings', value: '−60%' },
    ],
    stack: ['Dynamics 365', 'Python', 'SQL Server', 'Power Automate'],
  },
] as const

export function getEnterpriseCase(slug: string) {
  return enterpriseCases.find((item) => item.slug === slug)
}

export function platformsByCategory(category: EnterpriseCategory | 'all') {
  return category === 'all' ? platforms : platforms.filter((p) => p.category === category)
}

export const depthLabels: Record<Platform['depth'], string> = {
  partner: 'Accredited partner',
  certified: 'Certified engineers',
  'hands-on': 'Shipping against it weekly',
}
