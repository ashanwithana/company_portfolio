import { Reveal } from '@/components/ui/reveal'
import { clients } from '@/content/company'

/** Client roster strip. */
export function ClientLogos() {
  return (
    <Reveal>
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-3 lg:grid-cols-6">
        {clients.map((client) => (
          <li
            key={client.name}
            className="flex flex-col items-center justify-center gap-1.5 bg-background px-4 py-9 text-center"
          >
            <span className="text-base font-semibold tracking-tight">{client.name}</span>
            <span className="label text-[0.5rem] text-muted-foreground">{client.sector}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  )
}
