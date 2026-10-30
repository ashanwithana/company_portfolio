/**
 * The hero's hairline grid: twelve columns on desktop (four on mobile) inside
 * the 1600px page column, plus horizontal rules at a quarter and three quarters
 * of the screen. It gives a headline a structure to sit on without adding any
 * visible weight. Decorative only, so it is hidden from assistive technology and
 * never takes pointer events.
 *
 * Absolutely positioned: place it inside a `relative` section.
 */
export function HairlineGrid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 mx-auto flex w-full max-w-[1600px] justify-center px-4 md:px-8"
    >
      <div className="grid h-full w-full grid-cols-4 gap-0 border-x border-foreground/5 md:grid-cols-12">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className={
              i < 4
                ? 'h-full border-r border-foreground/5'
                : 'hidden h-full border-r border-foreground/5 md:block'
            }
          />
        ))}
      </div>
      <div className="absolute top-[25vh] left-0 hidden h-px w-full bg-foreground/5 md:block" />
      <div className="absolute top-[75vh] left-0 hidden h-px w-full bg-foreground/5 md:block" />
    </div>
  )
}
