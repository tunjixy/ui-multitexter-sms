<template>
  <div class="mx-auto w-full py-4 sm:py-0 md:max-w-lg">
    <p class="text-2xl font-bold md:text-3xl">Request verification link</p>
    <p class="text-muted-foreground mt-1">Enter your email to request link</p>
    <div class="border-border bg-surface mt-6 rounded-lg border px-8 py-6">
      <form @submit="onSubmit">
        <UiInput
          id="email"
          v-model="email"
          label="Email address"
          type="email"
          name="email"
          :error="errors.email"
        />

        <UiFormError v-if="errorMessage" :message="errorMessage" />

        <UiButton
          type="submit"
          raised
          block
          radius="md"
          :disabled="disabled"
          :loading="loading"
          class="mt-5"
        >
          {{ loading ? '' : 'Submit' }}
        </UiButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as Yup from 'yup'
import { useField, useForm } from 'vee-validate'
import { apiClient } from '@/repository/api'

const { $toast } = useNuxtApp()

const schema = Yup.object().shape({
  email: Yup.string().required().email().label('Email address').trim(),
})
const { errors, handleSubmit, meta } = useForm({
  validationSchema: schema,
  initialValues: {
    email: '',
  },
})
const { value: email } = useField<string>('email')
const loading = ref(false)
const errorMessage = ref('')

const disabled = computed(() => {
  return loading.value || !meta.value.valid
})

const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true
    errorMessage.value = ''
    const response = await apiClient.user.resendActivationCode(values.email)
    if (response.status === 1) {
      $toast.success(response.msg)
    } else if (response.status === -2) {
      $toast.error(response.msg)
    }
  } catch (err) {
    errorMessage.value = formatErrorResponse(err)
  } finally {
    loading.value = false
  }
})
</script>
