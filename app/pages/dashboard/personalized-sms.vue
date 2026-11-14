<template>
  <div class="py-6">
    <div class="dashboard-wrapper">
      <h1 class="text-2xl font-bold tracking-tight">Personalized SMS</h1>
      <p class="text-muted-foreground mt-1 max-w-xl text-sm">
        Send each recipient their own message. Upload a CSV of numbers and
        messages, check how the first one reads, then send them all at once.
      </p>

      <div class="mt-6 max-w-2xl space-y-6">
        <PersonalizedUpload v-model="template" />
        <PersonalizedForm
          v-if="template"
          :template="template"
          @sent="template = null"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PersonalizedTemplate } from '@/types/personalized'

const template = ref<PersonalizedTemplate | null>(null)

useAppStore().setPageTitle('Personalized SMS')

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useHead({
  title: 'Personalized SMS',
})
</script>
