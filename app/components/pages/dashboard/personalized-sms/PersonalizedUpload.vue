<template>
  <section class="border-border bg-surface rounded-2xl border p-6 sm:p-8">
    <p class="text-primary text-xs font-semibold tracking-wider uppercase">
      Step 1
    </p>
    <div class="mt-1 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 class="font-semibold">Upload your recipients</h2>
        <p class="text-muted-foreground mt-1 text-sm">
          One recipient per row, with these columns:
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
        href="/Personalized_format.csv"
        download
        class="text-primary hover:text-primary/80 focus-visible:ring-primary/35 inline-flex items-center gap-1.5 rounded-sm text-sm font-medium transition-colors outline-none focus-visible:ring-2"
      >
        <DownloadIcon class="size-4" />
        Sample CSV
      </a>
    </div>

    <div
      v-if="template"
      class="border-border mt-6 flex items-center gap-3 rounded-xl border p-4"
    >
      <span
        class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-700 dark:text-green-400"
      >
        <CheckIcon class="size-5" />
      </span>
      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-medium">{{ template.name }}</p>
        <p class="text-muted-foreground text-xs">Uploaded</p>
      </div>
      <UiButton
        variant="outline"
        size="sm"
        radius="lg"
        @click="template = null"
      >
        Change file
      </UiButton>
    </div>

    <form v-else novalidate class="mt-6" @submit="onSubmit">
      <UiFileUpload
        v-model="file"
        name="file"
        accept=".csv,text/csv"
        placeholder="Choose a CSV file"
        description="CSV only, up to 10MB"
        :disabled="loading"
        :error="errors.file"
      />

      <UiFormError v-if="errorMessage" :message="errorMessage" />

      <div class="mt-6 flex justify-end">
        <UiButton type="submit" radius="lg" :loading="loading">
          Upload file
        </UiButton>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import * as Yup from 'yup'
import { useField, useForm } from 'vee-validate'
import { CheckIcon, DownloadIcon } from '@lucide/vue'
import { apiClient } from '@/repository/api'
import type { PersonalizedTemplate } from '@/types/personalized'

const MAX_FILE_SIZE = 10 * 1024 * 1024

const template = defineModel<PersonalizedTemplate | null>({ default: null })

const { $toast } = useNuxtApp()
const columns = ['PhoneNumber', 'FIRST NAME', 'MESSAGES']

const schema = Yup.object({
  file: Yup.mixed<File>()
    .required('Choose a CSV file')
    .test('csv', 'Choose a file that ends in .csv', (value) =>
      value ? value.name.toLowerCase().endsWith('.csv') : true,
    )
    .test('size', 'Choose a file smaller than 10MB', (value) =>
      value ? value.size <= MAX_FILE_SIZE : true,
    ),
})

const { errors, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    file: null as File | null,
  },
})
const { value: file } = useField<File | null>('file')
const loading = ref(false)
const errorMessage = ref('')

const onSubmit = handleSubmit(async (values) => {
  const upload = values.file as File
  const formData = new FormData()
  formData.append('personalized', upload)

  try {
    loading.value = true
    errorMessage.value = ''
    const response = await apiClient.personalized.uploadTemplateFile(formData)
    if (response.status === 1) {
      $toast.success(response.msg || 'Your file has been uploaded.')
      template.value = {
        name: upload.name,
        fileUrl: response.fileurl,
        filename: response.filename,
        message: response.display ?? '',
      }
      resetForm()
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
