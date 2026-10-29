'use client'

import Link from 'next/link'
import * as React from 'react'

import { SilkBackground } from '@/components/ui/silk-background'
import { cn } from '@/lib/utils'

export type ServicesIndexItem = {
  slug: string
  title: string
  summary: string
  href: string
  /** Short list of tools or deliverables shown under the description. */
  tags: readonly string[]
}

function Arrow({ className }: { className?: string }) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}

/**
 * A service title in the nav style: uppercase, every word thin except the last,
 * which is bold.
 */
function TitleWords({ title }: { title: string }) {
  const words = title.split(' ')
  return (
    <>
      {words.map((word, index) => (
        <React.Fragment key={`${word}-${index}`}>
          {index > 0 ? ' ' : null}
          <span
            className={cn('inline-block', index === words.length - 1 ? 'font-bold' : 'font-thin')}
          >
            {word}
          </span>
        </React.Fragment>
      ))}
    </>
  )
}

/**
 * Services index: very large service names on the left, a detail panel on the
 * right.
 *
 * It is an ARIA tabs pattern. The names are a vertical tablist with a roving
 * tabindex (Up/Down/Home/End move between them), and every panel stays in the
 * DOM stacked in one grid cell so the panel never changes height when you
 * switch. Inactive panels are hidden from sight and from assistive technology
 * with `inert`.
 *
 * Type size is the smaller of a width-based and a height-based value, so the
 * names are as large as the screen allows without a row ever wrapping or the
 * list outgrowing the height it is given. The panel sits on the hero's silk
 * field. Layout is driven by container width, so the section reflows wherever
 * it is placed: stacked below 1000px, side by side above.
 */
export function ServicesIndex({ items }: { items: readonly ServicesIndexItem[] }) {
  const baseId = React.useId()
  const [active, setActive] = React.useState(0)
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([])
  const total = String(items.length).padStart(2, '0')

  const select = (index: number, focus = false) => {
    const next = (index + items.length) % items.length
    setActive(next)
    if (focus) tabRefs.current[next]?.focus()
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault()
        select(active + 1, true)
        break
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault()
        select(active - 1, true)
        break
      case 'Home':
        event.preventDefault()
        select(0, true)
        break
      case 'End':
        event.preventDefault()
        select(items.length - 1, true)
        break
    }
  }

  return (
    <div className="@container h-full" data-services-index>
      <div className="grid min-w-0 gap-6 @[1000px]:h-full @[1000px]:grid-cols-12 @[1000px]:grid-rows-[minmax(0,1fr)] @[1000px]:gap-x-8">
        <div
          role="tablist"
          aria-label="Explore our services"
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
          className="flex min-w-0 flex-col @[1000px]:col-span-8 @[1000px]:h-full @[1000px]:justify-between"
        >
          {items.map((item, index) => {
            const selected = index === active
            return (
              <button
                key={item.slug}
                ref={(el) => {
                  tabRefs.current[index] = el
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${index}`}
                aria-controls={`${baseId}-panel-${index}`}
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(index)}
                className="group flex w-full cursor-pointer items-center gap-4 py-2 text-left @[1000px]:gap-6 @[1000px]:py-0"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'w-6 shrink-0 font-mono text-[10px] tracking-[0.2em] tabular-nums transition-colors duration-300 @[1000px]:w-8',
                    selected
                      ? 'text-foreground'
                      : 'text-muted-foreground group-hover:text-foreground',
                  )}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                <span className="relative block min-w-0 text-[clamp(1.6rem,8cqw,3.4rem)] leading-[0.95] tracking-tighter uppercase @[1000px]:text-[clamp(1.6rem,min(4.3cqw,7.4svh),5.4rem)] @[1000px]:leading-[0.9]">
                  {/* Hairline outline; the solid copy below is revealed over it. The
                      fill is the page ground, painted over the inner half of a 2px
                      stroke, so overlapping glyph strokes are hidden and 1px of
                      outline remains. */}
                  <span
                    aria-hidden="true"
                    className="block text-background [-webkit-text-stroke:2px_color-mix(in_oklab,var(--foreground)_40%,transparent)] [paint-order:stroke_fill]"
                  >
                    <TitleWords title={item.title} />
                  </span>
                  <span
                    className={cn(
                      'absolute inset-0 block transition-[clip-path] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]',
                      selected
                        ? '[clip-path:inset(0_0_0_0)]'
                        : '[clip-path:inset(0_100%_0_0)] group-hover:[clip-path:inset(0_0_0_0)]',
                    )}
                  >
                    <TitleWords title={item.title} />
                  </span>
                </span>

                <Arrow
                  className={cn(
                    'text-2xl transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] @[1000px]:text-4xl',
                    selected
                      ? 'translate-x-0 opacity-100'
                      : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100',
                  )}
                />
              </button>
            )
          })}
        </div>

        <div className="relative isolate grid min-w-0 overflow-hidden border border-border text-foreground @[1000px]:col-span-4 @[1000px]:h-full @[1000px]:grid-rows-[minmax(0,1fr)]">
          {/* The hero's silk field, dimmed, with a scrim toward the bottom so the
              tag row and link stay readable wherever the folds fall. */}
          <SilkBackground className="-z-10 opacity-60" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-background/80 via-background/20 to-transparent"
          />
          {items.map((item, index) => {
            const selected = index === active
            return (
              <div
                key={item.slug}
                role="tabpanel"
                id={`${baseId}-panel-${index}`}
                aria-labelledby={`${baseId}-tab-${index}`}
                inert={!selected}
                className={cn(
                  'col-start-1 row-start-1 flex min-h-[22rem] min-w-0 flex-col p-6 transition-opacity duration-500 @[1000px]:min-h-0 @[1000px]:p-8',
                  selected ? 'opacity-100' : 'pointer-events-none opacity-0',
                )}
              >
                <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase tabular-nums">
                  {String(index + 1).padStart(2, '0')} / {total}
                </p>

                <h3 className="mt-5 text-2xl leading-tight font-light tracking-[-0.03em] text-balance @[1000px]:text-[clamp(1.5rem,2.4cqw,2.2rem)]">
                  {item.title}
                </h3>
                <p className="mt-4 max-w-[34ch] text-[17px] leading-[1.55] tracking-[-0.01em] text-foreground/70 @[1000px]:text-[clamp(16px,1.5cqw,20px)]">
                  {item.summary}
                </p>

                <div className="mt-auto pt-8">
                  <ul
                    aria-label={`${item.title} technologies`}
                    className="mb-5 flex flex-wrap gap-x-[18px] gap-y-2 text-xs leading-normal text-foreground/60"
                  >
                    {item.tags.map((tag) => (
                      <li key={tag} className="flex items-center gap-[7px]">
                        <span aria-hidden="true" className="size-[3px] bg-current" />
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={item.href}
                    aria-label={`Explore ${item.title}`}
                    tabIndex={selected ? 0 : -1}
                    className="group/link flex min-h-[52px] items-center justify-between gap-[18px] border-t border-foreground/25 pt-3.5 pb-[5px] text-[13px] leading-snug"
                  >
                    <span className="decoration-1 underline-offset-4 group-hover/link:underline">
                      Explore {item.title}
                    </span>
                    <Arrow className="text-lg" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
