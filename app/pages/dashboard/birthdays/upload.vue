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

      <h1 class="mt-4 text-2xl font-bold tracking-tight">Upload birthdays</h1>
      <p class="text-muted-foreground mt-1 max-w-xl text-sm">
        Add lots of birthdays at once from a CSV file.
      </p>

      <form
        novalidate
        class="border-border bg-surface mt-6 max-w-2xl rounded-2xl border p-6 sm:p-8"
        @submit="onSubmit"
      >
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 class="text-sm font-semibold">Your file</h2>
            <p class="text-muted-foreground mt-1 text-sm">
              One person per row, with these columns in this order:
            </p>
            <ol class="mt-3 flex flex-wrap gap-2">
              <li
                v-for="column in columns"
                :key="column"
                class="border-border bg-background rounded-md border px-2 py-1 font-mono text-xs"
              >
                {{ column }}
              </li>
            </ol>
          </div>
          <a
            href="/birthday_upload_format.csv"
            download
            class="text-primary hover:text-primary/80 focus-visible:ring-primary/35 inline-flex items-center gap-1.5 rounded-sm text-sm font-medium transition-colors outline-none focus-visible:ring-2"
          >
            <DownloadIcon class="size-4" />
            Sample CSV
          </a>
        </div>

        <UiFileUpload
          v-model="file"
          name="file"
          accept=".csv,text/csv"
          placeholder="Choose a CSV file"
          description="Birth dates as DD/MM/YYYY, e.g. 25/5/1996"
          :disabled="loading"
          :error="errors.file"
          class="mt-6"
        />

        <div class="mt-5 grid gap-4 sm:grid-cols-2">
          <UiInput
            v-model="senderName"
            name="senderName"
            label="Sender name"
            maxlength="11"
            placeholder="MyBrand"
            hint="Up to 11 characters."
            :error="errors.senderName"
          />
          <UiDatePicker
            v-model="sendTime"
            name="sendTime"
            label="Send at"
            type="time"
            format="h:mm"
            value-type="HH:mm:ss"
            placeholder="Pick a time"
            hint="The same time every year."
            :error="errors.sendTime"
          />
        </div>

        <UiFormError v-if="errorMessage" :message="errorMessage" />

        <div class="mt-6 flex justify-end">
          <UiButton type="submit" radius="lg" :loading="loading">
            {{ loading ? '' : 'Upload birthdays' }}
          </UiButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as Yup from 'yup'
import { useField, useForm } from 'vee-validate'
import { ArrowLeftIcon, DownloadIcon } from '@lucide/vue'
import { apiClient } from '@/repository/api'

useAppStore().setPageTitle('Upload Birthdays')

const { $toast } = useNuxtApp()
const columns = ['name', 'mobile_number', 'birthdate', 'message']

const isCsv = (file: File) => file.name.toLowerCase().endsWith('.csv')

const schema = Yup.object({
  file: Yup.mixed<File>()
    .required('Choose a CSV file')
    .test('csv', 'Choose a file that ends in .csv', (value) =>
      value ? isCsv(value) : true,
    ),
  senderName: Yup.string()
    .trim()
    .required('Enter a sender name')
    .max(11, 'Use 11 characters or fewer'),
  sendTime: Yup.string().required('Pick a time to send'),
})

const { errors, handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: {
    file: null as File | null,
    senderName: '',
    sendTime: '',
  },
})
const { value: file } = useField<File | null>('file')
const { value: senderName } = useField<string>('senderName')
const { value: sendTime } = useField<string>('sendTime')
const loading = ref(false)
const errorMessage = ref('')

const onSubmit = handleSubmit(async (values) => {
  const formData = new FormData()
  formData.append('birthday', values.file as File)
  formData.append('displayname', values.senderName.trim())
  formData.append('send_time', values.sendTime)

  try {
    loading.value = true
    errorMessage.value = ''
    const response = await apiClient.birthday.uploadBirthday(formData)
    if (response.status === 1) {
      $toast.success(response.msg || 'Your birthdays have been uploaded.')
      await navigateTo('/dashboard/birthdays')
    } else {
      errorMessage.value =
        response.msg || "We couldn't upload this file. Please try again."
    }
  } catch (err) {
    errorMessage.value = formatErrorResponse(err)
  } finally {
    loading.value = false
  }
})

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useHead({
  title: 'Upload Birthdays',
})
</script>
