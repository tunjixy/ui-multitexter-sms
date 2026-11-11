<template>
  <section class="py-16 lg:py-24">
    <div class="wrapper grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
      <div>
        <p
          class="text-primary text-xs font-semibold tracking-[0.25em] uppercase"
        >
          Pay As You Use
        </p>
        <h2
          class="mt-4 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl"
        >
          Pay per unit, priced by volume.
        </h2>
        <p class="text-muted-foreground mt-5 max-w-xl leading-relaxed">
          Units are billed on a sliding scale. Find your package below, or use
          the calculator to estimate the cost of your next campaign.
        </p>

        <PricingListing :active-tier="activeTier" class="mt-10" />
      </div>

      <PriceCalculator v-model:tier="activeTier" />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Price } from '@/types/pricing'

const activeTier = ref<Price | null>(null)
</script>
