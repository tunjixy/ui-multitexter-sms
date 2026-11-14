<template>
  <div class="py-6">
    <div class="dashboard-wrapper">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Scheduled messages</h1>
          <p class="text-muted-foreground mt-1 max-w-xl text-sm">
            Messages set to go out later. Pause one to hold it back, resume it
            when you're ready, or edit it before it sends.
          </p>
        </div>
        <UiButton
          radius="lg"
          @click="
            navigateTo({
              path: '/dashboard/compose-sms',
              query: { new: 'true' },
            })
          "
        >
          <template #leading>
            <CalendarPlusIcon class="size-4" />
          </template>
          Schedule SMS
        </UiButton>
      </div>

      <ScheduledSMSListing class="mt-6" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CalendarPlusIcon } from '@lucide/vue'

useAppStore().setPageTitle('Scheduled SMS')

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useHead({
  title: 'Scheduled SMS',
})
</script>
