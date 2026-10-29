'use client'

/**
 * "Top" control for the footer's record column. A button, not a link: it
 * scrolls the page and does not navigate, and respects reduced motion by
 * jumping instead of gliding.
 */
export function BackToTop() {
  const scrollToTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="group inline-flex cursor-pointer items-center gap-2 tracking-[0.2em] uppercase transition-colors hover:text-foreground"
    >
      <span>Top</span>
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:-translate-y-0.5"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  )
}
