<template>
  <section>
    <h2 class="text-lg font-semibold tracking-tight">Account stats</h2>

    <div v-if="loading" class="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <UiSkeleton v-for="n in 4" :key="n" class="h-28 w-full rounded-2xl" />
    </div>

    <UiErrorState
      v-else-if="error || !summary"
      description="We couldn't load your account stats right now. Please try again."
      class="mt-4"
      @try-again="fetchSummary"
    />

    <ul v-else class="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <li
        v-for="stat in stats"
        :key="stat.label"
        class="border-border bg-surface rounded-2xl border p-5"
      >
        <p class="text-muted-foreground flex items-center gap-2 text-sm">
          <component :is="stat.icon" class="text-primary size-4 shrink-0" />
          {{ stat.label }}
        </p>
        <p class="mt-3 text-2xl font-bold tracking-tight">
          {{ stat.value }}
        </p>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { BookUserIcon, HandCoinsIcon, SendIcon, UsersIcon } from '@lucide/vue'
import { apiClient } from '@/repository/api'
import type { ProfileSummary } from '@/types/profile'

const summary = ref<ProfileSummary | null>(null)
const loading = ref(true)
const error = ref(false)

const stats = computed(() => {
  if (!summary.value) return []
  const { total_message, total_contacts, no_referer, total_commission } =
    summary.value
  return [
    {
      icon: SendIcon,
      label: 'Messages sent',
      value: formatNumberWithComma(total_message || 0),
    },
    {
      icon: BookUserIcon,
      label: 'Contacts',
      value: formatNumberWithComma(total_contacts || 0),
    },
    {
      icon: UsersIcon,
      label: 'People referred',
      value: formatNumberWithComma(no_referer || 0),
    },
    {
      icon: HandCoinsIcon,
      label: 'Commission earned',
      value: formatNaira(Number(total_commission) || 0),
    },
  ]
})

const fetchSummary = async () => {
  try {
    loading.value = true
    error.value = false
    const response = await apiClient.profile.fetchProfileSummary()
    summary.value = response.success
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(fetchSummary)
</script>
