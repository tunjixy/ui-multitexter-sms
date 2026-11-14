<template>
  <div class="py-6">
    <div class="dashboard-wrapper">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Sent messages</h1>
          <p class="text-muted-foreground mt-1 max-w-xl text-sm">
            Every message you've sent, with its recipients, cost and status.
            Send one again with a few edits, or delete the ones you don't need.
          </p>
        </div>
        <UiButton radius="lg" @click="navigateTo('/dashboard/compose-sms')">
          <template #leading>
            <SendIcon class="size-4" />
          </template>
          Compose SMS
        </UiButton>
      </div>

      <p class="text-muted-foreground mt-4 flex items-center gap-2 text-sm">
        <ClockIcon class="size-4 shrink-0" />
        Sent messages are kept for 90 days, then deleted automatically.
      </p>

      <SentMessageListing class="mt-6" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ClockIcon, SendIcon } from '@lucide/vue'

useAppStore().setPageTitle('Sent SMS')

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useHead({
  title: 'Sent SMS',
})
</script>
