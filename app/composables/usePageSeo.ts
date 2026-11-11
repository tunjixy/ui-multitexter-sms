export default function usePageSeo({
  title,
  description,
}: {
  title: string
  description: string
}) {
  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
  })
}
