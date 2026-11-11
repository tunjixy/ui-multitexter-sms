const entities: Record<string, string> = {
  nbsp: ' ',
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
  ndash: '–',
  mdash: '—',
  hellip: '…',
}

export default function htmlToText(html: string) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
      if (code.startsWith('#')) {
        const hex = code[1]?.toLowerCase() === 'x'
        const value = parseInt(code.slice(hex ? 2 : 1), hex ? 16 : 10)
        return Number.isNaN(value) ? match : String.fromCodePoint(value)
      }
      return entities[code.toLowerCase()] ?? match
    })
    .replace(/\s+/g, ' ')
    .trim()
}
