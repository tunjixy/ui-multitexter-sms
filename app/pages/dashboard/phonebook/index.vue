<template>
  <div class="py-6">
    <div class="dashboard-wrapper">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Phonebook</h1>
          <p class="text-muted-foreground mt-1 max-w-xl text-sm">
            Keep your contacts in lists, so you can text a whole group at once.
          </p>
        </div>
        <UiButton radius="lg" @click="phonebookList?.createList()">
          <template #leading>
            <PlusIcon class="size-4" />
          </template>
          New list
        </UiButton>
      </div>

      <PhonebookList ref="phonebookList" class="mt-6" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon } from '@lucide/vue'

useAppStore().setPageTitle('My Phonebook')

const phonebookList = useTemplateRef('phonebookList')

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useHead({
  title: 'My Phonebook',
})
</script>
