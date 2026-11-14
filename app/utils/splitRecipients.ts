export default function splitRecipients(value: string | null | undefined) {
  return (value ?? '').split(/[\s,]+/).filter(Boolean)
}
