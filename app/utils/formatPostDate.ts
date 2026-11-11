export default function formatPostDate(value?: string | null) {
  if (!value) return null

  const normalized = value.includes('T')
    ? value
    : `${value.replace(' ', 'T')}Z`
  const date = new Date(normalized.replace(/(\.\d{3})\d+/, '$1'))

  if (Number.isNaN(date.getTime()) || date.getFullYear() < 2000) return null

  return {
    iso: date.toISOString(),
    label: date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'Africa/Lagos',
    }),
  }
}
