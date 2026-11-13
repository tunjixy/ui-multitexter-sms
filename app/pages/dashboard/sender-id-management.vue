<template>
  <div class="py-6">
    <div class="dashboard-wrapper"></div>
  </div>
</template>

<script setup lang="ts">
useAppStore().setPageTitle('Register Sender ID')

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useHead({
  title: 'Sender ID Management',
})
</script>
