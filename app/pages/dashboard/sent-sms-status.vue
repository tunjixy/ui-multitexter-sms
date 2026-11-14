<template>
  <div class="py-6">
    <div class="dashboard-wrapper">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">SMS status</h1>
          <p class="text-muted-foreground mt-1 max-w-xl text-sm">
            Follow each bulk message as it's processed. Check on the ones still
            processing, and resend any that didn't go through.
          </p>
        </div>
        <UiButton radius="lg" @click="navigateTo('/dashboard/compose-sms')">
          <template #leading>
            <SendIcon class="size-4" />
          </template>
          Compose SMS
        </UiButton>
      </div>

      <SMSStatusListing class="mt-6" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SendIcon } from '@lucide/vue'

useAppStore().setPageTitle('SMS Status')

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useHead({
  title: 'SMS Status',
})
</script>
