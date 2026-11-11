<template>
  <div class="py-6">
    <div class="dashboard-wrapper"></div>
  </div>
</template>

<script setup lang="ts">
useAppStore().setPageTitle('Pricing')

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useHead({
  title: 'Pricing',
})
</script>
