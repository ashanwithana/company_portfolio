'use client'

import * as React from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { Tag } from '@/components/ui/badge'
import {
  filterProjects,
  workFilters,
  type Project,
  type ProjectCategory,
} from '@/content/projects'
import { cn } from '@/lib/utils'

type Filter = (typeof workFilters)[number]['value']

const TINT_CLASSES: Record<Project['tint'], { card: string; border: string; glow: string }> = {
  primary: {
    card: 'from-primary/14 via-primary/6 to-transparent',
    border: 'group-hover:border-primary/35',
    glow: 'bg-primary',
  },
  mint: {
    card: 'from-mint/14 via-mint/6 to-transparent',
    border: 'group-hover:border-mint/35',
    glow: 'bg-mint',
  },
  coral: {
    card: 'from-coral/14 via-coral/6 to-transparent',
    border: 'group-hover:border-coral/35',
    glow: 'bg-coral',
  },
}

/**
 * Bento sizing.
 *
 * The grid uses a fixed `auto-rows` track (see the `ul` below) so a card that
 * spans two rows is exactly two tracks tall. Relying on content height here
 * instead is what produces the runaway 900px-tall cards — with `row-span-2` and
 * no track size, the spanned rows grow to fit the tallest item and cascade.
 */
const SIZES: Record<Project['size'], string> = {
  lg: 'md:col-span-2 md:row-span-2',
  sm: 'md:col-span-1',
}

/** Pointer-tracked spotlight. Uses a CSS variable so no re-render is needed. */
function ProjectCard({ project }: { project: Project }) {
  const cardRef = React.useRef<HTMLLIElement>(null)
  const tint = TINT_CLASSES[project.tint]

  const onPointerMove = (event: React.PointerEvent<HTMLLIElement>) => {
    const node = cardRef.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    node.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
    node.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
  }

  return (
    <motion.li
      ref={cardRef}
      onPointerMove={onPointerMove}
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-gradient-to-br transition-[border-color,box-shadow] duration-500',
        tint.card,
        tint.border,
        SIZES[project.size],
      )}
    >
      {/* Cursor spotlight */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(320px circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in oklab, var(--foreground) 7%, transparent), transparent 70%)',
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-40"
      >
        <span className={cn('block size-full rounded-full', tint.glow)} />
      </span>

      <div className="relative flex items-center justify-between gap-4 p-7 pb-0">
        <p className="font-mono text-[0.65rem] tracking-[0.3em] text-muted-foreground uppercase">
          {project.categoryLabel}
          {project.badge ? ` · ${project.badge}` : ''}
        </p>
        <span
          className="text-xl text-muted-foreground transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
          aria-hidden="true"
        >
          ↗
        </span>
      </div>

      <div className="relative p-7">
        <h3
          className={cn(
            'max-w-md text-3xl leading-tight',
            project.size === 'lg' && 'md:text-4xl',
          )}
        >
          {project.title}
        </h3>
        <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
          {project.tech.map((tech) => (
            <li key={tech}>
              <Tag>{tech}</Tag>
            </li>
          ))}
        </ul>

        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex min-h-8 items-center gap-2 font-mono text-[0.7rem] tracking-[0.25em] text-foreground uppercase transition-colors hover:text-coral"
        >
          <GitHubIcon />
          Code
        </a>
      </div>
    </motion.li>
  )
}

/** Selected work: filterable bento grid of projects. */
export function Work() {
  const [filter, setFilter] = React.useState<Filter>('all')
  const reducedMotion = useReducedMotion()
  const visible = React.useMemo(() => filterProjects(filter), [filter])

  return (
    <div>
      {/* Filters */}
      <div
        className="mb-10 flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Filter projects by category"
      >
        {workFilters.map((option) => {
          const isActive = filter === option.value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value)}
              aria-pressed={isActive}
              className={cn(
                'rounded-full border px-5 py-2 font-mono text-[0.7rem] tracking-[0.25em] uppercase transition-colors',
                isActive
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border text-muted-foreground hover:border-foreground/25 hover:text-foreground',
              )}
            >
              {option.label}
            </button>
          )
        })}
        <span className="ml-auto font-mono text-[0.7rem] tracking-[0.2em] text-muted-foreground tabular-nums">
          {visible.length.toString().padStart(2, '0')} projects
        </span>
      </div>

      {/* Grid */}
      <motion.ul
        layout={!reducedMotion}
        className="grid auto-rows-[19rem] gap-5 md:grid-cols-3"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  )
}

function GitHubIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  )
}

export type { ProjectCategory }
