<template>
  <div>
    <p class="text-sm font-semibold">Save to</p>

    <div class="mt-3 grid gap-3 sm:grid-cols-2">
      <label
        v-for="option in options"
        :key="option.value"
        :class="[
          'border-border has-checked:border-primary has-checked:ring-primary/20 has-focus-visible:ring-primary/35 rounded-xl border p-3 transition-[border-color,box-shadow,opacity] has-checked:ring-3 has-focus-visible:ring-3',
          option.disabled
            ? 'cursor-not-allowed opacity-60'
            : 'hover:not-has-checked:border-muted-foreground cursor-pointer',
        ]"
      >
        <input
          v-model="mode"
          type="radio"
          :name="groupName"
          :value="option.value"
          :disabled="option.disabled"
          class="sr-only"
        />
        <span class="flex items-start gap-3">
          <span
            class="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg"
          >
            <component :is="option.icon" class="size-4" />
          </span>
          <span class="min-w-0 flex-1">
            <span class="block text-sm font-medium">{{ option.label }}</span>
            <span class="text-muted-foreground mt-0.5 block text-xs">
              {{ option.description }}
            </span>
          </span>
          <CircleCheckIcon
            v-if="mode === option.value"
            class="text-primary size-4 shrink-0"
          />
        </span>
      </label>
    </div>

    <UiInput
      v-if="mode === 'create'"
      v-model="name"
      name="listName"
      label="List name"
      placeholder="e.g. Customers"
      autocomplete="off"
      :error="nameError"
      class="mt-4"
    />

    <div v-else class="mt-4">
      <UiSelect
        v-model="listId"
        name="listId"
        label="Contact list"
        :options="listOptions"
        :placeholder="lists ? 'Choose a list' : 'Loading lists…'"
        :searchable="listOptions.length > 7"
        search-placeholder="Search lists…"
        :disabled="!lists"
        :error="
          listError || (error ? `We couldn't load your lists.` : undefined)
        "
      />
      <button
        v-if="error"
        type="button"
        class="text-primary hover:text-primary/80 focus-visible:ring-primary/35 mt-1 cursor-pointer rounded-sm text-sm font-medium transition-colors outline-none focus-visible:ring-2"
        @click="fetchContactLists"
      >
        Try again
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CircleCheckIcon, ListIcon, ListPlusIcon } from '@lucide/vue'
import type { SelectOption } from '@/components/ui/UiSelect.vue'

defineProps<{
  nameError?: string
  listError?: string
}>()

const mode = defineModel<ContactListMode>('mode', { required: true })
const name = defineModel<string>('name', { default: '' })
const listId = defineModel<number | null>('listId', { default: null })

const groupName = useId()
const { lists, loading, error, fetchContactLists } = useContactLists()

const hasNoLists = computed(() => lists.value?.length === 0)

const options = computed(() => [
  {
    value: 'create',
    label: 'A new list',
    description: 'Name a list and save the numbers in it.',
    icon: ListPlusIcon,
    disabled: false,
  },
  {
    value: 'add',
    label: 'An existing list',
    description: hasNoLists.value
      ? "You don't have any lists yet."
      : 'Add the numbers to a list you already have.',
    icon: ListIcon,
    disabled: hasNoLists.value,
  },
])

const listOptions = computed<SelectOption[]>(() =>
  (lists.value ?? []).map((list) => ({
    value: list.contactlistid,
    label: list.contactist_name,
    description:
      Number(list.contactCount) === 1
        ? '1 contact'
        : `${formatNumberWithComma(list.contactCount)} contacts`,
  })),
)

onMounted(() => {
  if (!loading.value) fetchContactLists()
})
</script>
