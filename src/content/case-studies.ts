/**
 * Case studies.
 *
 * Each entry drives the /work listing card *and* the /work/[slug] detail page,
 * so the long-form fields are part of the same record rather than a parallel file
 * that can drift out of sync.
 *
 * Content policy: every entry describes a real engagement type the studio
 * delivers. No invented metrics, no fabricated client names, no false claims
 * about implementation details. Where a number would be needed to make a point,
 * the field is left descriptive rather than numeric.
 */

export const caseStudyCategories = ['all', 'web', 'platform', 'enterprise', 'ai', 'brand'] as const

export type CaseStudyCategory = Exclude<(typeof caseStudyCategories)[number], 'all'>

export type Metric = {
  label: string
  value: string
}

export type CaseStudy = {
  slug: string
  title: string
  /** Short client + project descriptor used in listings. */
  client: string
  year: number
  category: CaseStudyCategory
  categoryLabel: 'Web' | 'Platform' | 'Enterprise' | 'AI' | 'Brand'
  /** One-line summary for cards and meta descriptions. */
  summary: string
  /** Opening statement on the detail page. */
  intro: string
  services: readonly string[]
  /** The problem the client had. */
  challenge: string
  /** What we did about it. */
  approach: readonly string[]
  /** What changed as a result. */
  outcome: string
  /** Headline results, rendered as a stat row. */
  metrics: readonly Metric[]
  tech: readonly string[]
  tint: 'primary' | 'amber' | 'brand'
  featured?: boolean
  /** Set to false to keep work-in-progress cases off the public listing. */
  published?: boolean
}

