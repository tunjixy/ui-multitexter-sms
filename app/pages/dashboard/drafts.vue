<template>
  <div class="py-6">
    <div class="dashboard-wrapper">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Drafts</h1>
          <p class="text-muted-foreground mt-1 max-w-xl text-sm">
            Messages you saved to finish later. Pick one up where you left off,
            or delete the ones you no longer need.
          </p>
        </div>
        <UiButton radius="lg" @click="navigateTo('/dashboard/compose-sms')">
          <template #leading>
            <SendIcon class="size-4" />
          </template>
          Compose SMS
        </UiButton>
      </div>

      <DraftListing class="mt-6" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SendIcon } from '@lucide/vue'

useAppStore().setPageTitle('Drafts')

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useHead({
  title: 'Drafts',
})
</script>
