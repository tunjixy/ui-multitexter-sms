<template>
  <div class="py-6">
    <div class="dashboard-wrapper">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Birthdays</h1>
          <p class="text-muted-foreground mt-1 max-w-xl text-sm">
            We'll text your customers, staff and loved ones on their birthday,
            every year, at the time you choose.
          </p>
        </div>
        <div class="flex flex-wrap gap-3">
          <UiButton
            variant="outline"
            radius="lg"
            @click="navigateTo('/dashboard/birthdays/add')"
          >
            <template #leading>
              <PlusIcon class="size-4" />
            </template>
            Add
          </UiButton>
          <UiButton
            variant="outline"
            radius="lg"
            @click="navigateTo('/dashboard/birthdays/upload')"
          >
            <template #leading>
              <UploadIcon class="size-4" />
            </template>
            Upload
          </UiButton>
        </div>
      </div>

      <BirthdayListing class="mt-6" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon, UploadIcon } from '@lucide/vue'

useAppStore().setPageTitle('Birthdays')

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useHead({
  title: 'Birthdays',
})
</script>
