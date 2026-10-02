import { About } from '@/components/sections/about'
import { Contact } from '@/components/sections/contact'
import { Hero } from '@/components/sections/hero'
import { Skills } from '@/components/sections/skills'
import { Timeline } from '@/components/sections/timeline'
import { Work } from '@/components/sections/work'
import { Section, SectionHeading } from '@/components/ui/section-heading'
import { navSections } from '@/content/site'

/** Lookup section metadata by id so the page stays declarative. */
function section(id: string) {
  const found = navSections.find((item) => item.id === id)
  if (!found) throw new Error(`Unknown section: ${id}`)
  return found
}

export default function HomePage() {
  const about = section('about')
  const work = section('work')
  const skills = section('skills')
  const path = section('path')
  const contact = section('contact')

  return (
    <>
      <Hero />

      <Section id={about.id} label={about.label}>
        <SectionHeading
          id={about.id}
          index="01"
          label={about.label}
          title={about.title}
          description={about.description}
        />
        <About />
      </Section>

      <Section id={work.id} label={work.label}>
        <SectionHeading
          id={work.id}
          index="02"
          label={work.label}
          title={work.title}
          description={work.description}
        />
        <Work />
      </Section>

      <Section id={skills.id} label={skills.label}>
        <SectionHeading
          id={skills.id}
          index="03"
          label={skills.label}
          title={skills.title}
          description={skills.description}
        />
        <Skills />
      </Section>

      <Section id={path.id} label={path.label}>
        <SectionHeading
          id={path.id}
          index="04"
          label={path.label}
          title={path.title}
          description={path.description}
        />
        <Timeline />
      </Section>

      <Section id={contact.id} label={contact.label}>
        <SectionHeading
          id={contact.id}
          index="05"
          label={contact.label}
          title={contact.title}
          description={contact.description}
        />
        <Contact />
      </Section>
    </>
  )
}
