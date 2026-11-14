<template>
  <section>
    <div v-if="loading && !drafts" class="space-y-3">
      <UiSkeleton v-for="n in 5" :key="n" class="h-12 w-full rounded-lg" />
    </div>

    <UiErrorState v-else-if="error" @try-again="fetchDrafts()" />

    <EmptyState
      v-else-if="!rows.length"
      :icon="FileTextIcon"
      title="No drafts yet"
      description="When you're writing a message and choose Save as draft, it waits here until you're ready to send it."
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
        <h2 class="text-lg font-semibold">Saved drafts</h2>
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
              :key="row.draft.id"
              class="cursor-pointer"
              @click="viewDraft(row.draft)"
            >
              <TableCell class="text-muted-foreground w-12">
                {{ row.number }}.
              </TableCell>
              <TableCell class="font-medium">
                {{ row.draft.displayname || '—' }}
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
                  {{ row.draft.message || '—' }}
                </span>
              </TableCell>
              <TableCell>
                <template v-if="row.savedOn">
                  {{ row.savedOn.date }}
                  <span class="text-muted-foreground block text-xs">
                    {{ row.savedOn.time }}
                  </span>
                </template>
                <span v-else class="text-muted-foreground">—</span>
              </TableCell>
              <TableCell class="w-16" @click.stop>
                <UiDropdownMenu
                  :items="menuItems"
                  placement="end"
                  @select="onSelect($event, row.draft)"
                >
                  <button
                    type="button"
                    aria-label="Draft actions"
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
          @previous="fetchDrafts(currentPage - 1)"
          @next="fetchDrafts(currentPage + 1)"
          @goto="fetchDrafts"
        />
      </div>
    </template>

    <DraftDetailModal
      v-model:open="viewing"
      :draft="selected"
      @edit="editDraft(selected!)"
    />
    <DeleteDraftModal
      v-model:open="deleting"
      :draft="selected"
      @deleted="onDraftDeleted"
    />
  </section>
</template>

<script setup lang="ts">
import {
  EllipsisIcon,
  EyeIcon,
  FileTextIcon,
  PencilIcon,
  SendIcon,
  Trash2Icon,
} from '@lucide/vue'
import { apiClient } from '@/repository/api'
import type { DraftMessage } from '@/types/message'
import type {
  DropdownMenuAction,
  DropdownMenuItem,
} from '@/components/ui/UiDropdownMenu.vue'

const headings = ['', 'Sender Name', 'Recipients', 'Message', 'Saved on', '']
const menuItems: DropdownMenuItem[] = [
  { id: 'view', label: 'View details', icon: EyeIcon },
  { id: 'edit', label: 'Edit & send', icon: PencilIcon },
  { type: 'divider' },
  { id: 'delete', label: 'Delete', icon: Trash2Icon, danger: true },
]

const drafts = ref<DraftMessage[] | null>(null)
const loading = ref(true)
const error = ref(false)
const currentPage = ref(1)
const perPage = ref(0)
const total = ref(0)

const selected = ref<DraftMessage | null>(null)
const viewing = ref(false)
const deleting = ref(false)

const totalPages = computed(() =>
  perPage.value ? Math.ceil(total.value / perPage.value) : 1,
)

const savedOn = (value: string | null | undefined) =>
  !value || value.startsWith('0000')
    ? null
    : {
        date: useDateFormat(value, 'Do MMM YYYY').value,
        time: useDateFormat(value, 'h:mm a').value,
      }

const rows = computed(() =>
  [...(drafts.value ?? [])]
    .sort((a, b) => (b.created ?? '').localeCompare(a.created ?? ''))
    .map((draft, index) => ({
      draft,
      number: incrementPageNumber(index, perPage.value, currentPage.value),
      recipients: splitRecipients(draft.recipient),
      savedOn: savedOn(draft.created),
    })),
)

const fetchDrafts = async (page = currentPage.value) => {
  try {
    loading.value = true
    error.value = false
    const response = await apiClient.message.fetchDrafts(page)
    if (response.status === 1) {
      drafts.value = response.data ?? []
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

const viewDraft = (draft: DraftMessage) => {
  selected.value = draft
  viewing.value = true
}

const editDraft = (draft: DraftMessage) =>
  navigateTo({ path: '/dashboard/compose-sms', query: { draft: draft.id } })

const onSelect = ({ id }: DropdownMenuAction, draft: DraftMessage) => {
  if (id === 'view') viewDraft(draft)
  else if (id === 'edit') editDraft(draft)
  else if (id === 'delete') {
    selected.value = draft
    deleting.value = true
  }
}

const onDraftDeleted = () => {
  const emptiedPage = drafts.value?.length === 1 && currentPage.value > 1
  fetchDrafts(emptiedPage ? currentPage.value - 1 : currentPage.value)
}

onMounted(fetchDrafts)
</script>
