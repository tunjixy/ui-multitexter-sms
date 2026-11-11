<template>
  <div class="py-6">
    <div class="dashboard-wrapper"></div>
  </div>
</template>

<script setup lang="ts">
useAppStore().setPageTitle('Buy SMS Units')

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useHead({
  title: 'Buy SMS Units',
})
</script>
