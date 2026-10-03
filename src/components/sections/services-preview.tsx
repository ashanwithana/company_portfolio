import Link from 'next/link'

import { Reveal } from '@/components/ui/reveal'
import { Tag } from '@/components/ui/badge'
import { services } from '@/content/services'
import { ACCENT_BORDER, ACCENT_TEXT, ACCENT_WASH } from '@/lib/accent'
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
              'group flex h-full flex-col justify-between gap-8 rounded-2xl border border-border bg-gradient-to-br p-7 transition-[border-color,transform] duration-500 hover:-translate-y-1',
              ACCENT_WASH[service.tint],
              ACCENT_BORDER[service.tint],
            )}
          >
            <div>
              <h3 className="text-2xl leading-tight">{service.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{service.summary}</p>
            </div>

            <div className="flex items-center justify-between">
              <ul className="flex flex-wrap gap-1.5">
                {service.deliverables.slice(0, 2).map((item) => (
                  <li key={item}>
                    <Tag className={ACCENT_TEXT[service.tint]}>{item}</Tag>
                  </li>
                ))}
              </ul>

              <span
                aria-hidden="true"
                className="text-xl text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-foreground"
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
