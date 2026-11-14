<template>
  <div class="py-6">
    <div class="dashboard-wrapper">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Queued messages</h1>
          <p class="text-muted-foreground mt-1 max-w-xl text-sm">
            Messages waiting to go out, with how many are still left to send in
            each queue. A queue is complete once none are left.
          </p>
        </div>
        <UiButton radius="lg" @click="navigateTo('/dashboard/compose-sms')">
          <template #leading>
            <SendIcon class="size-4" />
          </template>
          Compose SMS
        </UiButton>
      </div>

      <QueuedMessageListing class="mt-6" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SendIcon } from '@lucide/vue'

useAppStore().setPageTitle('Queued Messages')

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useHead({
  title: 'Queued Messages',
})
</script>
