<template>
  <article v-if="post">
    <header class="border-border relative overflow-hidden border-b">
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--color-muted-foreground)_1px,transparent_1px)] mask-[linear-gradient(to_bottom,black,transparent)] bg-size-[24px_24px] opacity-25"
      />
      <div
        aria-hidden="true"
        class="bg-primary/15 pointer-events-none absolute -top-56 -right-32 size-144 rounded-full blur-3xl"
      />

      <div
        :class="[
          'wrapper relative pt-12 lg:pt-16',
          post.featured_image_url ? 'pb-32 lg:pb-44' : 'pb-16 lg:pb-20',
        ]"
      >
        <div class="mx-auto max-w-3xl">
          <NuxtLink
            to="/blog"
            class="text-muted-foreground hover:text-primary focus-visible:ring-primary/40 inline-flex items-center gap-2 rounded-md text-sm font-medium transition-colors ease-in outline-none focus-visible:ring-3"
          >
            <ArrowLeft class="size-4" />
            All articles
          </NuxtLink>

          <p
            class="text-muted-foreground mt-10 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm"
          >
            <template v-if="date">
              <time :datetime="date.iso">{{ date.label }}</time>
              <span aria-hidden="true">·</span>
            </template>
            <span>{{ minutes }} min read</span>
          </p>

          <h1
            class="mt-4 text-4xl leading-[1.15] font-semibold tracking-tight text-balance sm:text-5xl"
          >
            {{ post.title }}
          </h1>

          <div v-if="post.author_name" class="mt-8 flex items-center gap-3">
            <span
              aria-hidden="true"
              class="bg-primary/10 text-primary border-primary/20 flex size-10 items-center justify-center rounded-full border text-sm font-semibold"
            >
              {{ initials }}
            </span>
            <div>
              <p class="text-sm font-semibold">{{ post.author_name }}</p>
              <p class="text-muted-foreground text-xs">Multitexter</p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="wrapper pb-16 lg:pb-24">
      <div
        v-if="post.featured_image_url"
        class="relative mx-auto -mt-20 max-w-5xl lg:-mt-32"
      >
        <NuxtImg
          :src="post.featured_image_url"
          :alt="post.title"
          class="border-border bg-surface aspect-video w-full rounded-3xl border object-cover shadow-2xl shadow-black/10"
        />
      </div>

      <div class="mx-auto mt-12 max-w-3xl lg:mt-16">
        <!-- eslint-disable vue/no-v-html -->
        <div
          class="post-content prose prose-neutral dark:prose-invert sm:prose-lg prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-primary prose-a:font-medium prose-a:no-underline prose-a:wrap-break-word prose-a:hover:underline prose-strong:text-foreground prose-img:rounded-2xl prose-img:border prose-img:border-border prose-pre:bg-dark-blue prose-pre:rounded-2xl prose-pre:border prose-pre:border-white/10 prose-blockquote:border-l-primary prose-hr:border-border max-w-none"
          v-html="post.content"
        />
        <!-- eslint-enable vue/no-v-html -->

        <footer
          class="border-border mt-16 flex flex-wrap items-center justify-between gap-4 border-t pt-8"
        >
          <NuxtLink
            to="/blog"
            class="border-border hover:bg-primary/10 focus-visible:ring-primary/30 flex h-11 items-center gap-2 rounded-lg border px-5 text-sm font-semibold transition-colors ease-in outline-none focus-visible:ring-3"
          >
            <ArrowLeft class="size-4" />
            Back to all articles
          </NuxtLink>
          <button
            type="button"
            class="text-muted-foreground hover:text-foreground hover:bg-primary/10 focus-visible:ring-primary/30 flex h-11 cursor-pointer items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors ease-in outline-none focus-visible:ring-3"
            @click="copy(url)"
          >
            <component :is="copied ? Check : Link" class="size-4" />
            {{ copied ? 'Link copied' : 'Copy link' }}
          </button>
        </footer>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ArrowLeft, Check, Link } from '@lucide/vue'
import type { PostRes } from '@/types/blog'

const { slug } = useRoute<'slug'>().params
const { BASE_URL } = useRuntimeConfig().public

// Old post URLs that should send visitors to /blog if the post no longer exists
const LEGACY_SLUGS = [
  'how-to-buy-contacts-numbers-to-send-bulk-sms-on-multitextercom',
  'bulk-sms-for-your-business-in-nigeria-2020-part-1',
  'easter-2020-how-to-send-bulk-sms-for-greetings-and-prayers',
  'multitextercom-best-bulk-sms-in-nigeria-override-dnd-active-mtn-numbers-1',
  'how-to-send-bulk-sms-with-your-sender-id-in-2020',
]

const { data, error } = await useFetch<PostRes>(`/blogs/${slug}`, {
  baseURL: BASE_URL,
  key: `blog-${slug}`,
  getCachedData: (key, nuxtApp) =>
    nuxtApp.payload.data[key] || nuxtApp.static.data[key],
})

const notFound =
  error.value?.status === 404 || (!error.value && !data.value?.data)

if (notFound && LEGACY_SLUGS.includes(String(slug))) {
  await navigateTo('/blog', { redirectCode: 301 })
} else if (notFound) {
  throw createError({
    status: 404,
    statusText: 'Post not found',
    fatal: true,
  })
} else if (error.value) {
  throw createError({
    status: 502,
    statusText: 'Could not load this post',
    fatal: true,
  })
}

const post = computed(() => data.value?.data ?? null)
const text = computed(() => htmlToText(post.value?.content ?? ''))
const minutes = computed(() => readingTime(text.value))
const date = computed(() =>
  formatPostDate(post.value?.published_at || post.value?.created_at),
)

const initials = computed(() =>
  (post.value?.author_name ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join(''),
)

const url = useRequestURL().href
const { copy, copied } = useClipboard({ copiedDuring: 2000, legacy: true })

useSeoMeta({
  title: () => post.value?.title,
  description: () => text.value.slice(0, 160),
  ogTitle: () => post.value?.title,
  ogDescription: () => text.value.slice(0, 160),
  ogImage: () => post.value?.featured_image_url || undefined,
  ogType: 'article',
})

useSchemaOrg([
  defineArticle({
    '@type': 'BlogPosting',
    headline: () => post.value?.title,
    description: () => text.value.slice(0, 160),
    image: () => post.value?.featured_image_url || undefined,
    datePublished: () => post.value?.published_at || post.value?.created_at,
    dateModified: () => post.value?.updated_at,
    author: () =>
      post.value?.author_name ? { name: post.value.author_name } : undefined,
  }),
  defineBreadcrumb({
    itemListElement: () => [
      { name: 'Home', item: '/' },
      { name: 'Blog', item: '/blog' },
      { name: post.value?.title },
    ],
  }),
])
</script>

<style scoped>
.post-content :deep([style]) {
  color: inherit !important;
  background-color: transparent !important;
  font-family: inherit !important;
  font-size: inherit !important;
}
</style>
