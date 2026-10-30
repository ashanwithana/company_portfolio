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
    <div className={cn('border-t border-border-strong', className)}>
      {items.map((item, index) => (
        <Reveal key={item.question} as="div" delay={index * 40} y={12}>
          <details className="group border-b border-border">
            <summary className="flex cursor-pointer list-none items-start gap-5 py-6 transition-colors hover:text-foreground md:gap-8">
              <span className="pt-1.5 font-mono text-[10px] tracking-[0.25em] text-muted-foreground">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="max-w-2xl flex-1 text-xl leading-snug font-light tracking-tight text-foreground/90 group-open:text-foreground md:text-2xl">
                {item.question}
              </span>
              <span
                aria-hidden="true"
                className="mt-1 shrink-0 text-2xl leading-none font-thin text-muted-foreground transition-transform duration-300 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <div className="max-w-2xl pb-8 pl-[calc(2.5rem+1.25rem)] leading-relaxed font-light text-muted-foreground md:pl-[calc(2.5rem+2rem)]">
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
    <section aria-labelledby="faq-heading" className="relative overflow-hidden py-24 md:py-28">
      <div className="relative container-page grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-20">
        <div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
              {eyebrow}
            </span>
            <span aria-hidden="true" className="h-px max-w-[120px] flex-1 bg-border-strong" />
          </div>

          <h2
            id="faq-heading"
            className="mt-6 text-3xl leading-[1.05] font-light tracking-tight md:text-5xl"
          >
            {title}
          </h2>

          {children ? <div className="mt-6">{children}</div> : null}
        </div>

        <FaqList items={items} />
      </div>
    </section>
  )
}
