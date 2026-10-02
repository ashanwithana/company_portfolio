import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AboutPortrait } from '@/components/ui/about-portrait'
import { projects } from '@/content/projects'

describe('AboutPortrait', () => {
  it('exposes an accessible name', () => {
    render(<AboutPortrait />)
    expect(screen.getByRole('img', { name: /portrait/i })).toBeInTheDocument()
  })

  it('decorates its SVG children so screen readers skip the shapes', () => {
    const { container } = render(<AboutPortrait />)
    expect(container.querySelector('svg')).toHaveAttribute('role', 'img')
  })
})

describe('project data as rendered content', () => {
  it('renders every project title and tag without empty nodes', () => {
    for (const project of projects) {
      expect(project.title.trim()).toBe(project.title)
      expect(project.description.trim()).toBe(project.description)
      expect(project.tech.every((tech) => tech.trim() === tech)).toBe(true)
    }
  })
})
