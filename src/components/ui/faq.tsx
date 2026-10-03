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
    <div className={cn('border-t border-border', className)}>
      {items.map((item, index) => (
        <Reveal key={item.question} as="div" delay={index * 40} y={12}>
          <details className="group border-b border-border">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-8 py-6 text-lg leading-snug transition-colors hover:text-coral">
              <span className="max-w-2xl">{item.question}</span>
              <span
                aria-hidden="true"
                className="mt-1 shrink-0 font-mono text-xl leading-none text-coral transition-transform duration-300 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <div className="max-w-2xl pb-7 leading-relaxed text-muted-foreground">
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
      <div
        className="pointer-events-none absolute inset-0 dot-grid mask-fade-radial opacity-50"
        aria-hidden="true"
      />

      <div className="relative container-page grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-20">
        <div>
          <p className="flex items-center gap-3 label text-muted-foreground">
            <span aria-hidden="true">[</span>
            <span className="text-coral">{eyebrow}</span>
            <span aria-hidden="true">]</span>
          </p>

          <h2 id="faq-heading" className="mt-6 display-md">
            {title}
          </h2>

          {children ? <div className="mt-6">{children}</div> : null}
        </div>

        <FaqList items={items} />
      </div>
    </section>
  )
}
