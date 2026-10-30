/**
 * Numbered section label with a trailing rule, as used by the page heroes.
 * Renders the `h2` for its section, so pass the id the section is labelled by.
 */
export function SectionHead({ id, index, title }: { id: string; index: string; title: string }) {
  return (
    <div className="flex items-center gap-4">
      <h2
        id={id}
        className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase"
      >
        {index} / {title}
      </h2>
      <span aria-hidden="true" className="h-px max-w-[280px] flex-1 bg-border-strong" />
    </div>
  )
}
