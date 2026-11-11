export default function (num: string | number) {
  if (String(num) === 'NaN') {
    return 0
  } else if (isNaN(num as number)) {
    return parseFloat(num.toString().replace(/[^\d.-]/g, ''))
  }
  return parseFloat(num.toString())
}
