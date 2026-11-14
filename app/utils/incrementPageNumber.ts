export default function incrementPageNumber(
  index: number,
  perPage: number,
  currentPage: number,
) {
  const currentIndex = index + 1
  const offset = perPage * currentPage - perPage
  return offset + currentIndex
}
