<template>
  <section>
    <div v-if="loading && !messages" class="space-y-3">
      <UiSkeleton v-for="n in 5" :key="n" class="h-12 w-full rounded-lg" />
    </div>

    <UiErrorState v-else-if="error" @try-again="fetchMessages()" />

    <EmptyState
      v-else-if="!rows.length"
      :icon="MailIcon"
      title="No sent messages yet"
      description="Messages you send show up here for 90 days, along with their recipients, cost and status."
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
        <h2 class="text-lg font-semibold">Sent messages</h2>
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
            <TableRow
              v-for="row in rows"
              :key="row.message.id"
              class="cursor-pointer"
              @click="viewMessage(row.message)"
            >
              <TableCell class="text-muted-foreground w-12">
                {{ row.number }}.
              </TableCell>
              <TableCell class="font-medium">
                {{ row.message.sender_name || '—' }}
              </TableCell>
              <TableCell class="tabular-nums">
                <template v-if="row.recipients.length">
                  {{ row.recipients[0] }}
                  <span
                    v-if="row.recipients.length > 1"
                    class="text-muted-foreground block text-xs"
                  >
                    +{{ formatNumberWithComma(row.recipients.length - 1) }}
                    more
                  </span>
                </template>
                <span v-else class="text-muted-foreground">—</span>
              </TableCell>
              <TableCell>
                <span class="block max-w-64 truncate">
                  {{ row.message.content || '—' }}
                </span>
              </TableCell>
              <TableCell class="tabular-nums">
                {{ formatNumberWithComma(row.message.volume) }}
              </TableCell>
              <TableCell>
                <template v-if="row.sentOn">
                  {{ row.sentOn.date }}
                  <span class="text-muted-foreground block text-xs">
                    {{ row.sentOn.time }}
                  </span>
                </template>
                <span v-else class="text-muted-foreground">—</span>
              </TableCell>
              <TableCell>
                <ReportStatusBadge :status="row.message.status" />
              </TableCell>
              <TableCell class="w-16" @click.stop>
                <UiDropdownMenu
                  :items="menuItems"
                  placement="end"
                  @select="onSelect($event, row.message)"
                >
                  <button
                    type="button"
                    aria-label="Message actions"
                    class="border-border text-muted-foreground hover:bg-foreground/5 hover:text-foreground focus-visible:ring-primary/35 inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border transition-colors outline-none focus-visible:ring-3"
                  >
                    <EllipsisIcon class="size-4" />
                  </button>
                </UiDropdownMenu>
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

    <SentMessageDetailModal
      v-model:open="viewing"
      :message="selected"
      @resend="resendMessage(selected!)"
    />
    <DeleteSentMessageModal
      v-model:open="deleting"
      :message="selected"
      @deleted="onMessageDeleted"
    />
  </section>
</template>

<script setup lang="ts">
import {
  EllipsisIcon,
  EyeIcon,
  ForwardIcon,
  MailIcon,
  SendIcon,
  Trash2Icon,
} from '@lucide/vue'
import { apiClient } from '@/repository/api'
import type { SentMessage } from '@/types/message'
import type {
  DropdownMenuAction,
  DropdownMenuItem,
} from '@/components/ui/UiDropdownMenu.vue'

const headings = [
  '',
  'Sender Name',
  'Recipients',
  'Message',
  'Volume',
  'Sent on',
  'Status',
  '',
]
const menuItems: DropdownMenuItem[] = [
  { id: 'view', label: 'View details', icon: EyeIcon },
  { id: 'resend', label: 'Edit & resend', icon: ForwardIcon },
  { type: 'divider' },
  { id: 'delete', label: 'Delete', icon: Trash2Icon, danger: true },
]

const messages = ref<SentMessage[] | null>(null)
const loading = ref(true)
const error = ref(false)
const currentPage = ref(1)
const perPage = ref(0)
const total = ref(0)

const selected = ref<SentMessage | null>(null)
const viewing = ref(false)
const deleting = ref(false)

const totalPages = computed(() =>
  perPage.value ? Math.ceil(total.value / perPage.value) : 1,
)

const sentOn = (value: string | null | undefined) =>
  !value || value.startsWith('0000')
    ? null
    : {
        date: useDateFormat(value, 'Do MMM YYYY').value,
        time: useDateFormat(value, 'h:mm a').value,
      }

const rows = computed(() =>
  (messages.value ?? []).map((message, index) => ({
    message,
    number: incrementPageNumber(index, perPage.value, currentPage.value),
    recipients: splitRecipients(message.recipient),
    sentOn: sentOn(message.disptachtime),
  })),
)

const fetchMessages = async (page = currentPage.value) => {
  try {
    loading.value = true
    error.value = false
    const response = await apiClient.message.fetchSentMessages(page)
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

const viewMessage = (message: SentMessage) => {
  selected.value = message
  viewing.value = true
}

const resendMessage = (message: SentMessage) =>
  navigateTo({ path: '/dashboard/compose-sms', query: { sentid: message.id } })

const onSelect = ({ id }: DropdownMenuAction, message: SentMessage) => {
  if (id === 'view') viewMessage(message)
  else if (id === 'resend') resendMessage(message)
  else if (id === 'delete') {
    selected.value = message
    deleting.value = true
  }
}

const onMessageDeleted = () => {
  const emptiedPage = messages.value?.length === 1 && currentPage.value > 1
  fetchMessages(emptiedPage ? currentPage.value - 1 : currentPage.value)
}

onMounted(fetchMessages)
</script>
