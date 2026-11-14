<template>
  <section>
    <div v-if="loading && !lists" class="space-y-3">
      <UiSkeleton v-for="n in 5" :key="n" class="h-12 w-full rounded-lg" />
    </div>

    <UiErrorState v-else-if="error" @try-again="fetchLists()" />

    <EmptyState
      v-else-if="!rows.length"
      :icon="BookUserIcon"
      title="No contact lists yet"
      description="Create a list for each group you text, like customers or staff, then add their numbers."
    >
      <template #actions>
        <UiButton radius="lg" @click="createList">
          <template #leading>
            <PlusIcon class="size-4" />
          </template>
          Create a list
        </UiButton>
      </template>
    </EmptyState>

    <template v-else>
      <div class="flex items-center gap-2">
        <h2 class="text-lg font-semibold">Your lists</h2>
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
              <TableHead v-for="heading in headings" :key="heading">
                {{ heading }}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="row in rows"
              :key="row.list.contactlistid"
              class="cursor-pointer"
              @click="openList(row.list)"
            >
              <TableCell class="text-muted-foreground w-12">
                {{ row.number }}.
              </TableCell>
              <TableCell>
                <span class="font-medium">
                  {{ row.list.contactist_name }}
                </span>
                <span
                  v-if="row.list.description"
                  class="text-muted-foreground block max-w-xs truncate text-xs"
                >
                  {{ row.list.description }}
                </span>
              </TableCell>
              <TableCell>
                <span
                  class="bg-primary/10 text-primary inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold"
                >
                  {{ formatNumberWithComma(row.list.contactCount) }}
                </span>
              </TableCell>
              <TableCell>
                <template v-if="row.created">
                  {{ row.created.date }}
                  <span class="text-muted-foreground block text-xs">
                    {{ row.created.time }}
                  </span>
                </template>
                <span v-else class="text-muted-foreground">—</span>
              </TableCell>
              <TableCell class="w-16" @click.stop>
                <UiDropdownMenu
                  :items="menuItems"
                  placement="end"
                  @select="onSelect($event, row.list)"
                >
                  <button
                    type="button"
                    :aria-label="`Actions for ${row.list.contactist_name}`"
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
          @previous="fetchLists(currentPage - 1)"
          @next="fetchLists(currentPage + 1)"
          @goto="fetchLists"
        />
      </div>
    </template>

    <ModifyListModal
      v-model:open="modifying"
      :list="selected"
      @saved="onListSaved"
    />
    <DeleteListModal
      v-model:open="deleting"
      :list="selected"
      @deleted="onListDeleted"
    />
  </section>
</template>

<script setup lang="ts">
import {
  BookUserIcon,
  EllipsisIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from '@lucide/vue'
import { apiClient } from '@/repository/api'
import type { ContactList } from '@/types/phonebook'
import type {
  DropdownMenuAction,
  DropdownMenuItem,
} from '@/components/ui/UiDropdownMenu.vue'

const headings = ['', 'Name', 'Contacts', 'Created', 'Action']
const menuItems: DropdownMenuItem[] = [
  { id: 'open', label: 'View contacts', icon: EyeIcon },
  { id: 'edit', label: 'Edit', icon: PencilIcon },
  { type: 'divider' },
  { id: 'delete', label: 'Delete', icon: Trash2Icon, danger: true },
]

const lists = ref<ContactList[] | null>(null)
const loading = ref(true)
const error = ref(false)
const currentPage = ref(1)
const perPage = ref(0)
const total = ref(0)

const selected = ref<ContactList | null>(null)
const modifying = ref(false)
const deleting = ref(false)

const totalPages = computed(() =>
  perPage.value ? Math.ceil(total.value / perPage.value) : 1,
)

const rows = computed(() =>
  (lists.value ?? []).map((list, index) => ({
    list,
    number: incrementPageNumber(index, perPage.value, currentPage.value),
    created: list.created
      ? {
          date: useDateFormat(list.created, 'Do MMM YYYY').value,
          time: useDateFormat(list.created, 'h:mm a').value,
        }
      : null,
  })),
)

const fetchLists = async (page = currentPage.value) => {
  try {
    loading.value = true
    error.value = false
    const response = await apiClient.phonebook.fetchContactLists(page)
    if (response.status === 1) {
      lists.value = response.data
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

const openList = (list: ContactList) =>
  navigateTo(`/dashboard/phonebook/contacts/${list.contactlistid}`)

const createList = () => {
  selected.value = null
  modifying.value = true
}

const onSelect = ({ id }: DropdownMenuAction, list: ContactList) => {
  if (id === 'open') return openList(list)
  selected.value = list
  if (id === 'edit') modifying.value = true
  else if (id === 'delete') deleting.value = true
}

const onListSaved = () => fetchLists(selected.value ? currentPage.value : 1)

const onListDeleted = () => {
  const emptiedPage = lists.value?.length === 1 && currentPage.value > 1
  fetchLists(emptiedPage ? currentPage.value - 1 : currentPage.value)
}

onMounted(fetchLists)

defineExpose({ createList })
</script>
