<template>
  <form
    novalidate
    class="border-border bg-surface max-w-2xl rounded-2xl border p-6 sm:p-8"
    @submit="onSubmit"
  >
    <div class="grid gap-5 sm:grid-cols-2">
      <UiDatePicker
        v-model="startDate"
        name="startDate"
        label="From"
        type="date"
        format="D MMM YYYY"
        value-type="YYYY-MM-DD"
        placeholder="Start date"
        :disabled-date="isUnavailableStart"
        :error="errors.startDate"
      />
      <UiDatePicker
        v-model="endDate"
        name="endDate"
        label="To"
        type="date"
        format="D MMM YYYY"
        value-type="YYYY-MM-DD"
        placeholder="End date"
        :disabled-date="isUnavailableEnd"
        :error="errors.endDate"
      />
      <UiInput
        v-model="senderName"
        name="senderName"
        label="Sender name (optional)"
        placeholder="e.g. MyBrand"
        spellcheck="false"
        :error="errors.senderName"
      />
      <UiSelect
        v-model="status"
        name="status"
        label="Status"
        :options="statusOptions"
      />
    </div>

    <UiFormError v-if="errorMessage" :message="errorMessage" />

    <div class="mt-6 flex justify-end">
      <UiButton type="submit" radius="lg" :loading="loading">
        <template #leading>
          <DownloadIcon class="size-4" />
        </template>
        Download report
      </UiButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import * as Yup from 'yup'
import { useField, useForm } from 'vee-validate'
import { DownloadIcon } from '@lucide/vue'
import type { Column } from 'write-excel-file/browser'
import { apiClient } from '@/repository/api'
import type { SelectOption } from '@/components/ui/UiSelect.vue'
import type { DownloadReport } from '@/types/report'

const { $toast } = useNuxtApp()

const statusOptions: SelectOption[] = [
  { value: '', label: 'Any status' },
  { value: '1', label: 'Delivered' },
  { value: '2', label: 'Sent' },
  { value: '18', label: 'DeliveredPP' },
]

const text = (value: unknown) => (value == null ? '' : String(value))

const columns: (Column<DownloadReport> & { header: string })[] = [
  { header: 'Id', width: 24, cell: (r) => text(r.remotemsgid) },
  { header: 'Recipient', width: 16, cell: (r) => text(r.recipient) },
  { header: 'Message', width: 60, cell: (r) => text(r.content) },
  { header: 'Type', width: 10, cell: (r) => text(r.type) },
  {
    header: 'Length',
    width: 8,
    cell: (r) => ({ value: Number(r.length) || 0, type: Number }),
  },
  { header: 'Sender Name', width: 16, cell: (r) => text(r.sender_name) },
  { header: 'Country', width: 14, cell: (r) => text(r.country) },
  { header: 'Status', width: 14, cell: (r) => text(r.status) },
  { header: 'Date Sent', width: 20, cell: (r) => text(r.dispatchtime) },
]

const today = new Date(new Date().setHours(0, 0, 0, 0))
const toDate = (value: string) => new Date(`${value}T00:00`)

const schema = Yup.object({
  startDate: Yup.string().required('Pick a start date'),
  endDate: Yup.string().required('Pick an end date'),
  senderName: Yup.string().trim(),
  status: Yup.string(),
})

const { errors, handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: {
    startDate: '',
    endDate: '',
    senderName: '',
    status: '',
  },
})
const { value: startDate } = useField<string>('startDate')
const { value: endDate } = useField<string>('endDate')
const { value: senderName } = useField<string>('senderName')
const { value: status } = useField<string>('status')
const loading = ref(false)
const errorMessage = ref('')

const isUnavailableStart = (date: Date) =>
  date > today || (!!endDate.value && date > toDate(endDate.value))

const isUnavailableEnd = (date: Date) =>
  date > today || (!!startDate.value && date < toDate(startDate.value))

const saveSpreadsheet = async (
  reports: DownloadReport[],
  from: string,
  to: string,
) => {
  const { default: writeXlsxFile } = await import('write-excel-file/browser')
  await writeXlsxFile(reports, {
    sheet: 'Delivery report',
    stickyRowsCount: 1,
    columns: columns.map((column) => ({
      ...column,
      header: { value: column.header, fontWeight: 'bold' as const },
    })),
  }).toFile(`delivery-report-${from}-to-${to}.xlsx`)
}

const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true
    errorMessage.value = ''
    const response = await apiClient.report.downloadReport({
      startDate: values.startDate,
      endDate: values.endDate,
      senderName: values.senderName?.trim() ?? '',
      status: values.status ?? '',
    })

    if (response.status === 1) {
      const reports = Array.isArray(response.data) ? response.data : []
      if (!reports.length) {
        errorMessage.value =
          'No messages were sent in this period. Try a wider date range or fewer filters.'
        return
      }
      await saveSpreadsheet(reports, values.startDate, values.endDate)
      $toast.success('Your report has been downloaded.')
    } else if (response.status === 0 || response.status === 2) {
      $toast.info(response.msg)
    } else {
      errorMessage.value =
        response.msg || "We couldn't prepare your report. Please try again."
    }
  } catch (err) {
    errorMessage.value = formatErrorResponse(err)
  } finally {
    loading.value = false
  }
})
</script>
