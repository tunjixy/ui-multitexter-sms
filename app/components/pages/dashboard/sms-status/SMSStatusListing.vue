<template>
  <section>
    <div v-if="loading && !messages" class="space-y-3">
      <UiSkeleton v-for="n in 5" :key="n" class="h-12 w-full rounded-lg" />
    </div>

    <UiErrorState v-else-if="error" @try-again="fetchMessages()" />

    <EmptyState
      v-else-if="!rows.length"
      :icon="MessageSquareDotIcon"
      title="No messages to track yet"
      description="Each bulk message you send shows up here while it's processed. You can check on messages still processing and resend any that failed."
    >
      <template #actions>
        <UiButton radius="lg" @click="navigateTo('/dashboard/compose-sms')">
          <template #leading>
            <SendIcon class="size-4" />
          </template>
          Compose SMS
        </UiButton>
      </template>
    </EmptyState>

    <template v-else>
      <div class="flex items-center gap-2">
        <h2 class="text-lg font-semibold">SMS status</h2>
        <span
          class="bg-primary/10 text-primary inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold"
        >
          {{ formatNumberWithComma(total) }}
        </span>
      </div>

      <div
        :class="[
          'border-border mt-4 overflow-hidden rounded-lg border transition-opacity',
          loading && !pendingId && 'pointer-events-none opacity-60',
        ]"
      >
        <UiTable>
          <TableHeader>
            <TableRow>
              <TableHead v-for="(heading, index) in headings" :key="index">
                {{ heading }}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="row in rows" :key="row.message.id">
              <TableCell class="text-muted-foreground w-12">
                {{ row.number }}.
              </TableCell>
              <TableCell>
                <SMSStatusBadge :status="row.message.status" />
              </TableCell>
              <TableCell class="font-medium">
                {{ row.message.displayname || '—' }}
              </TableCell>
              <TableCell>
                <span class="block max-w-64 truncate">
                  {{ row.message.message || '—' }}
                </span>
              </TableCell>
              <TableCell>
                <span
                  class="text-muted-foreground block max-w-72 min-w-48 whitespace-normal"
                >
                  {{ row.message.comment || '—' }}
                </span>
              </TableCell>
              <TableCell>
                <template v-if="row.createdOn">
                  {{ row.createdOn.date }}
                  <span class="text-muted-foreground block text-xs">
                    {{ row.createdOn.time }}
                  </span>
                </template>
                <span v-else class="text-muted-foreground">—</span>
              </TableCell>
              <TableCell class="text-right">
                <UiButton
                  v-if="row.processing"
                  variant="outline"
                  size="sm"
                  radius="lg"
                  :loading="pendingId === row.message.id"
                  :disabled="!!pendingId"
                  @click="checkStatus(row.message)"
                >
                  <template #leading>
                    <RefreshCwIcon class="size-3.5" />
                  </template>
                  Check status
                </UiButton>
                <UiButton
                  v-else-if="row.failed"
                  variant="outline"
                  size="sm"
                  radius="lg"
                  :loading="pendingId === row.message.id"
                  :disabled="!!pendingId"
                  @click="resendMessage(row.message)"
                >
                  <template #leading>
                    <RotateCcwIcon class="size-3.5" />
                  </template>
                  Resend
                </UiButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </UiTable>

        <UiPagination
          v-if="totalPages > 1"
          :current-page="currentPage"
          :total-pages="totalPages"
          @previous="fetchMessages(currentPage - 1)"
          @next="fetchMessages(currentPage + 1)"
          @goto="fetchMessages"
        />
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import {
  MessageSquareDotIcon,
  RefreshCwIcon,
  RotateCcwIcon,
  SendIcon,
} from '@lucide/vue'
import { apiClient } from '@/repository/api'
import type { SMSStatus } from '@/types/message'

const { $toast } = useNuxtApp()

const headings = [
  '',
  'Status',
  'Sender Name',
  'Message',
  'Feedback',
  'Date',
  '',
]

const messages = ref<SMSStatus[] | null>(null)
const loading = ref(true)
const error = ref(false)
const currentPage = ref(1)
const perPage = ref(0)
const total = ref(0)
const pendingId = ref<number | null>(null)

const totalPages = computed(() =>
  perPage.value ? Math.ceil(total.value / perPage.value) : 1,
)

const createdOn = (value: string | null | undefined) =>
  !value || value.startsWith('0000')
    ? null
    : {
        date: useDateFormat(value, 'Do MMM YYYY').value,
        time: useDateFormat(value, 'h:mm a').value,
      }

const rows = computed(() =>
  (messages.value ?? []).map((message, index) => {
    const status = message.status?.toLowerCase()
    return {
      message,
      number: incrementPageNumber(index, perPage.value, currentPage.value),
      processing: status === 'processing',
      failed: status !== 'processing' && status !== 'completed',
      createdOn: createdOn(message.created_at),
    }
  }),
)

const fetchMessages = async (page = currentPage.value) => {
  try {
    loading.value = true
    error.value = false
    const response = await apiClient.message.fetchSMSStatus(page)
    if (response.status === 1) {
      messages.value = response.data.data ?? []
      perPage.value = response.data.per_page
      total.value = response.data.total
      currentPage.value = page
    }
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

const checkStatus = async (message: SMSStatus) => {
  pendingId.value = message.id
  await fetchMessages()
  pendingId.value = null
}

const resendMessage = async (message: SMSStatus) => {
  try {
    pendingId.value = message.id
    const response = await apiClient.message.resendSMS(message.remote_msg_id)
    if (response.status === 1) {
      $toast.success(response.msg || 'Message restarted.')
      await fetchMessages()
    } else {
      $toast.error(
        response.msg || "We couldn't resend this message. Please try again.",
      )
    }
  } catch (err) {
    $toast.error(formatErrorResponse(err))
  } finally {
    pendingId.value = null
  }
}

onMounted(fetchMessages)
</script>
