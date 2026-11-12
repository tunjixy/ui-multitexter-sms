<template>
  <NuxtLayout>
    <section class="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--color-muted-foreground)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_center,black,transparent_70%)] bg-size-[24px_24px] opacity-25"
      />
      <div
        aria-hidden="true"
        class="bg-primary/15 pointer-events-none absolute top-1/2 left-1/2 -z-10 size-120 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
      />

      <div
        class="wrapper flex min-h-[70vh] flex-col items-center justify-center py-24 text-center"
      >
        <p
          v-motion-fade-visible-once
          class="text-primary text-xs font-semibold tracking-[0.25em] uppercase"
        >
          Error {{ status }}
        </p>
        <p
          v-motion-pop-visible-once
          :delay="100"
          aria-hidden="true"
          class="from-foreground to-foreground/10 mt-4 bg-linear-to-b bg-clip-text text-[clamp(6rem,22vw,11rem)] leading-none font-semibold tracking-tighter text-transparent tabular-nums"
        >
          {{ status }}
        </p>
        <h1
          v-motion-reveal
          :delay="200"
          class="mt-6 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
        >
          {{ title }}
        </h1>
        <p
          v-motion-fade-visible-once
          :delay="400"
          class="text-muted-foreground mt-4 max-w-md leading-relaxed"
        >
          {{ description }}
        </p>

        <pre
          v-if="isDev && error.message"
          class="border-border bg-surface text-muted-foreground mt-6 max-w-xl overflow-x-auto rounded-xl border px-4 py-3 text-left text-xs whitespace-pre-wrap"
          >{{ error.message }}</pre>

        <div
          v-motion-fade-visible-once
          :delay="550"
          class="mt-8 flex flex-wrap justify-center gap-3"
        >
          <button
            type="button"
            class="bg-primary text-dark-blue hover:bg-primary/85 focus-visible:ring-primary/40 flex h-11 cursor-pointer items-center gap-2 rounded-lg px-6 text-sm font-semibold transition-colors ease-in outline-none focus-visible:ring-3"
            @click="clearError({ redirect: '/' })"
          >
            <House class="size-4" />
            Back to home
          </button>
          <button
            v-if="isNotFound"
            type="button"
            class="border-border hover:bg-primary/10 focus-visible:ring-primary/30 flex h-11 cursor-pointer items-center gap-2 rounded-lg border px-6 text-sm font-semibold transition-colors ease-in outline-none focus-visible:ring-3"
            @click="clearError({ redirect: '/contact' })"
          >
            <LifeBuoy class="size-4" />
            Contact support
          </button>
          <button
            v-else
            type="button"
            class="border-border hover:bg-primary/10 focus-visible:ring-primary/30 flex h-11 cursor-pointer items-center gap-2 rounded-lg border px-6 text-sm font-semibold transition-colors ease-in outline-none focus-visible:ring-3"
            @click="reloadNuxtApp()"
          >
            <RotateCw class="size-4" />
            Try again
          </button>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'
import { House, LifeBuoy, RotateCw } from '@lucide/vue'

const { error } = defineProps<{
  error: NuxtError
}>()

const isDev = import.meta.dev

const status = computed(() => error.status ?? error.statusCode ?? 500)
const isNotFound = computed(() => status.value === 404)

const title = computed(() =>
  isNotFound.value ? 'Page not found' : 'Something went wrong',
)
const description = computed(() =>
  isNotFound.value
    ? "The page you're looking for doesn't exist or may have been moved."
    : "We couldn't load this page right now. Please try again in a moment.",
)

useHead({
  title: () => `${status.value} - ${title.value}`,
})
</script>
