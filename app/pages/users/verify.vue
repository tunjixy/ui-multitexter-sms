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
      <h1 class="mt-6 text-xl font-semibold tracking-tight">
        Verifying your account
      </h1>
      <p class="text-muted-foreground mt-2 text-sm">
        This will only take a moment.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { apiClient } from '@/repository/api'

const route = useRoute()
const { $toast } = useNuxtApp()
const userStore = useUserStore()

onMounted(async () => {
  try {
    const response = await apiClient.user.activate({
      activation_code: route.query.verify as string,
    })
    if (response.status === 1) {
      navigateTo(
        userStore.isLoggedIn ? '/dashboard?activated=1' : '/login?activated=1',
      )
    } else if (response.status === -2) {
      navigateTo('/resend-activation?activated=0')
    } else if (response.status === -3) {
      navigateTo(userStore.isLoggedIn ? '/dashboard?activated=3' : '/login')
    } else {
      navigateTo('/')
    }
  } catch (err) {
    $toast.error(formatErrorResponse(err))
    navigateTo('/')
  }
})

definePageMeta({
  layout: 'secondary',
})

useHead({
  title: 'Verify Account',
})
</script>
