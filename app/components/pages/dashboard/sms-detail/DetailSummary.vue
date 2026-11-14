<template>
  <section>
    <div
      v-if="loading && !detail"
      class="border-border bg-surface max-w-2xl rounded-2xl border p-6 sm:p-8"
    >
      <div class="flex items-center justify-between gap-3">
        <UiSkeleton class="h-6 w-24 rounded-md" />
        <UiSkeleton class="h-8 w-28 rounded-lg" />
      </div>
      <div class="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2">
        <div v-for="n in 2" :key="n">
          <UiSkeleton class="h-3 w-20 rounded" />
          <UiSkeleton class="mt-2 h-5 w-40 max-w-full rounded" />
        </div>
      </div>
      <UiSkeleton class="mt-5 h-3 w-20 rounded" />
      <UiSkeleton class="mt-2 h-5 w-full rounded" />
      <UiSkeleton class="mt-5 h-3 w-20 rounded" />
      <UiSkeleton class="mt-2 h-24 w-full rounded-lg" />
    </div>

    <UiErrorState v-else-if="error" @try-again="fetchDetail" />

    <EmptyState
      v-else-if="!detail"
      :icon="SearchXIcon"
      title="We couldn't find this message"
      description="The link may be wrong, or the message is no longer available. Your SMS status page lists every bulk message you've sent."
    >
      <template #actions>
        <UiButton
          variant="outline"
          radius="lg"
          @click="navigateTo('/dashboard/sent-sms-status')"
        >
          Go to SMS status
        </UiButton>
      </template>
    </EmptyState>

    <div
      v-else
      class="border-border bg-surface max-w-2xl rounded-2xl border p-6 sm:p-8"
    >
      <div class="flex flex-wrap items-center justify-between gap-3">
        <SMSStatusBadge :status="detail.status" />
        <UiButton
          v-if="processing"
          variant="outline"
          size="sm"
          radius="lg"
          :loading="pending"
          @click="checkStatus"
        >
          <template #leading>
            <RefreshCwIcon class="size-3.5" />
          </template>
          Check status
        </UiButton>
        <UiButton
          v-else-if="failed"
          size="sm"
          radius="lg"
          :loading="pending"
          @click="resendMessage"
        >
          <template #leading>
            <RotateCcwIcon class="size-3.5" />
          </template>
          Resend
        </UiButton>
      </div>

      <div class="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2">
        <div v-for="item in details" :key="item.label">
          <div class="text-muted-foreground text-xs">{{ item.label }}</div>
          <div class="mt-1 font-medium wrap-break-word">{{ item.value }}</div>
        </div>

        <div class="sm:col-span-2">
          <div class="text-muted-foreground text-xs">Feedback</div>
          <div class="mt-1 font-medium wrap-break-word">
            {{ detail.comment || '—' }}
          </div>
        </div>

        <div class="sm:col-span-2">
          <div class="text-muted-foreground text-xs">Message</div>
          <div
            class="border-border bg-background mt-1.5 rounded-lg border p-4 wrap-break-word whitespace-pre-line"
          >
            {{ detail.message || '—' }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RefreshCwIcon, RotateCcwIcon, SearchXIcon } from '@lucide/vue'
import { apiClient } from '@/repository/api'
import type { SMSDetail } from '@/types/message'

const props = defineProps<{
  id: number
}>()

const { $toast } = useNuxtApp()

const detail = ref<SMSDetail | null>(null)
const loading = ref(true)
const error = ref(false)
const pending = ref(false)

const status = computed(() => detail.value?.status?.toLowerCase())
const processing = computed(() => status.value === 'processing')
const failed = computed(
  () => !!detail.value && !processing.value && status.value !== 'completed',
)

const details = computed(() => {
  if (!detail.value) return []
  const { displayname, created_at } = detail.value

  return [
    { label: 'Sender name', value: displayname || '—' },
    {
      label: 'Created',
      value:
        !created_at || created_at.startsWith('0000')
          ? '—'
          : useDateFormat(created_at, 'Do MMMM YYYY, h:mm A').value,
    },
  ]
})

const fetchDetail = async () => {
  try {
    loading.value = true
    error.value = false
    const response = await apiClient.message.fetchSMSDetail(props.id)
    detail.value = response.status === 1 ? (response.data ?? null) : null
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

const refreshDetail = async () => {
  const response = await apiClient.message.fetchSMSDetail(props.id)
  if (response.status === 1 && response.data) detail.value = response.data
}

const checkStatus = async () => {
  try {
    pending.value = true
    await refreshDetail()
  } catch (err) {
    $toast.error(formatErrorResponse(err))
  } finally {
    pending.value = false
  }
}

const resendMessage = async () => {
  if (!detail.value) return
  try {
    pending.value = true
    const response = await apiClient.message.resendSMS(
      detail.value.remote_msg_id,
    )
    if (response.status === 1) {
      $toast.success(response.msg || 'Message restarted.')
      await refreshDetail()
    } else {
      $toast.error(
        response.msg || "We couldn't resend this message. Please try again.",
      )
    }
  } catch (err) {
    $toast.error(formatErrorResponse(err))
  } finally {
    pending.value = false
  }
}

onMounted(() => {
  if (props.id) fetchDetail()
  else loading.value = false
})
</script>
