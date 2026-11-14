<template>
  <section>
    <template v-if="loading && !birthdays">
      <div class="grid gap-5 sm:grid-cols-2">
        <UiSkeleton v-for="n in 2" :key="n" class="h-41 w-full rounded-2xl" />
      </div>
      <div class="mt-6 space-y-3">
        <UiSkeleton v-for="n in 5" :key="n" class="h-12 w-full rounded-lg" />
      </div>
    </template>

    <UiErrorState v-else-if="error" @try-again="fetchBirthdays()" />

    <EmptyState
      v-else-if="!rows.length"
      :icon="CakeIcon"
      title="No birthdays yet"
      description="Add birthdays one at a time or upload a CSV, and we'll send your message on the day, every year."
    />

    <template v-else>
      <ul class="grid gap-5 sm:grid-cols-2">
        <li
          v-for="stat in stats"
          :key="stat.title"
          class="border-border bg-surface flex flex-col rounded-2xl border p-6"
        >
          <div class="flex items-center gap-3">
            <span
              class="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl"
            >
              <component :is="stat.icon" class="size-5" />
            </span>
            <h2 class="font-semibold">{{ stat.title }}</h2>
          </div>
          <p class="mt-5 text-2xl font-bold tracking-tight">{{ stat.value }}</p>
          <p class="text-muted-foreground mt-1 text-sm">{{ stat.caption }}</p>
        </li>
      </ul>

      <div
        :class="[
          'border-border mt-6 overflow-hidden rounded-lg border transition-opacity',
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
              :key="row.birthday.id"
              class="cursor-pointer"
              @click="viewBirthday(row.birthday)"
            >
              <TableCell class="text-muted-foreground w-12">
                {{ row.number }}.
              </TableCell>
              <TableCell>
                <BirthdayStatusBadge :status="row.birthday.status" />
              </TableCell>
              <TableCell>{{ row.birthday.sender }}</TableCell>
              <TableCell>
                <span class="font-medium">{{ row.birthday.username }}</span>
                <span class="text-muted-foreground block text-xs">
                  {{ row.birthday.destination }}
                </span>
              </TableCell>
              <TableCell>
                <template v-if="row.lastSent">
                  {{ row.lastSent.date }}
                  <span class="text-muted-foreground block text-xs">
                    {{ row.lastSent.time }}
                  </span>
                </template>
                <span v-else class="text-muted-foreground">Not sent yet</span>
              </TableCell>
              <TableCell>
                <template v-if="row.nextSent">
                  {{ row.nextSent.date }}
                  <span class="text-muted-foreground block text-xs">
                    {{ row.nextSent.time }}
                  </span>
                </template>
                <span v-else class="text-muted-foreground">—</span>
              </TableCell>
              <TableCell class="w-16" @click.stop>
                <UiDropdownMenu
                  :items="menuItems(row.birthday)"
                  placement="end"
                  @select="onSelect($event, row.birthday)"
                >
                  <button
                    type="button"
                    :disabled="pendingId === row.birthday.id"
                    class="border-border text-muted-foreground hover:bg-foreground/5 hover:text-foreground focus-visible:ring-primary/35 inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border transition-colors outline-none focus-visible:ring-3 disabled:cursor-progress disabled:opacity-60"
                  >
                    <span
                      v-if="pendingId === row.birthday.id"
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
          @previous="fetchBirthdays(currentPage - 1)"
          @next="fetchBirthdays(currentPage + 1)"
          @goto="fetchBirthdays"
        />
      </div>
    </template>

    <BirthdayDetailModal
      v-model:open="viewing"
      :birthday="selected"
      @edit="editBirthday(selected!)"
    />
    <BirthdayEntryModal
      v-model:open="editing"
      :birthday="selected"
      @saved="fetchBirthdays()"
    />
    <DeleteBirthdayModal
      v-model:open="deleting"
      :birthday="selected"
      @deleted="onBirthdayDeleted"
    />
  </section>
</template>

<script setup lang="ts">
import {
  CakeIcon,
  EllipsisIcon,
  EyeIcon,
  ListIcon,
  PauseIcon,
  PencilIcon,
  PlayIcon,
  Trash2Icon,
} from '@lucide/vue'
import { apiClient } from '@/repository/api'
import type { Birthday } from '@/types/birthday'
import type {
  DropdownMenuAction,
  DropdownMenuItem,
} from '@/components/ui/UiDropdownMenu.vue'

