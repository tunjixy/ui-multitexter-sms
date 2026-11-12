<template>
  <div class="py-6">
    <div class="dashboard-wrapper">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Low balance alerts</h1>
          <p class="text-muted-foreground mt-1 max-w-xl text-sm">
            We'll text and email you when your balance runs low, so you can
            recharge before your messages stop sending.
          </p>
        </div>
        <UiButton
          v-if="alert"
          variant="outline"
          radius="lg"
          @click="editing = true"
        >
          <template #leading>
            <PencilIcon class="size-4" />
          </template>
          Edit settings
        </UiButton>
      </div>

      <div class="mt-6">
        <div v-if="loading" class="grid gap-5 lg:grid-cols-3">
          <UiSkeleton v-for="n in 3" :key="n" class="h-44 w-full rounded-2xl" />
        </div>

        <UiErrorState v-else-if="error || !alert" @try-again="fetchAlert" />

        <template v-else>
          <ul class="grid gap-5 lg:grid-cols-3">
            <li
              v-for="card in cards"
              :key="card.title"
              class="border-border bg-surface flex flex-col rounded-2xl border p-6"
            >
              <div class="flex items-center gap-3">
                <span
                  class="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl"
                >
                  <component :is="card.icon" class="size-5" />
                </span>
                <h2 class="font-semibold">{{ card.title }}</h2>
              </div>

              <p class="mt-5 text-2xl font-bold tracking-tight">
                {{ card.value }}
              </p>
              <p class="text-muted-foreground mt-1 text-sm">
                {{ card.caption }}
              </p>

              <p
                v-if="card.recipient !== undefined"
                class="mt-0.5 text-sm font-medium break-all"
              >
                {{ card.recipient || 'Not set' }}
              </p>
            </li>
          </ul>

          <EditAlertModal
            v-model:open="editing"
            :alert="alert"
            @updated="alert = $event"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CoinsIcon,
  MailIcon,
  MessageSquareTextIcon,
  PencilIcon,
} from '@lucide/vue'
import { apiClient } from '@/repository/api'
import type { Alert } from '@/types/alert'

useAppStore().setPageTitle('Alerts')

const alert = ref<Alert | null>(null)
const loading = ref(true)
const error = ref(false)
const editing = ref(false)

const formatInterval = (days: number) => {
  if (!days) return 'Not set'
  return days === 1 ? 'Every day' : `Every ${formatNumberWithComma(days)} days`
}

const cards = computed(() => {
  if (!alert.value) return []
  const {
    low_balance_threshold,
    sms_frequency,
    sms_to,
    email_frequency,
    email_to,
  } = alert.value

  return [
    {
      icon: CoinsIcon,
      title: 'Threshold',
      value: `${formatNumberWithComma(low_balance_threshold)} units`,
      caption: 'Alerts start when your balance drops below this.',
    },
    {
      icon: MessageSquareTextIcon,
      title: 'SMS alerts',
      value: formatInterval(sms_frequency),
      caption: 'Sent to',
      recipient: formatPhoneNumber(sms_to),
    },
    {
      icon: MailIcon,
      title: 'Email alerts',
      value: formatInterval(email_frequency),
      caption: 'Sent to',
      recipient: email_to,
    },
  ]
})

const fetchAlert = async () => {
  try {
    loading.value = true
    error.value = false
    const response = await apiClient.alert.fetchAlert()
    if (response.status === 1) {
      alert.value = response.data
    }
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(fetchAlert)

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useHead({
  title: 'Alerts',
})
</script>
