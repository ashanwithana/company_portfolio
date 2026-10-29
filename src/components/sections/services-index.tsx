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
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
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
 * Services index: a vertical list of subjects beside a single reading panel.
 *
 * It is an ARIA tabs pattern. The list is a vertical tablist with a roving
 * tabindex (Up/Down/Home/End move between subjects), and every panel stays in
 * the DOM stacked in one grid cell, so the reading area never changes height
 * when you switch. Inactive panels are hidden from sight and from assistive
 * technology with `inert`; the active one fades in.
 *
 * The reading panel sits on the hero's silk field, so the section shares the
 * page's one image rather than introducing a second ground colour. Layout is driven by container width, not
 * viewport, so it reflows correctly wherever the section is placed.
 */
export function ServicesIndex({ items }: { items: readonly ServicesIndexItem[] }) {
  const baseId = React.useId()
  const [active, setActive] = React.useState(0)
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([])

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
    <div className="@container" data-services-index>
      <div className="grid min-w-0 @[640px]:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        <div
          role="tablist"
          aria-label="Explore our services"
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
          className="flex min-w-0 flex-col @[640px]:pr-7 @[1000px]:pr-11"
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
                className={cn(
                  'group flex min-h-[54px] w-full cursor-pointer items-center justify-between gap-5 border-t border-border-strong py-[13px] text-left text-lg font-light tracking-[-0.02em] transition-colors duration-300 last:border-b @[640px]:min-h-[82px] @[640px]:flex-1 @[640px]:py-[22px] @[640px]:text-[clamp(20px,2.6cqw,29px)] @[1000px]:min-h-[100px]',
                  selected ? 'text-foreground' : 'text-foreground/55 hover:text-foreground',
                )}
              >
                <span>{item.title}</span>
                <Arrow
                  className={cn(
                    'transition-opacity duration-300',
                    selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                  )}
                />
              </button>
            )
          })}
        </div>

        <div className="relative isolate mt-5 grid min-w-0 overflow-hidden border border-border text-foreground @[640px]:mt-0">
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
                  'col-start-1 row-start-1 flex min-w-0 flex-col px-6 pt-[27px] pb-[19px] transition-opacity duration-500 @[640px]:min-h-[370px] @[640px]:px-[30px] @[640px]:pt-[34px] @[640px]:pb-[25px] @[1000px]:min-h-[440px] @[1000px]:px-[42px] @[1000px]:pt-11 @[1000px]:pb-[31px]',
                  selected ? 'opacity-100' : 'pointer-events-none opacity-0',
                )}
              >
                <h3 className="max-w-[13ch] text-[clamp(2rem,8.8cqw,3.4rem)] leading-[1.04] font-light tracking-[-0.035em] text-balance @[640px]:text-[clamp(2.3rem,4.8cqw,3.5rem)] @[1000px]:text-[3.8rem]">
                  {item.title}
                </h3>
                <p className="mt-[27px] max-w-[38ch] text-[clamp(17px,4.6cqw,21px)] leading-[1.55] tracking-[-0.015em] text-foreground/70 @[640px]:mt-[35px] @[640px]:text-[clamp(18px,2cqw,22px)] @[1000px]:mt-11">
                  {item.summary}
                </p>

                <div className="mt-auto pt-8 @[640px]:pt-10">
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
                    <Arrow />
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
