/**
 * Article cover photography.
 *
 * Every post ships a real cover image in `public/covers/` in two crops: a wide
 * 16:10 for list thumbnails and the article hero, and a 4:5 portrait for the
 * featured card on the index. Files are named after the post slug so the two
 * stay in step — `slug.webp` and `slug-portrait.webp`.
 *
 * All nine images are CC0 (public-domain dedication) sourced through the
 * Openverse API from StockSnap, Rawpixel, Flickr and Wikimedia Commons, then
 * graded to the site palette: desaturated, contrast-pushed, tinted along a
 * pink→violet ramp and vignetted so photography sits on the dark ground
 * instead of punching a bright hole in it. Provenance is recorded per image
 * below for audit purposes; CC0 requires no attribution.
 *
 * Swap `coverFor` for an object holding CMS-managed assets when real
 * commissioned photography exists.
 */

import { existsSync } from 'node:fs'
import path from 'node:path'

export type Cover = {
  /** Wide 16:10 crop, 1600×1000. */
  src: string
  /** Portrait 4:5 crop, 880×1100. */
  portraitSrc: string
  /** Describes what is actually in the photograph. */
  alt: string
  /** Original creator/source, CC0 — kept for the credit line. */
  credit: string
}

const WIDE = { width: 1600, height: 1000 } as const
const PORTRAIT = { width: 880, height: 1100 } as const

export const coverSize = WIDE
export const coverPortraitSize = PORTRAIT

const covers: Record<string, Cover> = {
  'rag-vs-finetuning': {
    src: '/covers/rag-vs-finetuning.webp',
    portraitSrc: '/covers/rag-vs-finetuning-portrait.webp',
    alt: 'A blue-lit server aisle receding into the dark of a data centre',
    credit: 'Rawpixel, CC0',
  },
  'odoo-vs-dynamics-365': {
    src: '/covers/odoo-vs-dynamics-365.webp',
    portraitSrc: '/covers/odoo-vs-dynamics-365-portrait.webp',
    alt: 'Hands typing on a laptop showing an analytics chart, coffee beside it',
    credit: 'StockSnap, CC0',
  },
  'salesforce-implementation-pitfalls': {
    src: '/covers/salesforce-implementation-pitfalls.webp',
    portraitSrc: '/covers/salesforce-implementation-pitfalls-portrait.webp',
    alt: 'A team working around a wooden table covered in laptops and notebooks',
    credit: 'StockSnap, CC0',
  },
  'odoo-implementation-guide': {
    src: '/covers/odoo-implementation-guide.webp',
    portraitSrc: '/covers/odoo-implementation-guide-portrait.webp',
    alt: 'Warehouse racking stacked high with palletised stock',
    credit: 'Rawpixel, CC0',
  },
  'rag-evaluation-checklist': {
    src: '/covers/rag-evaluation-checklist.webp',
    portraitSrc: '/covers/rag-evaluation-checklist-portrait.webp',
    alt: 'Writing in a notebook at a desk next to an open laptop',
    credit: 'Flickr, CC0',
  },
  'migration-not-rewrite': {
    src: '/covers/migration-not-rewrite.webp',
    portraitSrc: '/covers/migration-not-rewrite-portrait.webp',
    alt: 'A building wrapped in scaffolding mid-construction',
    credit: 'Fons Heijnsbroek / Flickr, CC0',
  },
  'measuring-performance': {
    src: '/covers/measuring-performance.webp',
    portraitSrc: '/covers/measuring-performance-portrait.webp',
    alt: 'A stopwatch face filling the frame, second hand mid-sweep',
    credit: 'StockSnap, CC0',
  },
  'evaluating-ai-features': {
    src: '/covers/evaluating-ai-features.webp',
    portraitSrc: '/covers/evaluating-ai-features-portrait.webp',
    alt: 'Operators monitoring a wall of screens in a control room',
    credit: 'Wikimedia Commons, CC0',
  },
  'design-systems-that-adopted': {
    src: '/covers/design-systems-that-adopted.webp',
    portraitSrc: '/covers/design-systems-that-adopted-portrait.webp',
    alt: 'Colour swatch fans spread open across a tabletop',
    credit: 'StockSnap, CC0',
  },
}

/**
 * Cover for a post, or `undefined` when the assets are absent.
 *
 * The filesystem check keeps the registry honest: a slug can be added to the
 * index before its photography is exported, and rendering a broken image is
 * worse than falling back to the generated placeholder.
 */
export function coverFor(slug: string): Cover | undefined {
  const cover = covers[slug]
  if (!cover) return undefined

  const publicDir = path.join(process.cwd(), 'public')
  const wide = path.join(publicDir, cover.src.slice(1))
  const portrait = path.join(publicDir, cover.portraitSrc.slice(1))

  return existsSync(wide) && existsSync(portrait) ? cover : undefined
}
