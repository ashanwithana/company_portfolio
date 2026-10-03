import Link from 'next/link'

import { Reveal } from '@/components/ui/reveal'
import { services } from '@/content/services'
import { ACCENT_BORDER, ACCENT_DOT, ACCENT_WASH } from '@/lib/accent'
import { cn } from '@/lib/utils'

/** Services teaser on the home page — condensed versions of the full page. */
export function ServicesPreview() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service, index) => (
        <Reveal key={service.slug} delay={index * 60}>
          <Link
            href={service.canonicalHref ?? `/services/${service.slug}`}
            className={cn(
              'group flex h-full flex-col justify-between gap-8 rounded-3xl border border-border bg-gradient-to-br p-7 transition-[border-color,transform] duration-500 hover:-translate-y-1',
              ACCENT_WASH[service.tint],
              ACCENT_BORDER[service.tint],
            )}
          >
            <div>
              <h3 className="display-sm">{service.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{service.summary}</p>
            </div>

            <div className="flex items-end justify-between gap-6">
              {/*
                Deliverables as a ruled list rather than chips. The labels are
                full phrases, so chips stretched to two lines and dominated the
                card; a short list keeps the card scannable and matches the
                rule-led lists used elsewhere in the design system.
              */}
              <ul className="space-y-2">
                {service.deliverables.slice(0, 3).map((item) => (
                  <li
                    key={item}
                    className="relative pl-4 text-sm leading-snug text-muted-foreground"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute top-[0.65em] left-0 h-px w-2.5',
                        ACCENT_DOT[service.tint],
                      )}
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <span
                aria-hidden="true"
                className="shrink-0 text-xl text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-foreground"
              >
                →
              </span>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  )
}
