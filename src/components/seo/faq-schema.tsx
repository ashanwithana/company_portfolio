/**
 * FAQ structured data.
 *
 * Rendered by pages that display a FAQ list, so the schema always matches the
 * visible content — the two cannot drift apart.
 *
 * Must be rendered by a Server Component; React only emits a real
 * `application/ld+json` tag from server-rendered markup.
 */
export function FaqSchema({ items }: { items: readonly { question: string; answer: string }[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
