<template>
  <article
    :class="[
      'group bg-surface border-border hover:border-primary/40 relative flex h-full flex-col overflow-hidden rounded-3xl border transition-colors ease-in',
      featured && 'lg:flex-row',
    ]"
  >
    <div
      :class="[
        'relative aspect-video shrink-0 overflow-hidden',
        featured && 'lg:aspect-auto lg:min-h-80 lg:w-1/2',
      ]"
    >
      <NuxtImg
        v-if="post.featured_image_url"
        :src="post.featured_image_url"
        :alt="post.title"
        loading="lazy"
        class="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
      <div
        v-else
        aria-hidden="true"
        class="bg-dark-blue relative flex size-full items-center justify-center"
      >
        <div
          class="absolute inset-0 bg-[radial-gradient(var(--color-white)_1px,transparent_1px)] bg-size-[20px_20px] opacity-15"
        />
        <div
          :class="[
            'bg-primary/35 absolute size-56 rounded-full blur-3xl transition-transform duration-500 ease-out group-hover:scale-125',
            glow,
          ]"
        />
        <span
          class="text-primary relative flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
        >
          <Newspaper class="size-6" />
        </span>
      </div>
    </div>

    <div
      :class="[
        'flex flex-1 flex-col p-6',
        featured && 'sm:p-8 lg:justify-center lg:p-12',
      ]"
    >
      <p
        class="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-xs"
      >
        <span
          v-if="featured"
          class="bg-primary/10 text-primary rounded-full px-2 py-0.5 font-medium"
        >
          Latest
        </span>
        <template v-if="date">
          <time :datetime="date.iso">{{ date.label }}</time>
          <span aria-hidden="true">·</span>
        </template>
        <span>{{ minutes }} min read</span>
      </p>

      <component
        :is="featured ? 'h2' : 'h3'"
        :class="[
          'mt-3 font-semibold tracking-tight text-balance',
          featured
            ? 'text-2xl leading-tight sm:text-3xl'
            : 'text-lg leading-snug',
        ]"
      >
        <NuxtLink
          :to="`/blog/${post.slug}`"
          class="group-hover:text-primary focus-visible:after:ring-primary/40 transition-colors ease-in outline-none after:absolute after:inset-0 after:rounded-3xl focus-visible:after:ring-3"
        >
          {{ post.title }}
        </NuxtLink>
      </component>

      <p
        v-if="excerpt"
        :class="[
          'text-muted-foreground mt-3 text-sm leading-relaxed',
          featured ? 'line-clamp-4 sm:text-base' : 'line-clamp-3',
        ]"
      >
        {{ excerpt }}
      </p>

      <span
        aria-hidden="true"
        class="text-primary mt-auto flex items-center gap-1.5 pt-6 text-sm font-semibold"
      >
        Read article
        <ArrowRight
          class="size-4 transition-transform ease-out group-hover:translate-x-1"
        />
      </span>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ArrowRight, Newspaper } from '@lucide/vue'
import type { Post } from '@/types/blog'

const { post, featured = false } = defineProps<{
  post: Post
  featured?: boolean
}>()

const glows = [
  '-top-20 -left-16',
  '-top-20 -right-16',
  '-bottom-20 -left-16',
  '-bottom-20 -right-16',
]
const glow = computed(() => glows[post.id % glows.length])

const text = computed(() => htmlToText(post.content ?? ''))

const excerpt = computed(() => {
  if (text.value.length <= 280) return text.value
  const cut = text.value.slice(0, 280).replace(/\s+\S*$/, '')
  return `${cut.replace(/[\s.,;:!?]+$/, '')}…`
})

const minutes = computed(() => readingTime(text.value))

const date = computed(() =>
  formatPostDate(post.published_at || post.created_at),
)
</script>
