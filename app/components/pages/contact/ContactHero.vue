<template>
  <section class="relative overflow-hidden py-16 lg:py-24">
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--color-muted-foreground)_1px,transparent_1px)] mask-[linear-gradient(to_bottom,black,transparent)] bg-size-[24px_24px] opacity-25"
    />
    <div
      aria-hidden="true"
      class="bg-primary/15 pointer-events-none absolute -top-56 -right-32 size-144 rounded-full blur-3xl"
    />

    <div class="wrapper relative">
      <p
        v-motion-fade-visible-once
        class="text-primary text-xs font-semibold tracking-[0.25em] uppercase"
      >
        Get in touch with our team
      </p>

      <h1
        v-motion-reveal
        :delay="100"
        class="mt-4 max-w-3xl text-4xl leading-[1.15] font-semibold tracking-tight text-balance sm:text-5xl xl:text-6xl"
      >
        How can we help your business connect?
      </h1>

      <p
        v-motion-fade-visible-once
        :delay="300"
        class="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed sm:text-lg"
      >
        Whether you need custom volume rates for bulk SMS, direct developer
        support for REST APIs, or account onboarding, our team is ready.
      </p>

      <ul
        v-motion-fade-visible-once
        :delay="450"
        class="mt-8 flex flex-wrap gap-x-6 gap-y-3"
      >
        <li
          v-for="highlight in highlights"
          :key="highlight"
          class="text-muted-foreground flex items-center gap-2 text-sm"
        >
          <span class="bg-primary size-2 shrink-0 rounded-full" />
          {{ highlight }}
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
const highlights = [
  'Average response within 12 business hours',
  'Direct engineering and sales access',
]
</script>
