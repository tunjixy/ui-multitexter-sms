<template>
  <section class="py-16 lg:py-24">
    <div class="wrapper">
      <EmptyState
        v-if="!latest"
        :icon="Newspaper"
        title="No articles yet"
        description="We're working on new articles. Please check back soon."
      />

      <template v-else>
        <BlogPost :post="latest" featured />

        <template v-if="others.length">
          <div
            class="mt-16 flex items-end justify-between gap-4 lg:mt-24"
          >
            <h2 class="text-2xl font-semibold tracking-tight sm:text-3xl">
              More articles
            </h2>
            <p class="text-muted-foreground text-sm">
              {{ posts.length }} articles
            </p>
          </div>

          <ul class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <li v-for="post in others" :key="post.id">
              <BlogPost :post="post" />
            </li>
          </ul>
        </template>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Newspaper } from '@lucide/vue'
import type { Post } from '@/types/blog'

const { posts } = defineProps<{
  posts: Post[]
}>()

const latest = computed(() => posts[0])
const others = computed(() => posts.slice(1))
</script>
