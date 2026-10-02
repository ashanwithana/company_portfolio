import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StatusBadge, Eyebrow, Tag } from './badge'
import { Button, ButtonLink } from './button'

describe('Button', () => {
  it('defaults to type="button" so it never submits a form by accident', () => {
    render(<Button>Send</Button>)
    expect(screen.getByRole('button', { name: 'Send' })).toHaveAttribute('type', 'button')
  })

  it('honours an explicit submit type', () => {
    render(<Button type="submit">Send</Button>)
    expect(screen.getByRole('button', { name: 'Send' })).toHaveAttribute('type', 'submit')
  })

  it('can be disabled', () => {
    render(<Button disabled>Send</Button>)
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled()
  })
})

describe('ButtonLink', () => {
  it('renders an anchor, not a button', () => {
    render(<ButtonLink href="#contact">Get in touch</ButtonLink>)
    expect(screen.getByRole('link', { name: 'Get in touch' })).toHaveAttribute('href', '#contact')
  })
})

describe('StatusBadge', () => {
  it('renders its label', () => {
    render(<StatusBadge>Available for select work</StatusBadge>)
    expect(screen.getByText('Available for select work')).toBeInTheDocument()
  })

  it('hides the decorative pulse dot from assistive tech', () => {
    const { container } = render(<StatusBadge>Live</StatusBadge>)
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })
})

describe('Tag and Eyebrow', () => {
  it('render their children', () => {
    render(
      <>
        <Tag>React</Tag>
        <Eyebrow>Direct</Eyebrow>
      </>,
    )
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('Direct')).toBeInTheDocument()
  })
})
