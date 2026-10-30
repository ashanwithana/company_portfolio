import Link from 'next/link'

import { primaryNav } from '@/content/site'
import { services } from '@/content/services'

export const metadata = {
  title: 'Page not found',
  description: 'The page you were looking for does not exist.',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[70svh] flex-col justify-center py-32">
      <p className="label text-brand">404</p>

      <h1 className="mt-6 max-w-3xl text-4xl leading-[1.05] text-balance sm:text-5xl lg:text-6xl">
        This page does not exist.
      </h1>

      <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
        The link may be out of date, or the page may have moved. Here is everything that exists.
      </p>

      <nav aria-label="Site sections" className="mt-12">
        <ul className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {primaryNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex h-full items-center justify-between bg-background px-6 py-5 transition-colors hover:bg-muted/40"
              >
                <span className="font-mono text-xs tracking-[0.2em] uppercase">{item.label}</span>
                <span aria-hidden="true" className="text-muted-foreground">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-10">
        <h2 className="label text-muted-foreground">Or start with a service</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {services.map((service) => (
            <li key={service.slug}>
              <Link
                href={`/services/${service.slug}`}
                className="inline-flex min-h-9 items-center border border-border px-4 label transition-colors hover:border-border-strong"
              >
                {service.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
