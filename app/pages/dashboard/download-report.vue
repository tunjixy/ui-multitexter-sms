<template>
  <div class="py-6">
    <div class="dashboard-wrapper">
      <h1 class="text-2xl font-bold tracking-tight">Download reports</h1>
      <p class="text-muted-foreground mt-1 max-w-xl text-sm">
        Export the delivery reports for a date range as an Excel spreadsheet.
        Narrow it down by sender name or status if you need to.
      </p>

      <ReportDownloadForm class="mt-6" />
    </div>
  </div>
</template>

<script setup lang="ts">
useAppStore().setPageTitle('Download Reports')

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useHead({
  title: 'Download Reports',
})
</script>
