<template>
  <section>
    <UiErrorState v-if="error" @try-again="fetchSenderIds" />

    <div v-else-if="!senderIds" class="space-y-3">
      <UiSkeleton v-for="n in 4" :key="n" class="h-12 w-full rounded-lg" />
    </div>

    <EmptyState
      v-else-if="!rows.length"
      :icon="IdCardIcon"
      title="No sender IDs yet"
      description="Request one for your brand. Once it's approved, your messages can come from that name."
    >
      <template #actions>
        <UiButton radius="lg" @click="createSenderId">
          <template #leading>
            <PlusIcon class="size-4" />
          </template>
          Request a sender ID
        </UiButton>
      </template>
    </EmptyState>

    <template v-else>
      <div class="flex items-center gap-2">
        <h2 class="text-lg font-semibold">Your sender IDs</h2>
        <span
          class="bg-primary/10 text-primary inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold"
        >
          {{ formatNumberWithComma(rows.length) }}
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
              <TableHead v-for="heading in headings" :key="heading">
                {{ heading }}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(row, index) in rows" :key="row.senderId.id">
              <TableCell class="text-muted-foreground w-12">
                {{ index + 1 }}.
              </TableCell>
              <TableCell class="font-medium">
                {{ row.senderId.sender }}
              </TableCell>
              <TableCell>
                {{ row.senderId.company_name || '—' }}
                <span
                  v-if="row.senderId.business_nature"
                  class="text-muted-foreground block max-w-xs truncate text-xs"
                >
                  {{ row.senderId.business_nature }}
                </span>
              </TableCell>
              <TableCell>
                <SenderIdStatusBadge
                  :status="row.senderId.status"
                  :label="row.senderId.status_name"
                />
              </TableCell>
              <TableCell>
                <template v-if="row.registered">
                  {{ row.registered.date }}
                  <span class="text-muted-foreground block text-xs">
                    {{ row.registered.time }}
                  </span>
                </template>
                <span v-else class="text-muted-foreground">—</span>
              </TableCell>
              <TableCell class="w-16">
                <UiDropdownMenu
                  :items="menuItems"
                  placement="end"
                  @select="onSelect($event, row.senderId)"
                >
                  <button
                    type="button"
                    :aria-label="`Actions for ${row.senderId.sender}`"
                    class="border-border text-muted-foreground hover:bg-foreground/5 hover:text-foreground focus-visible:ring-primary/35 inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border transition-colors outline-none focus-visible:ring-3"
                  >
                    <EllipsisIcon class="size-4" />
                  </button>
                </UiDropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </UiTable>
      </div>
    </template>

    <SenderIdFormModal
      v-model:open="modifying"
      :sender-id="selected"
      @saved="onChanged"
    />
    <DeleteSenderIdModal
      v-model:open="deleting"
      :sender-id="selected"
      @deleted="onChanged"
    />
  </section>
</template>

<script setup lang="ts">
import {
  EllipsisIcon,
  IdCardIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from '@lucide/vue'
import { apiClient } from '@/repository/api'
import type { SenderId } from '@/types/sender-id'
import type {
  DropdownMenuAction,
  DropdownMenuItem,
} from '@/components/ui/UiDropdownMenu.vue'

const headings = ['', 'Sender ID', 'Company', 'Status', 'Registered', 'Action']
const menuItems: DropdownMenuItem[] = [
  { id: 'edit', label: 'Edit', icon: PencilIcon },
  { type: 'divider' },
  { id: 'delete', label: 'Delete', icon: Trash2Icon, danger: true },
]

const { senderIds: approvedSenderIds } = useSenderIds()

const senderIds = ref<SenderId[] | null>(null)
const loading = ref(false)
const error = ref(false)

const selected = ref<SenderId | null>(null)
const modifying = ref(false)
const deleting = ref(false)

const timeOf = (date: string) => new Date(date).getTime() || 0

const rows = computed(() =>
  [...(senderIds.value ?? [])]
    .sort((a, b) => timeOf(b.date_registered) - timeOf(a.date_registered))
    .map((senderId) => ({
      senderId,
      registered: senderId.date_registered
        ? {
            date: useDateFormat(senderId.date_registered, 'Do MMM YYYY').value,
            time: useDateFormat(senderId.date_registered, 'h:mm a').value,
          }
        : null,
    })),
)

const fetchSenderIds = async () => {
  try {
    loading.value = true
    error.value = false
    const response = await apiClient.senderId.fetchSenderIds()
    senderIds.value = response.status === 1 ? (response.data ?? []) : []
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

const createSenderId = () => {
  selected.value = null
  modifying.value = true
}

const onSelect = ({ id }: DropdownMenuAction, senderId: SenderId) => {
  selected.value = senderId
  if (id === 'edit') modifying.value = true
  else if (id === 'delete') deleting.value = true
}

const onChanged = () => {
  approvedSenderIds.value = null
  fetchSenderIds()
}

onMounted(fetchSenderIds)

defineExpose({ createSenderId })
</script>
