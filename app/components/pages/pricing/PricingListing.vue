<template>
  <div>
    <EmptyState
      v-if="!tiers.length"
      :icon="Tag"
      title="Prices unavailable"
      description="We couldn't load our prices right now. Please check back soon."
    />

    <ol v-else class="space-y-3">
      <li
        v-for="(tier, index) in tiers"
        :key="tier.id"
        v-motion-slide-visible-once-bottom
        :delay="index * 75"
        :aria-current="tier.id === activeTier?.id ? 'true' : undefined"
        :class="[
          'bg-surface flex items-center gap-4 rounded-2xl border p-4 transition-[border-color,box-shadow] ease-in sm:gap-5 sm:p-5',
          tier.id === activeTier?.id
            ? 'border-primary ring-primary/20 ring-3'
            : 'border-border',
        ]"
      >
        <span
          class="border-border bg-background text-primary hidden size-10 shrink-0 items-center justify-center rounded-xl border text-xs font-semibold tabular-nums sm:flex"
        >
          {{ formatIndex(index) }}
        </span>

        <div class="min-w-0 flex-1">
          <h3
            class="flex flex-wrap items-center gap-x-2 gap-y-1 text-base font-semibold"
          >
            {{ tier.title }}
            <span
              v-if="tier.id === activeTier?.id"
              class="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[11px] font-medium"
            >
              Your estimate
            </span>
          </h3>
          <p class="text-muted-foreground mt-0.5 text-sm tabular-nums">
            {{ formatNumberWithComma(tier.minimum_units) }} –
            {{ formatNumberWithComma(tier.maximum_units) }} units
          </p>
          <p class="text-muted-foreground/80 mt-1 text-xs tabular-nums">
            Pay {{ formatNaira(tier.minimum_units * tier.price) }} –
            {{ formatNaira(tier.maximum_units * tier.price) }}
          </p>
        </div>

        <p class="shrink-0 text-right">
          <span class="text-2xl font-semibold tracking-tight tabular-nums">
            {{ formatNaira(tier.price, { fixed: true }) }}
          </span>
          <span class="text-muted-foreground block text-xs">per unit</span>
        </p>
      </li>
    </ol>

    <div
      v-motion-fade-visible-once
      :delay="200"
      class="border-border bg-surface mt-8 rounded-2xl border p-5"
    >
      <p class="flex items-center gap-2 text-sm font-semibold">
        <Info class="text-primary size-4" />
        Good to know
      </p>
      <ul class="text-muted-foreground mt-3 space-y-2 text-sm leading-relaxed">
        <li v-for="note in priceNotes" :key="note" class="flex gap-3">
          <span
            aria-hidden="true"
            class="bg-primary mt-2 size-1.5 shrink-0 rounded-full"
          />
          {{ note }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Info, Tag } from '@lucide/vue'
import type { Price } from '@/types/pricing'

const { activeTier = null } = defineProps<{
  activeTier?: Price | null
}>()

const { prices, priceNotes } = usePricing()
const tiers = computed(() => prices.value ?? [])

const formatIndex = (index: number) => String(index + 1).padStart(2, '0')
</script>
