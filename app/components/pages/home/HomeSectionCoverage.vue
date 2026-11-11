<template>
  <section class="py-16 lg:py-24">
    <div
      class="wrapper grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24"
    >
      <div>
        <p
          class="text-primary text-xs font-semibold tracking-[0.25em] uppercase"
        >
          Coverage
        </p>
        <h2
          class="mt-4 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl"
        >
          Send Bulk SMS to any network in Nigeria at one unit per SMS
        </h2>
        <p
          class="text-muted-foreground mt-5 max-w-xl text-base leading-relaxed"
        >
          MultiTexter provides the smartest, fastest and most reliable means of
          sending text messages in Nigeria and across Africa; reaching thousands
          of people with just one click with instant delivery report.
        </p>
        <NuxtLink
          to="/sms-coverage"
          class="bg-primary text-dark-blue hover:bg-primary/85 focus-visible:ring-primary/40 mt-8 inline-flex h-12 items-center gap-2 rounded-lg px-6 text-sm font-semibold transition-colors ease-in outline-none focus-visible:ring-3"
        >
          View Our Coverage
          <ArrowRight class="size-4" />
        </NuxtLink>
      </div>

      <div
        class="bg-dark-blue relative aspect-4/3 overflow-hidden rounded-xl border border-white/10 shadow-2xl shadow-black/10"
      >
        <EarthCoverage class="absolute inset-0 size-full" />
        <ul
          aria-label="Supported networks"
          class="text-dark-blue absolute inset-x-3 bottom-3 flex flex-wrap items-center gap-x-5 gap-y-1 rounded-2xl bg-white/85 px-4 py-3 text-sm font-semibold backdrop-blur-md sm:inset-x-4 sm:bottom-4 sm:gap-x-6"
        >
          <li v-for="network in networks" :key="network">{{ network }}</li>
          <li class="text-sky-600">Africa-wide</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'

const networks = ['MTN', 'Airtel', 'Glo', 'T2']
</script>
