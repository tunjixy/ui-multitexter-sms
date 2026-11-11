<template>
  <div>
    <PricingHero />
    <PricingSectionTwo />
  </div>
</template>

<script setup lang="ts">
import type { PriceRes } from '@/types/pricing'

const { BASE_URL } = useRuntimeConfig().public
const { prices } = usePricing()

const { data, error } = await useFetch<PriceRes>('prices', {
  baseURL: BASE_URL,
  key: 'prices',
  getCachedData: (key, nuxtApp) =>
    nuxtApp.payload.data[key] || nuxtApp.static.data[key],
})

if (error.value) {
  throw createError({
    status: 502,
    statusText: 'Could not load prices',
    fatal: true,
  })
}

prices.value =
  data.value?.status === 1
    ? [...data.value.data].sort((a, b) => a.minimum_units - b.minimum_units)
    : []

usePageSeo({
  title: 'Bulk SMS Pricing in Nigeria',
  description:
    'Simple bulk SMS pricing: buy units as you need them, and the more you buy, the lower your price per unit. No maximum limit on the units you can buy.',
})
</script>
