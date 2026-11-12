<template>
  <div class="py-6">
    <div class="dashboard-wrapper">
      <NuxtLink
        to="/dashboard/birthdays"
        class="text-muted-foreground hover:text-foreground focus-visible:ring-primary/35 inline-flex items-center gap-1.5 rounded-sm text-sm font-medium transition-colors outline-none focus-visible:ring-2"
      >
        <ArrowLeftIcon class="size-4" />
        Birthdays
      </NuxtLink>

      <div class="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Add birthdays</h1>
          <p class="text-muted-foreground mt-1 max-w-xl text-sm">
            Add everyone you want to celebrate, check the list, then save them
            all at once.
          </p>
        </div>
        <div v-if="entries.length" class="flex flex-wrap gap-3">
          <UiButton
            variant="outline"
            radius="lg"
            :disabled="saving"
            @click="addEntry"
          >
            <template #leading>
              <PlusIcon class="size-4" />
            </template>
            Add another
          </UiButton>
          <UiButton radius="lg" :loading="saving" @click="save">
            {{ saving ? '' : saveLabel }}
          </UiButton>
        </div>
      </div>

      <EmptyState
        v-if="!entries.length"
        class="mt-6"
        :icon="CakeIcon"
        title="No entries yet"
        description="Add the people you want to celebrate. Nothing is saved until you're ready."
      >
        <template #actions>
          <UiButton radius="lg" @click="addEntry">
            <template #leading>
              <PlusIcon class="size-4" />
            </template>
            Add entry
          </UiButton>
        </template>
      </EmptyState>

      <ul v-else class="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <li
          v-for="entry in entries"
          :key="entry.id"
          class="border-border bg-surface flex flex-col rounded-2xl border p-5"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="truncate font-semibold">{{ entry.contact_name }}</p>
              <p class="text-muted-foreground text-sm">
                {{ entry.mobile_number }}
              </p>
            </div>
            <div class="-mt-1 -mr-1 flex shrink-0">
              <button
                type="button"
                :aria-label="`Edit ${entry.contact_name}`"
                :disabled="saving"
                :class="iconButton"
                class="hover:bg-foreground/5 hover:text-foreground"
                @click="editEntry(entry)"
              >
                <PencilIcon class="size-4" />
              </button>
              <button
                type="button"
                :aria-label="`Remove ${entry.contact_name}`"
                :disabled="saving"
                :class="iconButton"
                class="hover:bg-red-600/10 hover:text-red-600 dark:hover:text-red-400"
                @click="removeEntry(entry.id)"
              >
                <Trash2Icon class="size-4" />
              </button>
            </div>
          </div>

          <ul
            class="text-muted-foreground mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs"
          >
            <li class="inline-flex items-center gap-1.5">
              <CakeIcon class="size-3.5" />
              {{ useDateFormat(entry.birthday, 'D MMM YYYY').value }}
            </li>
            <li class="inline-flex items-center gap-1.5">
              <ClockIcon class="size-3.5" />
              {{
                useDateFormat(`2000-01-01 ${entry.send_time}`, 'h:mm A').value
              }}
            </li>
            <li class="inline-flex items-center gap-1.5">
              <SendIcon class="size-3.5" />
              {{ entry.displayname }}
            </li>
          </ul>

          <p
            class="border-border mt-4 line-clamp-3 border-t pt-4 text-sm leading-relaxed"
          >
            {{ entry.message }}
          </p>
        </li>
      </ul>

      <BirthdayEntryModal
        v-model:open="entryOpen"
        :entry="editingEntry"
        @submit="onEntrySubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLeftIcon,
  CakeIcon,
  ClockIcon,
  PencilIcon,
  PlusIcon,
  SendIcon,
  Trash2Icon,
} from '@lucide/vue'
import { apiClient } from '@/repository/api'
import type { BirthdayCreateReq } from '@/types/birthday'

type Entry = BirthdayCreateReq & { id: number }

useAppStore().setPageTitle('Add Birthday Entry')

const { $toast } = useNuxtApp()

const entries = ref<Entry[]>([])
const editingEntry = ref<Entry | null>(null)
const entryOpen = ref(false)
const saving = ref(false)
let nextId = 0

const iconButton =
  'text-muted-foreground focus-visible:ring-primary/35 inline-flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50'

const saveLabel = computed(() => {
  const count = entries.value.length
  return `Save ${count} ${count === 1 ? 'birthday' : 'birthdays'}`
})

const addEntry = () => {
  editingEntry.value = null
  entryOpen.value = true
}

const editEntry = (entry: Entry) => {
  editingEntry.value = entry
  entryOpen.value = true
}

const removeEntry = (id: number) => {
  entries.value = entries.value.filter((entry) => entry.id !== id)
}

const onEntrySubmit = (body: BirthdayCreateReq) => {
  const editingId = editingEntry.value?.id
  if (editingId === undefined) {
    entries.value.unshift({ ...body, id: ++nextId })
    return
  }
  entries.value = entries.value.map((entry) =>
    entry.id === editingId ? { ...body, id: editingId } : entry,
  )
}

const save = async () => {
  try {
    saving.value = true
    const response = await apiClient.birthday.createBirthday(
      entries.value.map(({ id: _id, ...entry }) => entry),
    )
    if (response.status === 1) {
      $toast.success(response.msg || 'Your birthdays have been saved.')
      await navigateTo('/dashboard/birthdays')
    } else {
      $toast.error(
        response.msg || "We couldn't save these birthdays. Please try again.",
      )
    }
  } catch (err) {
    $toast.error(formatErrorResponse(err))
  } finally {
    saving.value = false
  }
}

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useHead({
  title: 'Add Birthday Entry',
})
</script>
