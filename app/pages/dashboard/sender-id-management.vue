<template>
  <div class="py-6">
    <div class="dashboard-wrapper">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Sender IDs</h1>
          <p class="text-muted-foreground mt-1 max-w-xl text-sm">
            A sender ID is the name your messages come from, like your brand. We
            review every request, and you can send with an ID once it's
            approved.
          </p>
        </div>
        <UiButton radius="lg" @click="senderIdListing?.createSenderId()">
          <template #leading>
            <PlusIcon class="size-4" />
          </template>
          New request
        </UiButton>
      </div>

      <SenderIdListing ref="senderIdListing" class="mt-6" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon } from '@lucide/vue'

const senderIdListing = useTemplateRef('senderIdListing')

useAppStore().setPageTitle('Register Sender ID')

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useHead({
  title: 'Sender ID Management',
})
</script>