const { $toast } = useNuxtApp()

const headings = [
  '',
  'Status',
  'Sender Name',
  'Recipient',
  'Last Sent',
  'Next Sent',
  'Action',
]
const birthdays = ref<Birthday[] | null>(null)
const loading = ref(true)
const error = ref(false)
const currentPage = ref(1)
const perPage = ref(0)
const total = ref(0)

const selected = ref<Birthday | null>(null)
const viewing = ref(false)
const editing = ref(false)
const deleting = ref(false)
const pendingId = ref<number | null>(null)

const totalPages = computed(() =>
  perPage.value ? Math.ceil(total.value / perPage.value) : 1,
)

const isActive = (birthday: Birthday) =>
  birthday.status?.toLowerCase() === 'active'

const when = (value: string | null | undefined) =>
  !value || value.startsWith('0000')
    ? null
    : {
        date: useDateFormat(value, 'Do MMM YYYY').value,
        time: useDateFormat(value, 'h:mm a').value,
      }

const rows = computed(() =>
  (birthdays.value ?? []).map((birthday, index) => ({
    birthday,
    number: incrementPageNumber(index, perPage.value, currentPage.value),
    lastSent: when(birthday.last_sent),
    nextSent: when(birthday.next_sent),
  })),
)

const stats = computed(() => {
  const shown = rows.value.length
  const first = rows.value[0]?.number ?? 0
  const last = rows.value.at(-1)?.number ?? 0

  return [
    {
      icon: CakeIcon,
      title: 'Total birthdays',
      value: formatNumberWithComma(total.value),
      caption: "People we'll text on their birthday, every year.",
    },
    {
      icon: ListIcon,
      title: 'On this page',
      value: formatNumberWithComma(shown),
      caption:
        totalPages.value > 1
          ? `Birthdays ${formatNumberWithComma(first)}–${formatNumberWithComma(last)}, page ${currentPage.value} of ${totalPages.value}`
          : 'Every birthday fits on this page.',
    },
  ]
})

const menuItems = (birthday: Birthday): DropdownMenuItem[] => {
  const active = isActive(birthday)
  return [
    { id: 'view', label: 'View details', icon: EyeIcon },
    { id: 'edit', label: 'Edit', icon: PencilIcon },
    {
      id: 'toggle',
      label: active ? 'Stop' : 'Resume',
      icon: active ? PauseIcon : PlayIcon,
    },
    { type: 'divider' },
    { id: 'delete', label: 'Delete', icon: Trash2Icon, danger: true },
  ]
}

const fetchBirthdays = async (page = currentPage.value) => {
  try {
    loading.value = true
    error.value = false
    const response = await apiClient.birthday.fetchBirthdays(page)
    if (response.status === 1) {
      birthdays.value = response.data
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

const viewBirthday = (birthday: Birthday) => {
  selected.value = birthday
  viewing.value = true
}

const editBirthday = (birthday: Birthday) => {
  selected.value = birthday
  viewing.value = false
  editing.value = true
}

const toggleBirthdayStatus = async (birthday: Birthday) => {
  const active = isActive(birthday)
  try {
    pendingId.value = birthday.id
    const response = active
      ? await apiClient.birthday.stopBirthday(birthday.id)
      : await apiClient.birthday.startBirthday(birthday.id)
    if (response.status === 1) {
      $toast.success(
        response.msg || (active ? 'Birthday stopped.' : 'Birthday resumed.'),
      )
      await fetchBirthdays()
    } else {
      $toast.error(
        response.msg ||
          `We couldn't ${active ? 'stop' : 'resume'} this birthday. Please try again.`,
      )
    }
  } catch (err) {
    $toast.error(formatErrorResponse(err))
  } finally {
    pendingId.value = null
  }
}

const onSelect = ({ id }: DropdownMenuAction, birthday: Birthday) => {
  if (id === 'view') viewBirthday(birthday)
  else if (id === 'edit') editBirthday(birthday)
  else if (id === 'toggle') toggleBirthdayStatus(birthday)
  else if (id === 'delete') {
    selected.value = birthday
    deleting.value = true
  }
}

const onBirthdayDeleted = () => {
  const emptiedPage = birthdays.value?.length === 1 && currentPage.value > 1
  fetchBirthdays(emptiedPage ? currentPage.value - 1 : currentPage.value)
}

onMounted(fetchBirthdays)
</script>
