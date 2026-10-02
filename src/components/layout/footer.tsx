'use client'

import * as React from 'react'

import { footerContent, socialLinks, siteConfig } from '@/content/site'

/** Site footer with brand lockup, copyright and quick social links. */
export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="no-print container-page pb-10 pt-20">
      <div className="flex flex-col gap-8 border-t border-border pt-10 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p className="font-display text-2xl font-semibold">
            {siteConfig.shortName.replace('.', '')}
            <span className="text-coral">.</span>
          </p>
          <p className="font-mono text-[0.7rem] tracking-[0.15em] text-muted-foreground">
            © {year} — Built with a keyboard and some coffee.
          </p>
        </div>

        <div className="flex flex-col items-start gap-4 md:items-end">
          <ul className="flex flex-wrap items-center gap-4">
            {socialLinks.map((social) => (
              <li key={social.href}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-8 items-center font-mono text-[0.7rem] tracking-[0.15em] text-muted-foreground uppercase transition-colors hover:text-foreground"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="font-mono text-[0.7rem] tracking-[0.15em] text-muted-foreground uppercase">
            {footerContent.hint}
          </p>
        </div>
      </div>
    </footer>
  )
}
