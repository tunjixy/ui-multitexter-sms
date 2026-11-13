<template>
  <form
    novalidate
    class="border-border bg-surface max-w-2xl rounded-2xl border p-6 sm:p-8"
    @submit="onSubmit"
  >
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 class="text-sm font-semibold">Your file</h2>
        <p class="text-muted-foreground mt-1 text-sm">
          One contact per row, with these columns:
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
        href="/contact_to_upload_format.csv"
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
      description="CSV only, up to 10MB"
      :disabled="loading"
      :error="errors.file"
      class="mt-6"
    />

    <ContactListPicker
      v-model:mode="mode"
      v-model:name="listName"
      v-model:list-id="listId"
      :name-error="errors.listName"
      :list-error="errors.listId"
      class="border-border mt-6 border-t pt-6"
    />

    <UiFormError v-if="errorMessage" :message="errorMessage" />

    <div class="mt-6 flex justify-end">
      <UiButton type="submit" radius="lg" :loading="loading">
        Upload contacts
      </UiButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import * as Yup from 'yup'
import { useField, useForm } from 'vee-validate'
import { DownloadIcon } from '@lucide/vue'
import { apiClient } from '@/repository/api'
import type { ContactListMode } from '@/composables/useContactLists'
import contactListFields from '@/composables/useContactLists'

const MAX_FILE_SIZE = 10 * 1024 * 1024

const { $toast } = useNuxtApp()
const { fetchContactLists } = useContactLists()
const columns = ['phonenumber', 'name']

const schema = Yup.object({
  file: Yup.mixed<File>()
    .required('Choose a CSV file')
    .test('csv', 'Choose a file that ends in .csv', (value) =>
      value ? value.name.toLowerCase().endsWith('.csv') : true,
    )
    .test('size', 'Choose a file smaller than 10MB', (value) =>
      value ? value.size <= MAX_FILE_SIZE : true,
    ),
  ...contactListFields,
})

const { errors, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    file: null as File | null,
    mode: 'create' as ContactListMode,
    listName: '',
    listId: null as number | null,
  },
})
const { value: file } = useField<File | null>('file')
const { value: mode } = useField<ContactListMode>('mode')
const { value: listName } = useField<string>('listName')
const { value: listId } = useField<number | null>('listId')
const loading = ref(false)
const errorMessage = ref('')

const onSubmit = handleSubmit(async (values) => {
  const formData = new FormData()
  formData.append('contact_file', values.file as File)
  if (values.mode === 'create') {
    formData.append('contactlistname', values.listName.trim())
  } else {
    formData.append('contactlistid', String(values.listId))
  }

  try {
    loading.value = true
    errorMessage.value = ''
    const response = await apiClient.phonebook.uploadContact(formData)
    if (response.status === 1) {
      $toast.success(response.msg || 'Your contacts have been uploaded.')
      resetForm()
      fetchContactLists()
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
</script>
