<template>
  <div class="py-6">
    <div class="dashboard-wrapper">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div class="min-w-0">
          <h1 class="text-2xl font-bold tracking-tight wrap-break-word">
            {{ greeting }}
          </h1>
          <p class="text-muted-foreground mt-1 max-w-xl text-sm">
            Your balance, how your messages are doing and shortcuts to what you
            use most.
          </p>
        </div>
        <UiButton radius="lg" @click="navigateTo('/dashboard/compose-sms')">
          <template #leading>
            <MessageSquarePlusIcon class="size-4" />
          </template>
          Compose SMS
        </UiButton>
      </div>

      <AccountBalance class="mt-6" />
      <AccountStats class="mt-10" />
      <QuickActions class="mt-10" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { MessageSquarePlusIcon } from '@lucide/vue'

useAppStore().setPageTitle('Account Overview')

const route = useRoute()
const { $toast } = useNuxtApp()
const { user } = storeToRefs(useUserStore())

const greeting = computed(() => {
  const hour = new Date().getHours()
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
  const name = user.value?.firstname?.trim()
  return `Good ${timeOfDay}${name ? `, ${name}` : ''}`
})

const activationMessages: Record<string, string> = {
  1: 'Your account has been verified',
  3: 'Your account has already been verified',
}

onMounted(() => {
  const message = activationMessages[String(route.query.activated)]
  if (!message) return
  $toast.success(message)
  navigateTo({ query: {} }, { replace: true })
})

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useHead({
  title: 'Overview',
})
</script>
