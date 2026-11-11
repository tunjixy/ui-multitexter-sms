export default function (number: string | number) {
  if (!number) return '0'
  const [integer = '', fraction] = number.toString().split('.')
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return fraction === undefined ? grouped : `${grouped}.${fraction}`
}
