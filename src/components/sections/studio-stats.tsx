import { studioStats } from '@/content/services'
import { cn } from '@/lib/utils'

/**
 * The studio in numbers: four figures in a hairline-divided row, large thin
 * numerals with the suffix set bold. Shared by the home page and About so the
 * two cannot show different numbers.
 *
 * `embedded` drops the full-bleed section and tightens the cells so the row can
 * sit inside another section's own column, as it does under "The point".
 */
export function StudioStats({
  className,
  embedded = false,
}: {
  className?: string
  embedded?: boolean
}) {
  const figures = (
    <dl
      className={cn(
        'grid grid-cols-2 lg:grid-cols-4',
        embedded ? 'border-t border-border' : 'mx-auto w-full max-w-[1600px]',
      )}
    >
      {studioStats.map((stat, i) => (
        <div
          key={stat.label}
          className={cn(
            embedded ? 'py-5 pr-4 md:py-8' : 'px-4 py-10 md:px-8 md:py-14',
            i % 2 === 1 && 'border-l border-border',
            i > 0 && 'lg:border-l lg:border-border',
            i >= 2 && 'border-t border-border lg:border-t-0',
            embedded && i % 2 === 1 && 'pl-4 md:pl-8',
            embedded && i > 0 && 'lg:pl-8',
          )}
        >
          <dt className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
            {stat.label}
          </dt>
          <dd
            className={cn(
              'mt-3 leading-none font-thin tracking-tighter tabular-nums',
              embedded ? 'text-4xl md:text-6xl' : 'text-5xl md:text-7xl',
            )}
          >
            {stat.value}
            <span className="font-bold">{stat.suffix}</span>
          </dd>
        </div>
      ))}
    </dl>
  )

  if (embedded) return <div className={className}>{figures}</div>

  return (
    <section aria-label="The studio in numbers" className={cn('border-y border-border', className)}>
      {figures}
    </section>
  )
}
