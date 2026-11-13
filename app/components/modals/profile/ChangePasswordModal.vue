<template>
  <UiModal
    v-model:open="open"
    title="Change password"
    description="Enter your current password, then choose a new one."
    :close-on-backdrop="!loading"
    :close-on-esc="!loading"
  >
    <form :id="formId" novalidate class="space-y-4" @submit="onSubmit">
      <UiInput
        v-model="currentPassword"
        type="password"
        name="currentPassword"
        label="Current password"
        autocomplete="current-password"
        :error="errors.currentPassword"
      />
      <UiInput
        v-model="password"
        type="password"
        name="password"
        label="New password"
        autocomplete="new-password"
        hint="At least 12 characters, with an uppercase letter, a number and a special character."
        :error="errors.password"
      />
      <UiInput
        v-model="confirmPassword"
        type="password"
        name="confirmPassword"
        label="Confirm new password"
        autocomplete="new-password"
        :error="errors.confirmPassword"
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
      <UiButton
        type="submit"
        :form="formId"
        radius="lg"
        :loading="loading"
        :disabled="disabled"
      >
        {{ loading ? '' : 'Update password' }}
      </UiButton>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import * as Yup from 'yup'
import { useField, useForm } from 'vee-validate'
import { apiClient } from '@/repository/api'

const open = defineModel<boolean>('open', { default: false })

const { $toast } = useNuxtApp()
const formId = useId()

const schema = Yup.object({
  currentPassword: Yup.string().required('Enter your current password'),
  password: Yup.string()
    .required('Enter a new password')
    .min(12, 'Must be at least 12 characters')
    .matches(/[A-Z]/, 'Must contain uppercase')
    .matches(/\d/, 'Must contain a number')
    .matches(/[^A-Za-z0-9]/, 'Must contain a special character')
    .notOneOf(
      [Yup.ref('currentPassword')],
      'Choose a password different from your current one',
    ),
  confirmPassword: Yup.string()
    .required('Confirm your new password')
    .oneOf([Yup.ref('password')], 'Passwords do not match'),
})

const emptyValues = {
  currentPassword: '',
  password: '',
  confirmPassword: '',
}

const { errors, handleSubmit, meta, resetForm } = useForm({
  validationSchema: schema,
  initialValues: emptyValues,
})
const { value: currentPassword } = useField<string>('currentPassword')
const { value: password } = useField<string>('password')
const { value: confirmPassword } = useField<string>('confirmPassword')
const loading = ref(false)
const errorMessage = ref('')

const disabled = computed(() => loading.value || !meta.value.valid)

watch(open, (isOpen) => {
  if (!isOpen) return
  errorMessage.value = ''
  resetForm({ values: emptyValues })
})

const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true
    errorMessage.value = ''
    const response = await apiClient.user.changePassword({
      current_password: values.currentPassword,
      password: values.password,
      password_confirmation: values.confirmPassword,
    })
    if (response.status === 1) {
      $toast.success(response.msg || 'Your password has been changed.')
      open.value = false
    } else {
      errorMessage.value =
        response.msg || "We couldn't change your password. Please try again."
    }
  } catch (err) {
    errorMessage.value = formatErrorResponse(err)
  } finally {
    loading.value = false
  }
})
</script>
