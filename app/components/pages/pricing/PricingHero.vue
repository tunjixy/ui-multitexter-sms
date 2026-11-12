<template>
  <section class="border-border relative overflow-hidden border-b">
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--color-muted-foreground)_1px,transparent_1px)] mask-[linear-gradient(to_bottom,black,transparent)] bg-size-[24px_24px] opacity-25"
    />
    <div
      aria-hidden="true"
      class="bg-primary/15 pointer-events-none absolute -top-56 -right-32 size-144 rounded-full blur-3xl"
    />

    <div class="wrapper relative py-16 lg:py-24">
      <p
        v-motion-fade-visible-once
        class="text-primary text-xs font-semibold tracking-[0.25em] uppercase"
      >
        Pricing
      </p>
      <h1
        v-motion-reveal
        :delay="100"
        class="mt-4 max-w-3xl text-4xl leading-[1.15] font-semibold tracking-tight text-balance sm:text-5xl xl:text-6xl"
      >
        The more you send, the less you pay.
      </h1>
      <p
        v-motion-fade-visible-once
        :delay="300"
        class="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed sm:text-lg"
      >
        Our pricing is simple: buy units as you need them, and the more you buy,
        the lower your price per unit. There's no maximum limit to the units you
        can purchase at any time.
      </p>

      <div
        v-motion-fade-visible-once
        :delay="450"
        class="mt-8 flex flex-wrap gap-3"
      >
        <a
          href="#calculator"
          class="bg-primary text-dark-blue hover:bg-primary/85 focus-visible:ring-primary/40 flex h-11 items-center gap-2 rounded-lg px-6 text-sm font-semibold transition-colors ease-in outline-none focus-visible:ring-3"
        >
          <Calculator class="size-4" />
          Calculate your cost
        </a>
        <NuxtLink
          to="/contact-sales"
          class="border-border hover:bg-primary/10 focus-visible:ring-primary/30 flex h-11 items-center gap-2 rounded-lg border px-6 text-sm font-semibold transition-colors ease-in outline-none focus-visible:ring-3"
        >
          Talk to sales
          <ArrowRight class="size-4" />
        </NuxtLink>
      </div>

      <dl
        v-if="stats.length"
        v-motion-fade-visible-once
        :delay="550"
        class="mt-12 flex flex-wrap gap-x-12 gap-y-6"
      >
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="flex flex-col-reverse"
        >
          <dt class="text-muted-foreground mt-1 text-sm">{{ stat.label }}</dt>
          <dd class="text-3xl font-semibold tracking-tight tabular-nums">
            {{ stat.value }}
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowRight, Calculator } from '@lucide/vue'

const { prices } = usePricing()

const stats = computed(() => {
  if (!prices.value?.length) return []

  const lowest = Math.min(...prices.value.map(({ price }) => price))

  return [
    { label: 'Lowest price per unit', value: `₦${lowest.toFixed(2)}` },
    { label: 'Volume tiers', value: prices.value.length },
    { label: 'Units you can buy', value: 'No limit' },
  ]
})
</script>
