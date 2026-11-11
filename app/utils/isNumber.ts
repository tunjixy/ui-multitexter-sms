export default function (event: KeyboardEvent) {
  if (!/\d/.test(event.key) && event.key !== ',' && event.key !== 'Enter')
    return event.preventDefault()
}
