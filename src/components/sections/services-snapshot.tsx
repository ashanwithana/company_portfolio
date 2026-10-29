import { ServicesIndex, type ServicesIndexItem } from '@/components/sections/services-index'
import { services } from '@/content/services'

/** How many tags the reading panel shows per service. */
const TAG_LIMIT = 5

/**
 * "What we do."
 *
 * The home page's services section: a numbered label with a hairline rule, a
 * large light heading, then the services index (a list of subjects beside a
 * reading panel). Everything is read from the same `services` content module as
 * the services pages and the nav, so the list can never drift from the routes.
 * Services without a tool stack fall back to their deliverables for the tag row.
 */
export function ServicesSnapshot() {
  const items: ServicesIndexItem[] = services.map((service) => ({
    slug: service.slug,
    title: service.title,
    summary: service.summary,
    href: service.canonicalHref ?? `/services/${service.slug}`,
    tags: (service.stack ?? service.deliverables).slice(0, TAG_LIMIT),
  }))

  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="relative border-t border-border py-24 md:py-32"
    >
      <div className="container-page">
        <div className="mb-10 flex flex-col gap-4 md:mb-14 md:gap-5">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
              04 / Services
            </span>
            <span aria-hidden="true" className="h-px max-w-[240px] flex-1 bg-border" />
          </div>
          <h2
            id="services-title"
            className="text-[clamp(2.1rem,4.6vw,4.25rem)] leading-[0.95] font-light tracking-tight"
          >
            What we do.
          </h2>
        </div>

        <ServicesIndex items={items} />
      </div>
    </section>
  )
}
