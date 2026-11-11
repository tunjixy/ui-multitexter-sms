<template>
  <div>
    <BlogHero />
    <BlogSectionTwo :posts="posts" />
  </div>
</template>

<script setup lang="ts">
import type { PostsRes } from '@/types/blog'

const { BASE_URL } = useRuntimeConfig().public

const { data, error } = await useFetch<PostsRes>('/blogs?page=1', {
  baseURL: BASE_URL,
  key: 'blog',
  getCachedData: (key, nuxtApp) =>
    nuxtApp.payload.data[key] || nuxtApp.static.data[key],
})

if (error.value) {
  throw createError({
    status: 502,
    statusText: 'Could not load blog posts',
    fatal: true,
  })
}

const posts = computed(() => (data.value?.status === 1 ? data.value.data : []))

usePageSeo({
  title: 'Bulk SMS Tips and Guides',
  description:
    'How-tos, ideas and updates from Multitexter to help your business reach more people with bulk SMS.',
})
</script>
