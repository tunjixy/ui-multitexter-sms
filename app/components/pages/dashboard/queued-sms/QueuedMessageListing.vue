<template>
  <section>
    <div v-if="loading && !messages" class="space-y-3">
      <UiSkeleton v-for="n in 5" :key="n" class="h-12 w-full rounded-lg" />
    </div>

    <UiErrorState v-else-if="error" @try-again="fetchMessages()" />

    <EmptyState
      v-else-if="!rows.length"
      :icon="HourglassIcon"
      title="No queued messages"
      description="Messages waiting to go out show up here, along with how many are still left to send."
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
        <h2 class="text-lg font-semibold">Queued messages</h2>
        <span
          class="bg-primary/10 text-primary inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold"
        >
          {{ formatNumberWithComma(total) }}
        </span>
      </div>

      <div
        :class="[
          'border-border mt-4 overflow-hidden rounded-lg border transition-opacity',
          loading && 'pointer-events-none opacity-60',
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
                <QueuedStatusBadge :completed="row.completed" />
              </TableCell>
              <TableCell>
                <span
                  class="block max-w-96 min-w-48 font-medium break-all whitespace-normal"
                >
                  {{ row.message.remotemsgids || '—' }}
                </span>
              </TableCell>
              <TableCell class="tabular-nums">
                {{ formatNumberWithComma(row.left) }}
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
import { HourglassIcon, SendIcon } from '@lucide/vue'
import { apiClient } from '@/repository/api'
import type { QueuedSMS } from '@/types/message'

const headings = ['', 'Status', 'Queue ID', 'Messages Left']

const messages = ref<QueuedSMS[] | null>(null)
const loading = ref(true)
const error = ref(false)
const currentPage = ref(1)
const perPage = ref(0)
const total = ref(0)

const totalPages = computed(() =>
  perPage.value ? Math.ceil(total.value / perPage.value) : 1,
)

const rows = computed(() =>
  (messages.value ?? []).map((message, index) => {
    const left = Number(message.total_left) || 0
    return {
      message,
      number: incrementPageNumber(index, perPage.value, currentPage.value),
      left,
      completed: left === 0,
    }
  }),
)

const fetchMessages = async (page = currentPage.value) => {
  try {
    loading.value = true
    error.value = false
    const response = await apiClient.message.fetchQueuedMessages(page)
    if (response.status === 1) {
      messages.value = response.data ?? []
      perPage.value = response.rows
      total.value = response.total
      currentPage.value = page
    }
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(fetchMessages)
</script>
