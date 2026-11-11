<template>
  <section class="flex min-h-dvh items-center justify-center">
    <div
      role="status"
      aria-live="polite"
      class="wrapper flex flex-col items-center text-center"
    >
      <span
        aria-hidden="true"
        class="border-primary/20 border-t-primary size-12 rounded-full border-3 motion-safe:animate-spin"
      />
      <h1 class="mt-6 text-xl font-semibold tracking-tight">Verifying</h1>
      <p class="text-muted-foreground mt-2 text-sm">
        This will only take a moment.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { apiClient } from '@/repository/api'

onMounted(async () => {
  try {
    const response = await apiClient.user.detail()
    if (response.success) {
      navigateTo('/dashboard/buy-sms-online')
    }
  } catch (err: any) {
    navigateTo('/')
  }
})

useHead({
  title: 'Verifying',
})

definePageMeta({
  layout: 'secondary',
})
</script>
