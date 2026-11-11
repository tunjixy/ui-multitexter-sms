interface Options {
  decimals?: number
}

export default function formatNumberInput(
  input: HTMLInputElement,
  { decimals = 0 }: Options = {},
) {
  const typed = input.value
  const caret = input.selectionStart ?? typed.length

  let integer = ''
  let fraction = ''
  let hasDot = false
  let keptBeforeCaret = 0

  for (let i = 0; i < typed.length; i++) {
    const char = typed.charAt(i)
    let keep = false

    if (/\d/.test(char)) {
      if (!hasDot) {
        integer += char
        keep = true
      } else if (fraction.length < decimals) {
        fraction += char
        keep = true
      }
    } else if (char === '.' && decimals > 0 && !hasDot) {
      hasDot = true
      keep = true
    }

    if (keep && i < caret) keptBeforeCaret++
  }

  const trimmed = integer.replace(/^0+(?=\d)/, '')
  keptBeforeCaret = Math.max(
    0,
    keptBeforeCaret - (integer.length - trimmed.length),
  )
  integer = trimmed

  if (hasDot && !integer) {
    integer = '0'
    if (keptBeforeCaret > 0) keptBeforeCaret++
  }

  const number = hasDot ? `${integer}.${fraction}` : integer
  const formatted = number ? formatNumberWithComma(number) : ''
  input.value = formatted

  if (document.activeElement === input) {
    let position = 0
    let seen = 0
    while (seen < keptBeforeCaret && position < formatted.length) {
      if (formatted.charAt(position) !== ',') seen++
      position++
    }
    input.setSelectionRange(position, position)
  }

  return number
}
