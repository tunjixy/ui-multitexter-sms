<template>
  <div class="py-6">
    <div class="dashboard-wrapper"></div>
  </div>
</template>

<script setup lang="ts">
useAppStore().setPageTitle('Share Credit')

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useHead({
  title: 'Share Credit',
})
</script>
