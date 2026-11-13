<template>
  <UiModal
    v-model:open="open"
    size="sm"
    title="Add contact"
    :description="
      listName
        ? `The number is saved to ${listName}.`
        : 'The number is saved to this list.'
    "
    :close-on-backdrop="!loading"
    :close-on-esc="!loading"
  >
    <form :id="formId" novalidate @submit="onSubmit">
      <UiInput
        v-model="phoneNumber"
        type="tel"
        name="phoneNumber"
        label="Phone number"
        inputmode="tel"
        placeholder="08012345678"
        :error="errors.phoneNumber"
      />
    </form>

    <UiFormError v-if="errorMessage" :message="errorMessage" />

    <template #footer="{ close }">
      <UiButton
        variant="outline"
        radius="lg"
        :disabled="loading"
        @click="close"
      >
        Cancel
      </UiButton>
      <UiButton type="submit" :form="formId" radius="lg" :loading="loading">
        {{ loading ? '' : 'Add contact' }}
      </UiButton>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import * as Yup from 'yup'
import { useField, useForm } from 'vee-validate'
import { apiClient } from '@/repository/api'

const props = defineProps<{
  listId: number
  listName?: string
}>()

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  saved: []
}>()

const { $toast } = useNuxtApp()
const formId = useId()

const schema = Yup.object({
  phoneNumber: Yup.string()
    .trim()
    .required('Enter a phone number')
    .test(
      'phone',
      'Enter a valid phone number',
      (value) => !value || /^\+?\d{10,15}$/.test(value.replace(/[\s-]/g, '')),
    ),
})

const { errors, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
  initialValues: { phoneNumber: '' },
})
const { value: phoneNumber } = useField<string>('phoneNumber')
const loading = ref(false)
const errorMessage = ref('')

watch(open, (isOpen) => {
  if (!isOpen) return
  errorMessage.value = ''
  resetForm({ values: { phoneNumber: '' } })
})

const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true
    errorMessage.value = ''
    const response = await apiClient.phonebook.createContact({
      mobilenumber: values.phoneNumber.replace(/[\s-]/g, ''),
      contactlistid: props.listId,
    })
    if (response.status === 1) {
      emit('saved')
      $toast.success(response.msg || 'Contact added.')
      open.value = false
    } else {
      errorMessage.value =
        response.msg || "We couldn't add this contact. Please try again."
    }
  } catch (err) {
    errorMessage.value = formatErrorResponse(err)
  } finally {
    loading.value = false
  }
})
</script>
