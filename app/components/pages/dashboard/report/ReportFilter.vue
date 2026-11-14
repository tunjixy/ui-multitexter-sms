<template>
  <form
    v-if="!hidden"
    novalidate
    class="border-border bg-surface rounded-2xl border p-6"
    @submit.prevent="apply"
  >
    <h2 class="font-semibold">Filter reports</h2>
    <p class="text-muted-foreground mt-1 text-sm">
      Narrow the list by sender, recipient, delivery status or date.
    </p>

    <div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <UiInput
        v-model="form.sender"
        name="sender"
        label="Sender name"
        placeholder="e.g. MyBrand"
        spellcheck="false"
      />
      <UiInput
        v-model="form.recipient"
        type="tel"
        name="recipient"
        label="Recipient"
        inputmode="tel"
        placeholder="e.g. 08012345678"
      />
      <UiSelect
        v-model="form.status"
        name="status"
        label="Status"
        :options="statusOptions"
      />
      <UiDatePicker
        v-model="form.startDate"
        name="startDate"
        label="From"
        type="date"
        format="D MMM YYYY"
        value-type="YYYY-MM-DD"
        placeholder="Start date"
        :disabled-date="isUnavailableStart"
      />
      <UiDatePicker
        v-model="form.endDate"
        name="endDate"
        label="To"
        type="date"
        format="D MMM YYYY"
        value-type="YYYY-MM-DD"
        placeholder="End date"
        :disabled-date="isUnavailableEnd"
      />
      <div class="flex items-end justify-end gap-3">
        <UiButton
          v-if="hasFilters"
          variant="outline"
          radius="lg"
          :disabled="loading"
          @click="clear"
        >
          Clear
        </UiButton>
        <UiButton
          type="submit"
          radius="lg"
          :loading="applying"
          :disabled="!hasFilters || loading"
        >
          Apply filters
        </UiButton>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { SelectOption } from '@/components/ui/UiSelect.vue'
import type { DeliveryReportFilters } from '@/composables/useDeliveryReports'

const { reports, filters, loading, applyFilters } = useDeliveryReports()

const statusOptions: SelectOption[] = [
  { value: 0, label: 'Any status' },
  { value: 1, label: 'Delivered' },
  { value: 2, label: 'Sent' },
  { value: 18, label: 'DeliveredPP' },
]

const toForm = (value: DeliveryReportFilters | null) => ({
  sender: value?.sender ?? '',
  recipient: value?.recipient ?? '',
  status: value?.status ?? 0,
  startDate: value?.startDate || null,
  endDate: value?.endDate || null,
})

const form = ref(toForm(filters.value))
const applying = ref(false)

watch(filters, (value) => (form.value = toForm(value)))

const hidden = computed(() => !filters.value && reports.value?.length === 0)

const isEmpty = computed(
  () =>
    !form.value.sender.trim() &&
    !form.value.recipient.trim() &&
    !form.value.status &&
    !form.value.startDate &&
    !form.value.endDate,
)

const hasFilters = computed(() => !isEmpty.value || !!filters.value)

const today = new Date(new Date().setHours(0, 0, 0, 0))
const toDate = (value: string) => new Date(`${value}T00:00`)

const isUnavailableStart = (date: Date) =>
  date > today || (!!form.value.endDate && date > toDate(form.value.endDate))

const isUnavailableEnd = (date: Date) =>
  date > today ||
  (!!form.value.startDate && date < toDate(form.value.startDate))

const apply = async () => {
  if (!hasFilters.value || loading.value) return
  try {
    applying.value = true
    await applyFilters(
      isEmpty.value
        ? null
        : {
            sender: form.value.sender.trim(),
            recipient: form.value.recipient.trim(),
            status: Number(form.value.status) || 0,
            startDate: form.value.startDate ?? '',
            endDate: form.value.endDate ?? '',
          },
    )
  } finally {
    applying.value = false
  }
}

const clear = () => {
  form.value = toForm(null)
  if (filters.value) applyFilters(null)
}
</script>
