# Portfolio

A production-ready developer portfolio built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS v4. Recreated from the design of [nikhilkumar.codes](https://nikhilkumar.codes), rebuilt on a modern stack with a real design-token system, server-rendered theming and full accessibility support.

## Highlights

- **Static-first rendering** — every route is prerendered; the only dynamic work is reading the theme cookie in the root layout.
- **No flash-of-wrong-theme** — the theme is resolved on the server and rendered into `<html class>`, so the first byte of HTML is already correct.
- **Zero console errors** — hydration-safe by construction; no `suppressHydrationWarning` crutches.
- **Accessible** — semantic landmarks, a skip link, keyboard-navigable command palette, visible focus rings, and `prefers-reduced-motion` honoured throughout.
- **Typed content layer** — all copy lives in `src/content`, decoupled from components and validated by tests.
- **Small bundle** — no WebGL runtime, no animation framework for simple motion, no icon library.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional
npm run dev                  # http://localhost:3000
```

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (flat config, React Compiler rules) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest unit tests |
| `npm run format` | Prettier (with Tailwind class sorting) |
| `npm run check` | typecheck + lint + format check |

## Project structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout: fonts, metadata, theme, landmarks
│   ├── page.tsx                # Composes the five content sections
│   ├── actions/contact.ts      # Server Action for the contact form
│   ├── opengraph-image.tsx     # Server-rendered OG card
│   ├── robots.ts / sitemap.ts  # Metadata routes
│   └── globals.css             # Tailwind v4 @theme design tokens
├── components/
│   ├── providers/              # Theme provider (cookie-backed)
│   ├── layout/                 # Header, footer, command palette, progress bar
│   ├── sections/               # Hero, About, Work, Skills, Timeline, Contact
│   └── ui/                     # Reusable primitives
├── content/                    # All site copy as typed, testable data
├── hooks/                      # useMediaQuery, useCountUp, useSmoothScroll, …
├── lib/                        # cn(), theme constants, zod validation
└── ...
```

## Design tokens

Colours are authored in **OKLCH** so lightness is perceptually uniform and contrast holds across both themes. Tokens live in `src/app/globals.css` under `@theme inline` and are consumed as Tailwind utilities (`bg-background`, `text-muted-foreground`, `bg-coral`, …).

The theme is a class on `<html>`:

- `:root` — light theme
- `.dark` — dark theme

Both are defined with CSS custom properties, so a component never branches on the theme in JavaScript.

## Theming approach

The common approach — a blocking `<script>` that sets a class on `<html>` before paint — fights React, which reconciles attributes on `<html>` during hydration and reverts the change.

Instead, the preference is stored in a **cookie**, read in the root layout, and rendered server-side:

```ts
const cookieStore = await cookies()
const theme = parseTheme(cookieStore.get(THEME_COOKIE)?.value)
return <html className={theme}>…
```

Because the server and the browser agree on the very first render, there is no flash *and* no hydration mismatch. Toggling writes the cookie and updates the DOM; a `BroadcastChannel` keeps other tabs in sync.

## Contact form

The form posts to a **Server Action** (`src/app/actions/contact.ts`).

- One Zod schema (`src/lib/validation.ts`) validates on both sides. The client pass is UX; the server pass is the actual trust boundary.
- Errors are returned per-field and rendered against `aria-invalid` / `aria-describedby`.
- A honeypot field plus a `max(0)` constraint blocks naive bots.
- Set `CONTACT_FORM_ENDPOINT` to enable delivery (any JSON POST endpoint, e.g. Resend or Web3Forms). Without it, the action fails loudly rather than pretending to succeed.

## Accessibility

- Semantic `<header>`, `<nav>`, `<main>`, `<section aria-label>`, `<footer>`
- Skip-to-content link, visible focus rings, `:focus-visible` styling
- ⌘K / Ctrl+K command palette with roving focus (built on `cmdk`)
- `prefers-reduced-motion` respected by the typewriter, counters, marquees, reveals and custom cursor
- Custom cursor only mounts on `(pointer: fine)` devices
- Status messages use `role="status"` with `aria-live="polite"`

## Deployment

Deploys to any Node host or Vercel.

1. Set `NEXT_PUBLIC_SITE_URL` to the production origin (used for canonical URLs, OG tags, sitemap and robots).
2. Set `CONTACT_FORM_ENDPOINT` if you want the form to deliver mail.
3. `npm run build && npm start`
