import type { ReactNode } from 'react'

import { Reveal } from '@/components/ui/reveal'
import { cn } from '@/lib/utils'

/**
 * FAQ list rendered with native `<details>` / `<summary>`.
 *
 * Progressive enhancement: with JavaScript disabled or before hydration, every
 * answer is already in the document and works as a plain disclosure. No state,
 * no client bundle.
 */
export function FaqList({
  items,
  className,
}: {
  items: readonly { question: string; answer: string }[]
  className?: string
}) {
  return (
    <div className={cn('divide-y divide-border border-y border-border', className)}>
      {items.map((item, index) => (
        <Reveal key={item.question} as="div" delay={index * 40} y={12}>
          <details className="group py-6">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-lg transition-colors hover:text-mint">
              {item.question}
              <span
                aria-hidden="true"
                className="mt-1 shrink-0 text-muted-foreground transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <div className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
              {item.answer}
            </div>
          </details>
        </Reveal>
      ))}
    </div>
  )
}

/** FAQ section with a heading column, used at the bottom of most pages. */
export function FaqSection({
  eyebrow = 'Questions',
  title,
  items,
  children,
}: {
  eyebrow?: string
  title: string
  items: readonly { question: string; answer: string }[]
  children?: ReactNode
}) {
  return (
    <section
      aria-labelledby="faq-heading"
      className="border-t border-border bg-muted/20 py-20 md:py-28"
    >
      <div className="container-page grid gap-12 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-20">
        <div>
          <p className="font-mono text-[0.7rem] tracking-[0.3em] text-mint uppercase">{eyebrow}</p>
          <h2 id="faq-heading" className="mt-6 text-3xl leading-tight sm:text-4xl">
            {title}
          </h2>
          {children ? <div className="mt-6">{children}</div> : null}
        </div>

        <FaqList items={items} />
      </div>
    </section>
  )
}
