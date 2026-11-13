<template>
  <div class="py-6">
    <div class="dashboard-wrapper">
      <h1 class="text-2xl font-bold tracking-tight">Share units</h1>
      <p class="text-muted-foreground mt-1 max-w-xl text-sm">
        Send units from your balance to another Multitexter account using their
        email address.
      </p>

      <ShareUnitForm class="mt-6" />
      <SharedUnitListing class="mt-10" />
    </div>
  </div>
</template>

<script setup lang="ts">
useAppStore().setPageTitle('Share Unit')

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useHead({
  title: 'Share Unit',
})
</script>
