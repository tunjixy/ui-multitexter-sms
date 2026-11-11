import { defineSitemapEventHandler } from '#sitemap/server'
import type { PostsRes } from '~/types/blog'

export default defineSitemapEventHandler(async (event) => {
  const { BASE_URL } = useRuntimeConfig(event).public

  const fetchPage = (page: number) =>
    $fetch<PostsRes>('/blogs', { baseURL: BASE_URL, query: { page } })

  const first = await fetchPage(1)
  if (first.status !== 1) return []

  const pageCount = first.rows ? Math.ceil(first.total / first.rows) : 1
  const rest = await Promise.all(
    Array.from({ length: pageCount - 1 }, (_, i) => fetchPage(i + 2)),
  )

  return [first, ...rest]
    .flatMap((res) => (res.status === 1 ? res.data : []))
    .map((post) => ({
      loc: `/blog/${post.slug}`,
      lastmod: post.updated_at || post.published_at,
    }))
})
