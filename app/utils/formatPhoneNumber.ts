export default function formatPhoneNumber(number: string) {
  return number.startsWith('0')
    ? number.replace('0', '234')
    : number.startsWith('+234')
      ? number.replace('+234', '234')
      : number
}
