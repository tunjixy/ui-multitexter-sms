<template>
  <div></div>
</template>

<script setup lang="ts">
useAppStore().setPageTitle('Compose SMS')

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useHead({
  title: 'Compose SMS',
})
</script>
