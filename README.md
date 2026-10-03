# Northlight Studio — Company Website

A production-ready multi-page company website built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS v4. Originally recreated from the design of [nikhilkumar.codes](https://nikhilkumar.codes), then transformed into a full company site for a fictional product studio ("Northlight" — rename in one file, see below).

## Pages

| Route                            | Content                                                                                                 |
| -------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `/`                              | Home — WebGL hero, practice tracks, services, work, clients, process, latest insight                    |
| `/services` + `/services/[slug]` | Service index and detail pages                                                                          |
| `/enterprise`                    | Enterprise practice — Odoo/Dynamics/SAP/Salesforce, comparison table, migration checklist, case studies |
| `/ai`                            | AI practice — RAG patterns, model selection, cost model, when-not-to-use, case studies                  |
| `/work` + `/work/[slug]`         | Filterable case-study index and detail pages                                                            |
| `/about`                         | Studio, values, team, milestones, platforms and models                                                  |
| `/insights` + `/insights/[slug]` | Technical notes index and article pages                                                                 |
| `/careers` + `/careers/[slug]`   | Roles by department and role detail with JobPosting schema                                              |
| `/contact`                       | Enquiry form (Server Action), direct details, FAQs                                                      |
| `/privacy`, `/accessibility`     | Legal pages                                                                                             |

## Highlights

- **Cookie-based theming** — the theme is resolved on the server and rendered into `<html class>`, so there is no flash of the wrong theme and no hydration mismatch.
- **Zero hydration warnings** — verified in-browser across all pages.
- **WebGL hero** — a single cheap fragment shader (orbital rings + aurora field): no scene graph, no 150 kB renderer, pauses off-screen, static fallback for reduced motion.
- **SEO** — canonical URLs, Open Graph, sitemap, robots, JSON-LD (Organization, Article, BlogPosting, JobPosting, BreadcrumbList, FAQPage).
- **Accessible** — semantic landmarks, skip link, keyboard-navigable ⌘K palette, visible focus rings, `prefers-reduced-motion` honoured throughout.
- **Typed content layer** — all copy lives in `src/content`, decoupled from components and validated by 84 unit tests.
- **Single-file rename** — company name, domain, email, address and socials all live in `src/content/site.ts`.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional
npm run dev                  # http://localhost:3000
```

## Scripts

| Script              | Purpose                                    |
| ------------------- | ------------------------------------------ |
| `npm run dev`       | Start the dev server                       |
| `npm run build`     | Production build                           |
| `npm start`         | Serve the production build                 |
| `npm run lint`      | ESLint (flat config, React Compiler rules) |
| `npm run typecheck` | `tsc --noEmit`                             |
| `npm run test`      | Vitest unit tests                          |
| `npm run format`    | Prettier (with Tailwind class sorting)     |
| `npm run check`     | typecheck + lint + format check            |

## Project structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout: fonts, metadata, theme, landmarks
│   ├── page.tsx                # Home — composes hero, practices, services, work, …
│   ├── services/               # Service index + detail (specialist tracks redirect)
│   ├── enterprise/             # ERP practice page
│   ├── ai/                     # AI practice page
│   ├── work/[slug]/            # Case-study detail
│   ├── insights/[slug]/        # Article detail
│   ├── careers/[slug]/         # Role detail
│   ├── contact/                # Enquiry form + FAQs
│   ├── actions/forms.ts        # Contact + newsletter Server Actions
│   ├── opengraph-image.tsx     # Server-rendered OG card
│   └── sitemap.ts / robots.ts  # Metadata routes
├── components/
│   ├── providers/              # Cookie-backed theme provider
│   ├── layout/                 # Header, footer, command palette, breadcrumbs
│   ├── sections/               # Hero, grids, forms
│   ├── seo/                    # FAQPage JSON-LD
│   └── ui/                     # Primitives (hero-visual, reveal, faq, …)
├── content/                    # All site copy as typed, testable data
│   ├── site.ts                 # ← rename the company here
│   ├── services.ts / enterprise.ts / ai.ts
│   ├── case-studies.ts / roles.ts / company.ts / faqs.ts
│   └── posts-index.ts + post-bodies/
├── hooks/                      # useMediaQuery, useCopyToClipboard, …
└── lib/                        # cn(), theme constants, zod validation
```

## Design tokens

Colours are authored in **OKLCH** so lightness is perceptually uniform and contrast holds across both themes. Tokens live in `src/app/globals.css` under `@theme inline` and are consumed as Tailwind utilities (`bg-background`, `text-muted-foreground`, `bg-coral`, …).

## Contact form

Posts to a **Server Action** (`src/app/actions/forms.ts`). One Zod schema validates on both sides; errors render per-field against `aria-invalid`/`aria-describedby`. A honeypot blocks naive bots. Set `CONTACT_FORM_ENDPOINT` (and `NEWSLETTER_ENDPOINT` for the footer form) to enable delivery — without them the actions fail loudly in production and no-op in development, never silently dropping enquiries.

## Deployment

1. Set `NEXT_PUBLIC_SITE_URL` to the production origin.
2. Set `CONTACT_FORM_ENDPOINT` / `NEWSLETTER_ENDPOINT` for live forms.
3. `npm run build && npm start`
