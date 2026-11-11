<template>
  <div>
    <CoverageHero :coverages="coverages" />
    <CoverageSectionTwo :coverages="coverages" />
  </div>
</template>

<script setup lang="ts">
import type { CoverageRes } from '@/types/coverage'

const { BASE_URL } = useRuntimeConfig().public

const { data, error } = await useFetch<CoverageRes>('/coverage-prices', {
  baseURL: BASE_URL,
  key: 'coverage',
  getCachedData: (key, nuxtApp) =>
    nuxtApp.payload.data[key] || nuxtApp.static.data[key],
})

if (error.value) {
  throw createError({
    status: 502,
    statusText: 'Could not load coverage data',
    fatal: true,
  })
}

const coverages = computed(() =>
  data.value?.status === 1 ? data.value.data : [],
)

usePageSeo({
  title: 'SMS Coverage in Nigeria and Worldwide',
  description:
    'Send SMS to mobile networks across Nigeria and around the world. Find your destination to see how many networks Multitexter reaches there.',
})
</script>
