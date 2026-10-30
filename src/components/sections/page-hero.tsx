import { HairlineGrid } from '@/components/ui/hairline-grid'
import { HeadlineReveal } from '@/components/ui/headline-reveal'

type PageHeroItem = {
  /** Index shown beside the term, e.g. "01". */
  index: string
  label: string
  /** In-page anchor the row links to. */
  href: string
}

type PageHeroProps = {
  /** Numbered section label, e.g. "01 / Discipline". */
  label: string
  /** Headline; `\n` breaks the line. The last line is set bold over a thin first. */
  title: string
  /** One sentence under the headline. */
  lede: string
  /** The section's own terms, listed as a linked index on the right. */
  items?: readonly PageHeroItem[]
  /** Heading for the index. */
  itemsLabel?: string
}

/**
 * An inner-page hero. Unlike the home hero it has no silk field and is not
 * centred: the headline sits left and a linked index of the section's own terms
 * runs down the right, divided by hairlines, so the page opens as a table of
 * contents rather than a second banner. The hairline grid is shared with the
 * home hero so both still read as one family.
 */
export function PageHero({ label, title, lede, items = [], itemsLabel = 'Index' }: PageHeroProps) {
  return (
    <section
      aria-labelledby="page-hero-title"
      className="relative overflow-hidden border-b border-border pt-32 pb-16 md:pt-44 md:pb-24"
    >
      <HairlineGrid />

      <div className="relative z-20 mx-auto grid w-full max-w-[1600px] gap-14 px-4 md:px-8 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <div className="mb-8 flex items-center gap-4 md:mb-10">
            <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
              {label}
            </span>
            <span aria-hidden="true" className="h-px max-w-[160px] flex-1 bg-border-strong" />
          </div>

          <h1
            id="page-hero-title"
            className="text-[clamp(2.75rem,6.4vw,7rem)] leading-[0.88] font-thin tracking-tighter uppercase"
          >
            <HeadlineReveal text={title} emphasizeLast />
          </h1>

          <p
            className="mt-10 max-w-xl text-base leading-relaxed font-light text-muted-foreground md:mt-14 md:text-lg"
            style={{ animation: 'fade-up .8s cubic-bezier(.16,1,.3,1) 620ms both' }}
          >
            {lede}
          </p>
        </div>

        {items.length > 0 ? (
          <nav
            aria-label={itemsLabel}
            className="lg:col-span-4 lg:col-start-9 lg:self-end"
            style={{ animation: 'fade-up .8s cubic-bezier(.16,1,.3,1) 760ms both' }}
          >
            <p className="mb-4 font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
              {itemsLabel}
            </p>
            <ol className="border-t border-border-strong">
              {items.map((item) => (
                <li key={item.href} className="border-b border-border">
                  <a
                    href={item.href}
                    className="group flex items-baseline gap-5 py-3.5 transition-colors hover:text-foreground md:py-4"
                  >
                    <span className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground">
                      {item.index}
                    </span>
                    <span className="flex-1 text-xl font-thin tracking-tight text-foreground/70 uppercase transition-all duration-300 group-hover:translate-x-2 group-hover:font-light group-hover:text-foreground md:text-2xl">
                      {item.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-muted-foreground transition-transform duration-300 group-hover:translate-y-0.5"
                    >
                      ↓
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
      </div>
    </section>
  )
}
