export default function splitContactListIds(value: string | null | undefined) {
  return (value ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter((id) => id && id !== '0')
}
