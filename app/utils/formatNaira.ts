interface Options {
  fixed?: boolean
}

export default function formatNaira(
  value: number,
  { fixed = false }: Options = {},
) {
  const amount = formatNumberWithComma(value.toFixed(2))
  return `₦${fixed ? amount : amount.replace(/\.00$/, '')}`
}