export const caseStudies: readonly CaseStudy[] = [
  {
    slug: 'bygs-sports-club-website',
    title: 'BYGs sports club website',
    client: 'BYGs',
    year: 2025,
    category: 'web',
    categoryLabel: 'Web',
    summary:
      'Website design and build for a sports club and its youth development programme, including fixtures, squads and news.',
    intro:
      'BYGs runs a sports club and youth development programme in Oman. The club had no real online home — fixtures lived in chat groups, squad lists in spreadsheets, and joining meant asking around. Parents could not find kick-off times, and the committee spent every weekend answering the same questions on WhatsApp.',
    services: ['Web design', 'Development', 'Content structure', 'Training'],
    challenge:
      'The club needed a site parents and players could actually use: fixtures and results up front, squads and age groups findable, and a simple way for new players to enquire — without the committee becoming full-time webmasters. The committee had no technical background and no budget for ongoing developer support.',
    approach: [
      'Designed the site around match-day routines — fixtures, results and squads as the primary pages, news behind them — so the information parents actually need is one tap from the homepage.',
      'Built a clean, fast site the committee can update themselves: a simple CMS with pre-built page types for fixtures, squads and news, and a 30-minute training session so they are not dependent on us.',
      'Carried the club identity through the site — colours, crest, tone — so it reads as one club, not a template, and added an enquiry form that routes new-player requests directly to the right coach.',
      'Structured the content so the youth development programme has its own section, separate from the senior sides, with its own contact path and age-group breakdown.',
    ],
    outcome:
      'A site the club runs itself. Fixtures go up on Sunday evening by a volunteer with no technical background, and new-player enquiries now arrive through the site instead of scattered across personal WhatsApp messages. The design has room to grow as the programme adds age groups.',
    metrics: [
      { label: 'Location', value: 'Oman' },
      { label: 'Scope', value: 'Design + build' },
      { label: 'Type', value: 'Club website' },
      { label: 'Handover', value: 'Self-managed' },
    ],
    tech: ['WordPress', 'PHP', 'JavaScript'],
    tint: 'brand',
    featured: true,
  },
  {
    slug: 'utn-trade-wordpress',
    title: 'UTN Trade WordPress build',
    client: 'UTN Trade',
    year: 2024,
    category: 'web',
    categoryLabel: 'Web',
    summary:
      'Company website built in WordPress with a custom theme and bespoke design, replacing a dated template.',
    intro:
      'UTN Trade needed a company website that looked like them and could keep pace with their catalogue. Their existing site ran on a dated template that was slow to update — every product change meant waiting for a developer, and the design did not reflect how the company actually wanted to be seen.',
    services: ['WordPress development', 'Custom theme', 'Design', 'Training'],
    challenge:
      'The old template did not reflect the company and required a developer for every catalogue change. The team needed something they could edit themselves without touching code. The site also had to work for both the trade counter — where staff look up products quickly — and for new customers discovering the company for the first time.',
    approach: [
      'Built a custom WordPress theme to the studio designs — no page-builder bloat — so the site is fast and the markup is clean, not a nesting of shortcodes.',
      'Structured the admin around how the team actually works: products, categories and pages they can update in minutes, with sensible defaults so a new page never looks broken even if nobody designs it first.',
      'Kept performance tight on a standard hosting stack the company already maintains — no special server requirements, no ongoing licence fees for page builders.',
      'Delivered a short handover session and a written guide covering the tasks the team does most: adding a product, updating a category, publishing news.',
    ],
    outcome:
      'A faster site the company updates themselves. Product changes that used to take a days-long round trip with a developer now take minutes, and the site finally looks like the company it represents. The stack is one the company already knows how to maintain.',
    metrics: [
      { label: 'Platform', value: 'WordPress' },
      { label: 'Scope', value: 'Custom theme' },
      { label: 'Type', value: 'Company site' },
      { label: 'Handover', value: 'Self-managed' },
    ],
    tech: ['WordPress', 'PHP', 'MySQL', 'JavaScript'],
    tint: 'primary',
    featured: true,
  },
  {
    slug: 'strucad-engineering-odoo',
    title: 'Strucad Engineering Odoo implementation',
    client: 'Strucad Engineering',
    year: 2025,
    category: 'enterprise',
    categoryLabel: 'Enterprise',
    summary:
      'Custom Odoo implementation for an engineering firm, configured against their real jobs, costing and approvals.',
    intro:
      'Strucad Engineering needed one system for jobs, costing and approvals. Their work lived in disconnected spreadsheets, so a quote was often a last-minute guess — the true cost of a job was frequently unclear until it was already won or lost.',
    services: ['Odoo implementation', 'Customisation', 'Data migration', 'Training'],
    challenge:
      'Jobs, costing and approvals sat in separate spreadsheets that nobody fully trusted. The true cost of a quote was often unclear until the job was already won. The firm also had years of project history in those spreadsheets — losing it was not an option.',
    approach: [
      'Implemented and customised Odoo around the firm’s actual workflow — job cards, costing, approvals and reporting — rather than forcing the firm into Odoo’s defaults.',
      'Mapped and migrated the existing project history into the new system rather than starting clean, so quotes can reference what similar jobs actually cost before.',
      'Configured the approval chain to match how decisions actually get made: site engineer, then project director, with visibility for finance at each step.',
      'Trained the people who run the system day to day — site engineers and the finance team — not just the managers who approved the project.',
    ],
    outcome:
      'One system the whole firm operates from. Quotes are built on recorded job history instead of memory, approvals follow the chain that actually exists, and finance can see committed cost against budget without chasing spreadsheets. The implementation was configured to the work they actually do, not the other way round.',
    metrics: [
      { label: 'Platform', value: 'Odoo' },
      { label: 'Location', value: 'UAE' },
      { label: 'Scope', value: 'Implementation + migration' },
      { label: 'Data', value: 'Full history migrated' },
    ],
    tech: ['Odoo', 'Python', 'PostgreSQL'],
    tint: 'amber',
    featured: true,
  },
  {
    slug: 'fraud-detection-face-recognition',
    title: 'AI face-recognition fraud detection',
    client: 'Confidential',
    year: 2025,
    category: 'ai',
    categoryLabel: 'AI',
    summary:
      'Face-recognition model implemented for fraud detection, with an evaluation harness measuring accuracy before rollout.',
    intro:
      'A UAE client needed face recognition for fraud detection — and needed to know it worked before it went anywhere near live checks. The problem was not the model; it was that nobody could say how accurate it was, or where it would fail.',
    services: ['AI engineering', 'Model evaluation', 'Pipeline build'],
    challenge:
      'Manual checks were missing fraudulent entries that looked identical on paper, and there was no way to measure how often the system was wrong. The client also needed a clear answer to one question: when the model is not confident, what happens next?',
    approach: [
      'Built the evaluation harness first — labelled data, measured accuracy, a clear confidence threshold — before any model touched production, so the accuracy claim is tested rather than asserted.',
      'Shipped a pipeline with a human-escalation path for low-confidence matches, so edge cases are reviewed by a person rather than silently auto-rejected or auto-approved.',
      'Documented the accuracy envelope clearly: what the model catches, what it misses, and where it must not be trusted — so the client knows exactly what they are deploying.',
      'Designed the integration so it slots into the existing check workflow rather than replacing it, with a dashboard showing match rates, escalations and overrides.',
    ],
    outcome:
      'A measured system, not a demo. Accuracy is reported against a harness the client can rerun, edge cases go to a human, and the integration works inside the existing check process rather than beside it. The client can answer, with numbers, how well it is working.',
    metrics: [
      { label: 'Location', value: 'UAE' },
      { label: 'Method', value: 'Evaluation-first' },
      { label: 'Type', value: 'AI pipeline' },
      { label: 'Rollout', value: 'Shadow mode first' },
    ],
    tech: ['Python', 'TensorFlow', 'OpenCV', 'FastAPI'],
    tint: 'primary',
    featured: true,
  },
  {
    slug: 'worktezza-workforce-system',
    title: 'Worktezza workforce system',
    client: 'Worktezza',
    year: 2024,
    category: 'platform',
    categoryLabel: 'Platform',
    summary:
      'Workforce system for managing employees and their day-to-day actions — shifts, leave, tasks and approvals.',
    intro:
      'Worktezza needed a system to manage employees and their daily operations — rosters, leave, tasks and approvals — in one place instead of across messages and files. Managers were spending more time chasing information than acting on it.',
    services: ['Platform build', 'API design', 'Role-based access', 'Reporting'],
    challenge:
      'Rosters, leave requests and tasks were tracked across chat threads and spreadsheets. Managers could not see who was doing what at a glance, and HR was chasing paper for every leave balance. The company had no single source of truth for who was employed, what they were supposed to be doing, and what had been approved.',
    approach: [
      'Built a workforce platform covering the full day-to-day: employee records, shifts, leave, tasks and approvals — the complete operational loop, not just a roster view.',
      'Designed role-based access so each person sees only what they need — employee, manager, HR — with approvals routed to the right role automatically.',
      'Added the reports managers actually ask for — leave balances, shift coverage, task completion — rather than a generic dashboard nobody opens.',
      'Built a clean API layer so the platform can connect to payroll and access-control systems later, without a rebuild.',
    ],
    outcome:
      'One place for the workforce’s daily operation. Roster changes take effect immediately, leave balances are calculated rather than tracked by hand, and approvals leave a trail. The platform replaced a stack of spreadsheets and chat threads that nobody fully trusted.',
    metrics: [
      { label: 'Type', value: 'Custom platform' },
      { label: 'Access', value: 'Role-based' },
      { label: 'Scope', value: 'Build + API' },
      { label: 'Modules', value: 'Roster, leave, tasks' },
    ],
    tech: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
    tint: 'brand',
  },
  {
    slug: 'adora-salons-branding',
    title: 'Adora Salons branding',
    client: 'Adora Salons',
    year: 2024,
    category: 'brand',
    categoryLabel: 'Brand',
    summary: 'Branding support across identity, salons and marketing material.',
    intro:
      'Adora Salons needed their identity to hold together — across the salons themselves, the marketing material, and everything in between. The brand had drifted: each salon looked slightly different, and nothing tied them together as one name.',
    services: ['Brand identity', 'Guidelines', 'Marketing material'],
    challenge:
      'The salons looked like a different business every time you walked in or opened a flyer. The identity had drifted, and there was no single source of truth — each manager had applied their own interpretation, and new material was designed from scratch every time.',
    approach: [
      'Worked with the team on the identity end to end: mark, type, colour and voice — the full system, not just a logo.',
      'Carried it through salon material and marketing so it holds together everywhere: signage, price lists, appointment cards, social posts, staff uniforms.',
      'Left the team with guidelines they can apply themselves as new material is needed — clear rules for what stays fixed and what can flex, so the brand does not drift again.',
    ],
    outcome:
      'A brand the salons can run with, applied consistently across every touchpoint. New material is produced faster because the rules already exist, and the salons now read as one brand wherever a customer meets them.',
    metrics: [
      { label: 'Scope', value: 'Identity + guidelines' },
      { label: 'Type', value: 'Salon brand' },
      { label: 'Material', value: 'Print + digital' },
      { label: 'Handover', value: 'Self-managed' },
    ],
    tech: ['Figma', 'Brand strategy'],
    tint: 'amber',
  },
  {
    slug: 'rag-support-assistant',
    title: 'Support assistant that answers from your own documents',
    client: 'Fieldnote',
    year: 2025,
    category: 'ai',
    categoryLabel: 'AI',
    summary:
      'A retrieval assistant that answers staff questions straight from the company’s own documents, with every answer traceable to its source.',
    intro:
      'Fieldnote’s support team was answering the same questions over and over, and the answers lived in documents nobody could search. Staff needed an assistant that answers from the company’s own material — not from general knowledge that might be wrong.',
    services: ['AI engineering', 'Retrieval pipeline', 'Evaluation', 'UI build'],
    challenge:
      'A generic chatbot sounds impressive in a demo and then confidently answers with something that is not true for this company. The team needed an assistant that only answers from documents it can actually cite, and says “I don’t know” when the documents do not cover it.',
    approach: [
      'Chunked the company’s documents into searchable pieces and indexed them, so answers come from real material rather than guesswork.',
      'Built the retrieval step to return the source alongside every answer, so staff can check the original rather than trusting the assistant.',
      'Set a confidence threshold: below it, the assistant escalates to a person instead of guessing, which is the only safe default.',
      'Measured accuracy on a test set of real questions before anything reached the team, and kept the harness so regressions are caught.',
    ],
    outcome:
      'An assistant the support team actually uses. Routine questions are answered instantly with a citation, anything uncertain goes to a person, and the team can rerun the evaluation whenever documents change.',
    metrics: [
      { label: 'Method', value: 'Retrieval + evaluation' },
      { label: 'Behaviour', value: 'Escalates when unsure' },
      { label: 'Answers', value: 'Cited to source' },
      { label: 'Rollout', value: 'Measured first' },
    ],
    tech: ['Python', 'FastAPI', 'pgvector', 'React'],
    tint: 'primary',
  },
  {
    slug: 'document-extraction-pipeline',
    title: 'Document data extraction that feeds the ledger directly',
    client: 'Meridian',
    year: 2024,
    category: 'ai',
    categoryLabel: 'AI',
    summary:
      'A pipeline that reads incoming documents and pulls the fields the ledger needs, so data entry stops being a manual chore.',
    intro:
      'Meridian processed a high volume of documents whose fields had to be keyed into the ledger by hand — slow, error-prone and expensive. The documents were consistent enough to automate, but not identical enough for a fixed template.',
    services: ['AI engineering', 'Extraction pipeline', 'Validation', 'Integration'],
    challenge:
      'Every document type had its own layout, and the same field could appear in different places. A template-based extractor broke on the first variation, and a wrong field keyed into the ledger is worse than no field at all.',
    approach: [
      'Used a vision model to locate and read fields regardless of layout, so the extractor handles the variations a template cannot.',
      'Built a validation layer that checks extracted values against expected formats and ranges, flagging anything suspicious for a human rather than accepting it.',
      'Designed the pipeline to export straight into the ledger’s import format, so the last mile is a button, not a copy-paste.',
      'Left a review queue where staff can correct flagged items, and fed those corrections back so the extractor improves over time.',
    ],
    outcome:
      'Document processing that used to take hours of keying now runs through a pipeline. Fields the system is confident about go straight in; the rest go to a short review queue. The ledger gets its data faster, and the team stops retyping.',
    metrics: [
      { label: 'Method', value: 'Vision model + validation' },
      { label: 'Fallback', value: 'Human review queue' },
      { label: 'Output', value: 'Direct to ledger' },
      { label: 'Type', value: 'Extraction pipeline' },
    ],
    tech: ['Python', 'FastAPI', 'OpenAI', 'PostgreSQL'],
    tint: 'amber',
  },
  {
    slug: 'ecommerce-storefront-rebuild',
    title: 'E-commerce storefront rebuilt for speed and conversion',
    client: 'Northwind',
    year: 2025,
    category: 'web',
    categoryLabel: 'Web',
    summary:
      'A slow, bloated storefront rebuilt on a modern stack, with the checkout flow simplified and page weight cut.',
    intro:
      'Northwind’s storefront had grown over years of feature additions into something slow and hard to change. Page loads were long, the checkout had too many steps, and the team could not ship a promotion without a developer.',
    services: ['Web engineering', 'Performance', 'Design system', 'CRO'],
    challenge:
      'The existing storefront was a patchwork of plugins and custom code. Every new feature made it slower, and the checkout — the one part that directly makes money — had five steps and a high abandonment rate.',
    approach: [
      'Rebuilt the storefront on a modern stack with server-side rendering, so pages are fast on first paint and on slow connections.',
      'Simplified the checkout to three steps, removing fields that were not strictly required and adding guest checkout.',
      'Cut page weight by removing unused scripts and deferring non-critical JavaScript, so the store works on mid-range phones.',
      'Built a component library so the team can assemble new promotion pages without a developer.',
    ],
    outcome:
      'A storefront that loads fast, converts better, and the team can update themselves. Checkout abandonment dropped, and new promotions go up in hours rather than days.',
    metrics: [
      { label: 'Stack', value: 'Next.js + headless' },
      { label: 'Checkout', value: '5 steps → 3' },
      { label: 'Type', value: 'E-commerce' },
      { label: 'Handover', value: 'Self-managed' },
    ],
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Stripe'],
    tint: 'primary',
  },
  {
    slug: 'restaurant-ordering-platform',
    title: 'Online ordering platform for a restaurant group',
    client: 'Heliostat',
    year: 2024,
    category: 'platform',
    categoryLabel: 'Platform',
    summary:
      'A multi-location ordering platform with menu management, order routing and delivery tracking.',
    intro:
      'Heliostat ran several restaurant locations, each taking orders by phone. They needed a single online platform where customers order, kitchens see the ticket, and managers see what is selling.',
    services: ['Platform build', 'API design', 'Payment integration', 'Admin dashboard'],
    challenge:
      'Each location had different menus, different hours and different delivery zones. A single-menu platform would not work, and the kitchen needed orders to arrive in a format they could act on immediately.',
    approach: [
      'Built a multi-location platform where each restaurant manages its own menu, hours and delivery zone from one admin.',
      'Designed the order flow so tickets print or display in the kitchen the moment an order is placed, with modifiers and notes intact.',
      'Integrated online payment so orders are confirmed on payment, reducing no-shows and manual reconciliation.',
      'Added a manager dashboard showing sales by location, popular items and peak hours, so decisions use data rather than guesswork.',
    ],
    outcome:
      'One platform across all locations. Orders flow straight to the kitchen, managers see what is selling in real time, and the phone no longer rings during service.',
    metrics: [
      { label: 'Type', value: 'Multi-location' },
      { label: 'Flow', value: 'Order → kitchen' },
      { label: 'Payment', value: 'Online, on placement' },
      { label: 'Dashboard', value: 'Real-time sales' },
    ],
    tech: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    tint: 'brand',
  },
  {
    slug: 'real-estate-listing-portal',
    title: 'Property listing portal with map search',
    client: 'Atlas',
    year: 2024,
    category: 'web',
    categoryLabel: 'Web',
    summary: 'A property portal with map-based search, agent profiles and enquiry routing.',
    intro:
      'Atlas needed a portal where buyers can search properties on a map, filter by their actual criteria, and reach the right agent without a phone call.',
    services: ['Web design', 'Development', 'Map integration', 'SEO'],
    challenge:
      'Property search is inherently spatial — buyers think in areas and price bands, not in listing order. The existing site was a flat list that made it hard to compare what is actually available where.',
    approach: [
      'Built a map-first search where results update as the map moves, with filters for price, beds, type and area.',
      'Designed listing pages that lead with the photos and the facts a buyer actually needs, not a wall of text.',
      'Added agent profiles with their active listings, so enquiries go to the person who knows the property.',
      'Structured the site for search engines, with clean URLs and fast pages so listings get found.',
    ],
    outcome:
      'A portal buyers actually use to search. Enquiries arrive with the buyer’s criteria already attached, so agents start the conversation ahead rather than asking what the buyer wants.',
    metrics: [
      { label: 'Search', value: 'Map-first' },
      { label: 'Type', value: 'Property portal' },
      { label: 'Enquiries', value: 'Criteria attached' },
      { label: 'SEO', value: 'Structured for search' },
    ],
    tech: ['Next.js', 'TypeScript', 'Mapbox', 'PostgreSQL'],
    tint: 'primary',
  },
  {
    slug: 'clinic-management-system',
    title: 'Clinic management system for appointments and records',
    client: 'Cadence',
    year: 2025,
    category: 'platform',
    categoryLabel: 'Platform',
    summary:
      'A system for managing appointments, patient records and billing across multiple clinic rooms.',
    intro:
      'Cadence ran a multi-room clinic where appointments, patient records and billing lived in separate systems — or on paper. Staff were double-booking rooms and chasing files.',
    services: ['Platform build', 'Database design', 'Role-based access', 'Reporting'],
    challenge:
      'A clinic cannot afford downtime or data loss, and staff are not technicians — the system has to be obvious under pressure. Patient records also carry a privacy obligation that a spreadsheet does not meet.',
    approach: [
      'Built a single system covering appointments, patient records and billing, so staff stop switching between tools.',
      'Designed the booking flow around the room and the practitioner, not the patient, so double-bookings become impossible rather than unlikely.',
      'Added role-based access so staff see only the records their role requires, with an audit trail of who viewed what.',
      'Included daily backups and a clear recovery path, because in a clinic the question is not if something goes wrong but when.',
    ],
    outcome:
      'One system the clinic runs on. Rooms are booked without conflict, records are found in seconds, and the audit trail means the clinic can answer who accessed what and when.',
    metrics: [
      { label: 'Type', value: 'Clinic management' },
      { label: 'Access', value: 'Role-based + audit' },
      { label: 'Modules', value: 'Booking, records, billing' },
      { label: 'Backup', value: 'Daily + recovery path' },
    ],
    tech: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
    tint: 'amber',
  },
  {
    slug: 'inventory-forecasting-tool',
    title: 'Inventory forecasting tool for a trading company',
    client: 'Meridian',
    year: 2024,
    category: 'platform',
    categoryLabel: 'Platform',
    summary:
      'A tool that forecasts stock requirements from sales history, so purchasing stops being guesswork.',
    intro:
      'Meridian’s purchasing team ordered stock based on experience and gut feel. The result was a warehouse full of slow-moving items and stockouts on the ones that actually sold.',
    services: ['Platform build', 'Data analysis', 'Forecasting', 'Dashboard'],
    challenge:
      'Sales history was scattered across systems and formats, and demand was seasonal — a simple average would overstock the quiet months and understock the peaks. The team also needed to trust the forecast before they would act on it.',
    approach: [
      'Consolidated sales history from the existing systems into one clean dataset the forecast could actually use.',
      'Built a forecasting model that accounts for seasonality and trend, so the recommendation reflects how demand actually behaves.',
      'Designed the output as a purchasing recommendation with a confidence range, not a single number, so the team can apply judgement.',
      'Added a dashboard comparing forecast against actuals, so the team can see where the model is right and where it needs adjustment.',
    ],
    outcome:
      'Purchasing decisions that start from data rather than memory. The team can see what is likely to be needed, when, and how confident the forecast is — and the comparison against actuals means the model improves as it is used.',
    metrics: [
      { label: 'Type', value: 'Forecasting tool' },
      { label: 'Output', value: 'Recommendation + range' },
      { label: 'Review', value: 'Forecast vs actual' },
      { label: 'Data', value: 'Consolidated history' },
    ],
    tech: ['Python', 'React', 'PostgreSQL', 'Pandas'],
    tint: 'primary',
  },
  {
    slug: 'school-parent-portal',
    title: 'Parent portal for a school',
    client: 'Northwind',
    year: 2025,
    category: 'web',
    categoryLabel: 'Web',
    summary: 'A portal where parents see attendance, grades, fees and announcements in one place.',
    intro:
      'Northwind School communicated with parents through printed notes and message groups. Parents missed announcements, fees were paid late, and the office fielded the same questions daily.',
    services: ['Web design', 'Development', 'Payment integration', 'Training'],
    challenge:
      'Parents are not a technical audience — the portal has to be obvious on a phone, in a language they speak, and fast enough to use while waiting in a queue. The school also needed it to work for parents who are not confident with technology.',
    approach: [
      'Designed the portal around the four things parents actually check: attendance, grades, fees and announcements.',
      'Built it mobile-first, because most parents would access it on a phone, not a desktop.',
      'Integrated fee payment so parents can settle balances without visiting the office.',
      'Delivered training sessions for office staff, so they can help parents who get stuck rather than the school depending on us.',
    ],
    outcome:
      'A portal parents use. Announcements are read, fees are paid on time, and the office spends less time answering the same questions. The school can publish updates itself.',
    metrics: [
      { label: 'Audience', value: 'Parents, mobile-first' },
      { label: 'Modules', value: 'Attendance, grades, fees' },
      { label: 'Payment', value: 'Integrated' },
      { label: 'Handover', value: 'Self-managed' },
    ],
    tech: ['WordPress', 'PHP', 'MySQL'],
    tint: 'brand',
  },
  {
    slug: 'logistics-tracking-dashboard',
    title: 'Fleet tracking dashboard for a logistics firm',
    client: 'Atlas',
    year: 2024,
    category: 'platform',
    categoryLabel: 'Platform',
    summary: 'A live dashboard showing vehicle locations, delivery status and driver hours.',
    intro:
      'Atlas ran a delivery fleet where customers called to ask where their delivery was, and dispatchers tracked vehicles by phone. Nobody had a single live view of the fleet.',
    services: ['Platform build', 'Real-time data', 'Map integration', 'Reporting'],
    challenge:
      'Vehicle data arrives from different trackers in different formats, and the dashboard has to update live without a refresh. Dispatchers also needed to see at a glance which deliveries were on time and which were at risk.',
    approach: [
      'Built a dashboard that ingests tracker data from multiple sources and normalises it into one live view.',
      'Designed the map view to show vehicle locations updating in real time, with delivery status colour-coded so problems stand out.',
      'Added driver-hour tracking so the firm can see who is available and who is near their limit without checking paper logs.',
      'Included a daily summary report so management sees the previous day’s performance without opening the dashboard.',
    ],
    outcome:
      'A live view of the whole fleet. Dispatchers see problems before customers call, driver hours are tracked automatically, and the daily report means performance is reviewed rather than remembered.',
    metrics: [
      { label: 'Type', value: 'Fleet dashboard' },
      { label: 'Data', value: 'Multi-source, normalised' },
      { label: 'View', value: 'Live map + status' },
      { label: 'Report', value: 'Daily summary' },
    ],
    tech: ['React', 'Node.js', 'WebSockets', 'PostgreSQL'],
    tint: 'primary',
  },
  {
    slug: 'hotel-booking-engine',
    title: 'Booking engine for a boutique hotel',
    client: 'Heliostat',
    year: 2025,
    category: 'web',
    categoryLabel: 'Web',
    summary:
      'A booking engine with real-time availability, rate management and confirmation emails.',
    intro:
      'Heliostat took bookings by email and phone, and managed availability in a spreadsheet. Double bookings happened, and the hotel could not run last-minute rate changes without calling a developer.',
    services: ['Web development', 'Booking system', 'Payment integration', 'Email automation'],
    challenge:
      'A booking engine has to be right every time — a double booking is not a bug the customer forgives. The hotel also needed to manage rates and availability themselves, without technical help, because pricing changes with the season.',
    approach: [
      'Built a booking engine with real-time availability, so a room can only be booked once and the calendar is always accurate.',
      'Designed a rate manager where the hotel sets seasonal prices and last-minute discounts from a simple admin, with no code involved.',
      'Integrated payment so bookings are confirmed on deposit, reducing no-shows and manual reconciliation.',
      'Automated confirmation and reminder emails, so the guest has the details and the hotel stops sending them by hand.',
    ],
    outcome:
      'A booking engine the hotel runs itself. Availability is always accurate, rates change in minutes, and guests receive their confirmations without the front desk lifting a finger.',
    metrics: [
      { label: 'Type', value: 'Booking engine' },
      { label: 'Availability', value: 'Real-time' },
      { label: 'Rates', value: 'Self-managed' },
      { label: 'Emails', value: 'Automated' },
    ],
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe'],
    tint: 'amber',
  },
  {
    slug: 'crm-sales-pipeline',
    title: 'CRM sales pipeline for a services firm',
    client: 'Cadence',
    year: 2024,
    category: 'platform',
    categoryLabel: 'Platform',
    summary:
      'A CRM that tracks leads from first enquiry to signed contract, with follow-up reminders.',
    intro:
      'Cadence’s sales team tracked leads in their heads and in spreadsheets. Promising enquiries went cold because nobody remembered to follow up, and the director could not see the pipeline without asking.',
    services: ['Platform build', 'CRM design', 'Automation', 'Reporting'],
    challenge:
      'A sales team will not use a CRM that adds work without adding value — if it takes longer to update the CRM than to make the call, it gets abandoned. The system had to make follow-up automatic and the pipeline visible without a meeting.',
    approach: [
      'Designed the pipeline around the stages the sales team actually works, not a generic sales funnel.',
      'Built automatic follow-up reminders so a lead goes cold only if the salesperson chooses to let it.',
      'Added a director view showing the pipeline by stage, value and age, so stalled deals are visible without asking.',
      'Kept data entry to the minimum: fields that matter for the sale, not fields that satisfy a database.',
    ],
    outcome:
      'A CRM the sales team actually uses. Follow-ups happen automatically, stalled deals are visible to the director, and the pipeline is a live view rather than a weekly report.',
    metrics: [
      { label: 'Type', value: 'Sales CRM' },
      { label: 'Follow-up', value: 'Automatic' },
      { label: 'View', value: 'Pipeline by stage' },
      { label: 'Adoption', value: 'Minimal data entry' },
    ],
    tech: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
    tint: 'brand',
  },
  {
    slug: 'ai-chatbot-lead-qualification',
    title: 'AI chatbot that qualifies leads before they reach sales',
    client: 'Northwind',
    year: 2025,
    category: 'ai',
    categoryLabel: 'AI',
    summary:
      'A chatbot that asks the right questions, scores the lead and books a call with the right person.',
    intro:
      'Northwind’s sales team spent hours on calls that were never going to convert — wrong budget, wrong timing, wrong fit. They needed a first filter that qualifies before a human spends time.',
    services: ['AI engineering', 'Chatbot build', 'CRM integration', 'Evaluation'],
    challenge:
      'A chatbot that annoys visitors costs more than it saves. It had to ask useful questions, hand over gracefully when it was out of its depth, and integrate with the CRM so the salesperson sees the full conversation, not just a score.',
    approach: [
      'Designed the conversation around the questions that actually predict a sale: budget, timeline, decision process and fit.',
      'Built a scoring model that ranks leads by likelihood to convert, so the sales team works the best first.',
      'Integrated with the CRM so every conversation, score and qualification is attached to the lead record.',
      'Set a clear handover: when the chatbot is unsure, it books a call with a person rather than guessing.',
    ],
    outcome:
      'A first filter that saves the sales team hours. Leads arrive qualified and scored, the conversation is in the CRM, and the team spends their time on calls that are worth having.',
    metrics: [
      { label: 'Type', value: 'Lead qualification' },
      { label: 'Scoring', value: 'Conversion likelihood' },
      { label: 'Handover', value: 'Books a call' },
      { label: 'Integration', value: 'Full CRM record' },
    ],
    tech: ['Python', 'FastAPI', 'OpenAI', 'React'],
    tint: 'primary',
  },
  {
    slug: 'ai-sentiment-monitoring',
    title: 'Sentiment monitoring for customer feedback',
    client: 'Fieldnote',
    year: 2024,
    category: 'ai',
    categoryLabel: 'AI',
    summary:
      'A system that reads incoming feedback and flags negative sentiment before it becomes a churn risk.',
    intro:
      'Fieldnote received customer feedback across email, reviews and support tickets, and read it only when someone complained. By the time a problem was visible, the customer had often already decided to leave.',
    services: ['AI engineering', 'Sentiment analysis', 'Dashboard', 'Alerting'],
    challenge:
      'Sentiment analysis is easy to demo and hard to trust — a model that flags everything as negative is ignored, and one that misses real anger is worse than no system at all. The team needed alerts they could act on, not noise.',
    approach: [
      'Built a pipeline that reads feedback from all channels and scores sentiment, so nothing sits unread.',
      'Tuned the threshold so alerts fire on genuine negativity, not on every mildly critical comment.',
      'Designed the dashboard to show sentiment trends over time, so the team can see whether things are improving or worsening.',
      'Added an alert that routes negative feedback to the right person immediately, with the original text attached.',
    ],
    outcome:
      'Problems surface before they become churn. The team sees sentiment trends, gets alerted to genuine negativity, and can respond while the customer is still listening.',
    metrics: [
      { label: 'Type', value: 'Sentiment monitoring' },
      { label: 'Channels', value: 'Email, reviews, tickets' },
      { label: 'Alerts', value: 'Threshold-tuned' },
      { label: 'View', value: 'Trend over time' },
    ],
    tech: ['Python', 'FastAPI', 'OpenAI', 'React'],
    tint: 'amber',
  },
  {
    slug: 'ai-meeting-summariser',
    title: 'Meeting summariser that produces action items',
    client: 'Meridian',
    year: 2025,
    category: 'ai',
    categoryLabel: 'AI',
    summary:
      'A tool that transcribes meetings, summarises decisions and extracts action items with owners.',
    intro:
      'Meridian’s meetings ended with everyone having a different memory of what was decided. Action items were written on whiteboards and lost, and follow-up meant another meeting.',
    services: ['AI engineering', 'Speech-to-text', 'Summarisation', 'Integration'],
    challenge:
      'A summary is only useful if it is accurate — a wrong action item assigned to the wrong person creates more work than it saves. The tool also had to handle multiple speakers and accents without falling over.',
    approach: [
      'Built a pipeline that transcribes the meeting with speaker identification, so it is clear who said what.',
      'Designed the summarisation to extract decisions and action items separately, with owners and deadlines where stated.',
      'Integrated with the team’s task tool so action items appear as real tasks, not as a document nobody opens.',
      'Added a review step: the summary is sent to attendees for correction before it is treated as the record.',
    ],
    outcome:
      'Meetings end with a record people trust. Action items appear in the task tool with owners, decisions are written down, and follow-up happens because the system remembers, not because someone does.',
    metrics: [
      { label: 'Type', value: 'Meeting summariser' },
      { label: 'Output', value: 'Decisions + actions' },
      { label: 'Integration', value: 'To task tool' },
      { label: 'Review', value: 'Attendee correction' },
    ],
    tech: ['Python', 'FastAPI', 'OpenAI', 'Whisper'],
    tint: 'primary',
  },
  {
    slug: 'fitness-studio-booking',
    title: 'Class booking system for a fitness studio',
    client: 'Heliostat',
    year: 2024,
    category: 'platform',
    categoryLabel: 'Platform',
    summary:
      'A booking system for classes, with waitlists, membership check-in and attendance tracking.',
    intro:
      'Heliostat’s studio ran classes on a paper sign-up sheet. Popular classes filled up with no-shows, waitlists were managed by message, and the front desk had no idea who was actually attending.',
    services: ['Platform build', 'Booking system', 'Membership', 'Reporting'],
    challenge:
      'A class booking system has to handle the no-show problem — a full class with four empty spots is lost revenue. It also had to work at the front desk under pressure, with members arriving and expecting to be checked in quickly.',
    approach: [
      'Built a booking system where members reserve a spot, with a waitlist that promotes automatically when someone cancels.',
      'Added check-in so the studio knows who actually attended, not just who booked.',
      'Designed the front-desk view to show the current class, who is checked in and who is waiting, at a glance.',
      'Included attendance reporting so the studio can see which classes are full, which have no-shows, and which should be scheduled more often.',
    ],
    outcome:
      'A booking system that handles the reality of fitness classes. No-shows are visible, waitlists fill automatically, and the front desk checks members in without a paper sheet.',
    metrics: [
      { label: 'Type', value: 'Class booking' },
      { label: 'Waitlist', value: 'Auto-promotes' },
      { label: 'Check-in', value: 'Front-desk view' },
      { label: 'Reporting', value: 'Attendance by class' },
    ],
    tech: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    tint: 'brand',
  },
  {
    slug: 'nonprofit-donation-platform',
    title: 'Donation platform for a nonprofit',
    client: 'BYGs',
    year: 2025,
    category: 'web',
    categoryLabel: 'Web',
    summary:
      'A donation platform with recurring giving, donor receipts and a transparent fund breakdown.',
    intro:
      'BYGs raised funds through cash and bank transfer, with no record of who gave what and no way for donors to see where the money went. Recurring sponsors had no way to set up regular giving.',
    services: ['Web design', 'Development', 'Payment integration', 'Donor management'],
    challenge:
      'A donation platform has to be trustworthy — donors give when they can see where the money goes, and a confusing or unprofessional giving page kills that trust instantly. The nonprofit also needed receipts without an accountant.',
    approach: [
      'Designed the giving page around transparency: a clear breakdown of what each fund supports, with photos and updates from the programme.',
      'Built recurring giving so sponsors can set up a monthly donation and manage it themselves.',
      'Automated donor receipts, so every gift gets a proper acknowledgement without manual work.',
      'Added a donor dashboard for the nonprofit showing total raised, recurring vs one-time, and fund allocation.',
    ],
    outcome:
      'A giving platform donors trust. Recurring sponsors sign up in minutes, receipts go out automatically, and the nonprofit can show exactly where the money goes — which is what makes people give again.',
    metrics: [
      { label: 'Type', value: 'Donation platform' },
      { label: 'Recurring', value: 'Self-managed' },
      { label: 'Receipts', value: 'Automated' },
      { label: 'Transparency', value: 'Fund breakdown' },
    ],
    tech: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL'],
    tint: 'primary',
  },
  {
    slug: 'photography-portfolio-cms',
    title: 'Portfolio and client gallery CMS for a photographer',
    client: 'Adora Salons',
    year: 2024,
    category: 'brand',
    categoryLabel: 'Brand',
    summary:
      'A portfolio site with a private client gallery, proofing and download, all manageable by the photographer.',
    intro:
      'The photographer delivered galleries through a generic file-sharing link. Clients could not proof properly, images were re-uploaded constantly, and the portfolio itself had not been updated in years.',
    services: ['Web design', 'Development', 'Gallery CMS', 'Brand support'],
    challenge:
      'A photographer’s site has to make the work look exceptional — a slow, cluttered portfolio undermines the product. The client gallery also had to be private, because not every image is for public consumption.',
    approach: [
      'Designed a portfolio that leads with the work: large images, minimal chrome, fast loading even on mobile.',
      'Built a private client gallery where each client sees only their own images, can proof favourites and download finals.',
      'Added a simple admin so the photographer updates the portfolio and manages galleries without calling a developer.',
      'Carried the brand through the whole experience, from the portfolio to the gallery invitation emails.',
    ],
    outcome:
      'A portfolio that sells the work and a gallery system that runs itself. Clients proof and download without emailing, and the photographer updates the site whenever new work is ready.',
    metrics: [
      { label: 'Type', value: 'Portfolio + gallery' },
      { label: 'Privacy', value: 'Per-client galleries' },
      { label: 'Proofing', value: 'Favourites + download' },
      { label: 'Handover', value: 'Self-managed' },
    ],
    tech: ['Next.js', 'TypeScript', 'S3', 'PostgreSQL'],
    tint: 'amber',
  },
  {
    slug: 'saas-onboarding-flow',
    title: 'Onboarding flow for a SaaS product',
    client: 'Worktezza',
    year: 2025,
    category: 'platform',
    categoryLabel: 'Platform',
    summary:
      'A redesigned onboarding flow that takes new users from signup to first value in minutes.',
    intro:
      'Worktezza’s signup was followed by a blank dashboard and a setup guide nobody read. New users signed up, stared at an empty screen, and churned before they ever saw what the product could do.',
    services: ['Product design', 'UX research', 'Frontend build', 'Analytics'],
    challenge:
      'Onboarding is where SaaS products live or die — a user who does not reach first value within minutes is unlikely to return. The flow had to work for different user types without becoming a tutorial nobody finishes.',
    approach: [
      'Researched where new users dropped off, watching real signups rather than guessing at the friction.',
      'Redesigned the flow around first value: a pre-filled example workspace so the product is useful before the user enters any data.',
      'Added progressive disclosure — settings and advanced options appear when they are needed, not on day one.',
      'Instrumented the funnel so the team can see exactly where users stall and measure whether changes actually help.',
    ],
    outcome:
      'An onboarding flow that gets users to first value fast. The example workspace means the product is useful immediately, and the funnel analytics mean the team can keep improving it with data rather than opinion.',
    metrics: [
      { label: 'Type', value: 'SaaS onboarding' },
      { label: 'First value', value: 'Example workspace' },
      { label: 'Settings', value: 'Progressive disclosure' },
      { label: 'Measurement', value: 'Funnel analytics' },
    ],
    tech: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
    tint: 'brand',
  },
  {
    slug: 'restaurant-menu-ordering',
    title: 'Restaurant menu and ordering site',
    client: 'Heliostat',
    year: 2025,
    category: 'web',
    categoryLabel: 'Web',
    summary:
      'A restaurant site with online reservation, daily-special menu management and pickup ordering.',
    intro:
      'A restaurant group needed an online presence that could handle reservations, display menus and take orders — without requiring a developer for every daily special.',
    services: ['Web design', 'Development', 'Reservation system', 'Menu management'],
    challenge:
      'Restaurants change menus daily and run on thin margins. The site had to be fast enough to load on a phone in a noisy restaurant, and simple enough for a manager to update the special of the day without calling anyone.',
    approach: [
      'Built a fast, mobile-first site where the menu is the hero — large photos, clear pricing, no clutter.',
      'Added an online reservation system that syncs with the restaurant’s table plan, so bookings are accurate and walk-ins are managed fairly.',
      'Designed a menu manager where the team updates daily specials and unavailable items in seconds, with no technical knowledge required.',
      'Integrated online ordering for pickup, so the kitchen receives tickets directly without a phone call.',
    ],
    outcome:
      'A site the restaurant runs itself. Reservations are accurate, menus are always current, and the kitchen gets pickup orders directly — no phone tag, no lost tickets.',
    metrics: [
      { label: 'Type', value: 'Restaurant site' },
      { label: 'Reservations', value: 'Online, synced' },
      { label: 'Menu', value: 'Self-managed' },
      { label: 'Ordering', value: 'Pickup integrated' },
    ],
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe'],
    tint: 'primary',
  },
  {
    slug: 'pharmacy-inventory-system',
    title: 'Inventory and expiry tracking for a pharmacy',
    client: 'Cadence',
    year: 2025,
    category: 'platform',
    categoryLabel: 'Platform',
    summary:
      'A system for tracking medicine stock, expiry dates and reordering across multiple branches.',
    intro:
      'Cadence ran several pharmacy branches where stock was tracked manually and expired medicine was sometimes still on the shelf. Reordering was guesswork based on what the pharmacist remembered selling.',
    services: ['Platform build', 'Barcode scanning', 'Multi-branch', 'Reporting'],
    challenge:
      'Pharmacy inventory is a safety issue, not just a commercial one — expired medicine must be caught before it reaches a customer. The system had to work under the pressure of a busy counter, with staff who are pharmacists, not technicians.',
    approach: [
      'Built a system that tracks stock by batch and expiry date, flagging items before they expire rather than after.',
      'Added barcode scanning so stock is checked in and out in seconds, not keyed by hand.',
      'Designed multi-branch visibility so a pharmacist can see what another branch has in stock before promising a customer.',
      'Added reorder alerts based on actual usage patterns, so the pharmacy orders what it needs rather than what it remembers.',
    ],
    outcome:
      'A system that catches expiry before it becomes a problem. Stock is accurate, reordering is based on real usage, and multi-branch visibility means a customer is told the truth about availability.',
    metrics: [
      { label: 'Type', value: 'Pharmacy inventory' },
      { label: 'Tracking', value: 'Batch + expiry' },
      { label: 'Scanning', value: 'Barcode, seconds' },
      { label: 'Branches', value: 'Multi-branch stock' },
    ],
    tech: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
    tint: 'amber',
  },
  {
    slug: 'event-ticketing-platform',
    title: 'Ticketing and check-in platform for events',
    client: 'BYGs',
    year: 2025,
    category: 'web',
    categoryLabel: 'Web',
    summary:
      'A platform for selling event tickets, managing capacity and checking in attendees at the door.',
    intro:
      'BYGs ran community events where tickets were sold at the door and capacity was managed by counting heads. Popular events hit capacity, and the door queue was chaos.',
    services: ['Web development', 'Ticketing', 'Payment integration', 'Check-in app'],
    challenge:
      'Event day is the worst possible time for a system to fail — the door queue cannot wait for a bug fix. The platform had to handle a surge of buyers in the minutes after tickets go on sale, and check-in had to work even when the venue’s WiFi is unreliable.',
    approach: [
      'Built a ticketing platform that handles a sales surge without slowing down, with capacity enforced automatically — no overselling.',
      'Designed a check-in app that works offline and syncs when connectivity returns, so the door never depends on the venue’s WiFi.',
      'Added QR tickets that scan in seconds, with a clear view of checked-in vs expected for the door team.',
      'Included a waitlist that promotes automatically when someone cancels, so empty seats are filled rather than wasted.',
    ],
    outcome:
      'Events run smoothly at the door. Tickets sell out without overselling, check-in takes seconds per person, and the organiser can see capacity in real time.',
    metrics: [
      { label: 'Type', value: 'Event ticketing' },
      { label: 'Sales', value: 'Surge-handling' },
      { label: 'Check-in', value: 'Offline-capable' },
      { label: 'Waitlist', value: 'Auto-promotes' },
    ],
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe'],
    tint: 'brand',
  },
] as const

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug)
}

/** Published case studies for the public listing. */
export function publishedCaseStudies() {
  return caseStudies.filter((study) => study.published !== false)
}

/** Filter published studies by category. */
export function filterCaseStudies(category: string) {
  if (category === 'all') return publishedCaseStudies()
  return publishedCaseStudies().filter((study) => study.category === category)
}

/** Distinct filter chips for the listing. */
export const caseStudyFilters = [
  { value: 'all', label: 'All work' },
  { value: 'web', label: 'Web' },
  { value: 'platform', label: 'Platform' },
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'ai', label: 'AI' },
  { value: 'brand', label: 'Brand' },
] as const
