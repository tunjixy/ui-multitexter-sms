<template>
  <section>
    <div v-if="loading && !messages" class="space-y-3">
      <UiSkeleton v-for="n in 5" :key="n" class="h-12 w-full rounded-lg" />
    </div>

    <UiErrorState v-else-if="error" @try-again="fetchMessages()" />

    <EmptyState
      v-else-if="!rows.length"
      :icon="CalendarClockIcon"
      title="No scheduled messages yet"
      description="Pick a date and time when you compose a message, and it will wait here until it goes out. You can pause, edit or delete it before then."
    >
      <template #actions>
        <UiButton radius="lg" @click="scheduleMessage">
          <template #leading>
            <CalendarPlusIcon class="size-4" />
          </template>
          Schedule SMS
        </UiButton>
      </template>
    </EmptyState>

    <template v-else>
      <div class="flex items-center gap-2">
        <h2 class="text-lg font-semibold">Scheduled messages</h2>
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
              <TableCell>
                <ScheduledStatusBadge :active="row.active" />
              </TableCell>
              <TableCell class="font-medium">
                {{ row.message.displayname || '—' }}
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
                <template v-else-if="row.lists">
                  {{ row.lists }} contact
                  {{ row.lists === 1 ? 'list' : 'lists' }}
                </template>
                <span v-else class="text-muted-foreground">—</span>
              </TableCell>
              <TableCell>
                <span class="block max-w-64 truncate">
                  {{ row.message.message || '—' }}
                </span>
              </TableCell>
              <TableCell>
                <template v-if="row.deliversOn">
                  {{ row.deliversOn.date }}
                  <span class="text-muted-foreground block text-xs">
                    {{ row.deliversOn.time }}
                  </span>
                </template>
                <span v-else class="text-muted-foreground">—</span>
              </TableCell>
              <TableCell class="tabular-nums">
                {{ formatNumberWithComma(row.message.tag) }}
              </TableCell>
              <TableCell class="w-16" @click.stop>
                <UiDropdownMenu
                  :items="menuItems(row.active)"
                  placement="end"
                  @select="onSelect($event, row.message)"
                >
                  <button
                    type="button"
                    aria-label="Message actions"
                    :disabled="pendingId === row.message.id"
                    class="border-border text-muted-foreground hover:bg-foreground/5 hover:text-foreground focus-visible:ring-primary/35 inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border transition-colors outline-none focus-visible:ring-3 disabled:cursor-progress disabled:opacity-60"
                  >
                    <span
                      v-if="pendingId === row.message.id"
                      class="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
                      aria-hidden="true"
                    />
                    <EllipsisIcon v-else class="size-4" />
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

    <ScheduledMessageDetailModal
      v-model:open="viewing"
      :message="selected"
      @edit="editMessage(selected!)"
    />
    <DeleteScheduledMessageModal
      v-model:open="deleting"
      :message="selected"
      @deleted="onMessageDeleted"
    />
  </section>
</template>

<script setup lang="ts">
import {
  CalendarClockIcon,
  CalendarPlusIcon,
  EllipsisIcon,
  EyeIcon,
  PauseIcon,
  PencilIcon,
  PlayIcon,
  Trash2Icon,
} from '@lucide/vue'
import { apiClient } from '@/repository/api'
import type { ScheduledMessage } from '@/types/message'
import type {
  DropdownMenuAction,
  DropdownMenuItem,
} from '@/components/ui/UiDropdownMenu.vue'

const { $toast } = useNuxtApp()

const headings = [
  '',
  'Status',
  'Sender Name',
  'Recipients',
  'Message',
  'Delivery date',
  'Volume',
  '',
]

const messages = ref<ScheduledMessage[] | null>(null)
const loading = ref(true)
const error = ref(false)
const currentPage = ref(1)
const perPage = ref(0)
const total = ref(0)

const selected = ref<ScheduledMessage | null>(null)
const viewing = ref(false)
const deleting = ref(false)
const pendingId = ref<number | null>(null)

const totalPages = computed(() =>
  perPage.value ? Math.ceil(total.value / perPage.value) : 1,
)

const deliversOn = (value: string | null | undefined) =>
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
    active: message.iscancel === 0,
    recipients: splitRecipients(message.recipient),
    lists: splitContactListIds(message.listids).length,
    deliversOn: deliversOn(message.dispatchtime),
  })),
)

const menuItems = (active: boolean): DropdownMenuItem[] => [
  { id: 'view', label: 'View details', icon: EyeIcon },
  { id: 'edit', label: 'Edit', icon: PencilIcon },
  {
    id: 'toggle',
    label: active ? 'Pause' : 'Resume',
    icon: active ? PauseIcon : PlayIcon,
  },
  { type: 'divider' },
  { id: 'delete', label: 'Delete', icon: Trash2Icon, danger: true },
]

const fetchMessages = async (page = currentPage.value) => {
  try {
    loading.value = true
    error.value = false
    const response = await apiClient.message.fetchScheduledMessages(page)
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

const scheduleMessage = () =>
  navigateTo({ path: '/dashboard/compose-sms', query: { new: 'true' } })

const viewMessage = (message: ScheduledMessage) => {
  selected.value = message
  viewing.value = true
}

const editMessage = (message: ScheduledMessage) =>
  navigateTo({
    path: '/dashboard/compose-sms',
    query: { schedule: message.id },
  })

const toggleMessageStatus = async (message: ScheduledMessage) => {
  const active = message.iscancel === 0
  try {
    pendingId.value = message.id
    const response = active
      ? await apiClient.message.pauseScheduledMessage(message.id)
      : await apiClient.message.resumeScheduledMessage(message.id)
    if (response.status === 1) {
      $toast.success(
        response.msg || (active ? 'Message paused.' : 'Message resumed.'),
      )
      await fetchMessages()
    } else {
      $toast.error(
        response.msg ||
          `We couldn't ${active ? 'pause' : 'resume'} this message. Please try again.`,
      )
    }
  } catch (err) {
    $toast.error(formatErrorResponse(err))
  } finally {
    pendingId.value = null
  }
}

const onSelect = ({ id }: DropdownMenuAction, message: ScheduledMessage) => {
  if (id === 'view') viewMessage(message)
  else if (id === 'edit') editMessage(message)
  else if (id === 'toggle') toggleMessageStatus(message)
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
