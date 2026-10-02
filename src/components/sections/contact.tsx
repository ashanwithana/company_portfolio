import { ContactForm } from '@/components/sections/contact-form'
import { Eyebrow, StatusBadge } from '@/components/ui/badge'
import { Reveal } from '@/components/ui/reveal'
import { contactContent, siteConfig, socialLinks } from '@/content/site'

/** Contact section: availability, direct line + socials, and the enquiry form. */
export function Contact() {
  return (
    <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-20">
      {/* Left column — availability + direct links */}
      <div className="flex flex-col gap-8">
        <Reveal>
          <div className="rounded-2xl border border-border bg-card/40 p-7 backdrop-blur-sm">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge tone="mint">{`Available · ${siteConfig.availability.window}`}</StatusBadge>
            </div>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              {siteConfig.availability.body}
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="rounded-2xl border border-border bg-card/40 p-7 backdrop-blur-sm">
            <Eyebrow>{contactContent.directLabel}</Eyebrow>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-4 flex items-center gap-3 break-all text-lg transition-colors hover:text-coral sm:text-xl"
            >
              <MailIcon />
              {siteConfig.email}
            </a>

            <Eyebrow className="mt-8 block">{contactContent.socialsTitle}</Eyebrow>
            <ul className="mt-4 flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${social.label} — opens in a new tab`}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-border transition-colors hover:border-foreground/30 hover:bg-foreground/[0.04]"
                  >
                    {SOCIAL_ICONS[social.label] ?? <LinkIcon />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      {/* Right column — form */}
      <Reveal delay={140}>
        <ContactForm />
      </Reveal>
    </div>
  )
}

function MailIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  GitHub: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  ),
  LinkedIn: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  'X / Twitter': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.9 2H22l-7.2 8.24L23.3 22h-6.5l-5.1-6.67L5.8 22H2.7l7.7-8.8L1.9 2h6.67l4.6 6.1L18.9 2Zm-1.1 18.1h1.7L7.3 3.8H5.5l12.3 16.3Z" />
    </svg>
  ),
}
