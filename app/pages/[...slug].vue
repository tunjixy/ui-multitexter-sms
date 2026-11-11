<template>
  <section class="relative isolate overflow-hidden">
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--color-muted-foreground)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_top,black,transparent_70%)] bg-size-[24px_24px] opacity-25"
    />
    <div
      aria-hidden="true"
      class="bg-primary/15 pointer-events-none absolute -top-40 left-1/2 -z-10 size-144 -translate-x-1/2 rounded-full blur-3xl"
    />

    <div class="wrapper flex flex-col items-center py-20 text-center lg:py-28">
      <div
        aria-hidden="true"
        class="flex items-center gap-[0.08em] text-[clamp(6rem,22vw,11rem)] leading-none font-semibold tracking-tighter"
      >
        <span
          class="from-foreground to-foreground/10 bg-linear-to-b bg-clip-text text-transparent"
        >
          4
        </span>
        <span class="relative">
          <span
            class="from-primary to-primary/20 block bg-linear-to-b bg-clip-text text-transparent"
          >
            0
          </span>
        </span>
        <span
          class="from-foreground to-foreground/10 bg-linear-to-b bg-clip-text text-transparent"
        >
          4
        </span>
      </div>

      <h1
        class="mt-8 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
      >
        This page couldn't be delivered.
      </h1>
      <p class="text-muted-foreground mt-4 max-w-md leading-relaxed">
        The page you're looking for doesn't exist or may have been moved. Check
        the address, or head somewhere useful below.
      </p>

      <p class="mt-6 inline-flex max-w-full items-center gap-2 text-xs">
        <span
          class="flex shrink-0 items-center gap-1.5 font-semibold text-red-600 dark:text-red-400"
        >
          <span class="size-1.5 rounded-full bg-current" />
          Undelivered
        </span>
        <span class="bg-border h-3 w-px shrink-0" />
        <code class="text-muted-foreground truncate">{{ route.path }}</code>
      </p>

      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <NuxtLink
          to="/"
          class="bg-primary text-dark-blue hover:bg-primary/85 focus-visible:ring-primary/40 flex h-11 items-center gap-2 rounded-lg px-6 text-sm font-semibold transition-colors ease-in outline-none focus-visible:ring-3"
        >
          <House class="size-4" />
          Back to home
        </NuxtLink>
        <NuxtLink
          to="/contact"
          class="border-border hover:bg-primary/10 focus-visible:ring-primary/30 flex h-11 items-center gap-2 rounded-lg border px-6 text-sm font-semibold transition-colors ease-in outline-none focus-visible:ring-3"
        >
          <LifeBuoy class="size-4" />
          Contact support
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { House, LifeBuoy } from '@lucide/vue'

const route = useRoute()

const event = useRequestEvent()
if (event) setResponseStatus(event, 404, 'Page Not Found')

useHead({
  title: 'Page Not Found',
})
</script>
