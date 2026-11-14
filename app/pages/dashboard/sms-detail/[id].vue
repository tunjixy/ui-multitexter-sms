<template>
  <div class="py-6">
    <div class="dashboard-wrapper">
      <NuxtLink
        to="/dashboard/sent-sms-status"
        class="text-muted-foreground hover:text-foreground focus-visible:ring-primary/35 inline-flex items-center gap-1.5 rounded-sm text-sm font-medium transition-colors outline-none focus-visible:ring-2"
      >
        <ArrowLeftIcon class="size-4" />
        SMS status
      </NuxtLink>

      <h1 class="mt-4 text-2xl font-bold tracking-tight">SMS detail</h1>
      <p class="text-muted-foreground mt-1 max-w-xl text-sm">
        Follow this bulk message as it's processed. Check its status while it's
        still processing, or resend it if it didn't go through.
      </p>

      <DetailSummary :id="id" class="mt-6" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeftIcon } from '@lucide/vue'

useAppStore().setPageTitle('SMS Detail')

const id = Number(useRoute().params.id)

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useHead({
  title: 'SMS Detail',
})
</script>
