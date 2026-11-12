<template>
  <div class="mx-auto w-full py-4 sm:py-0 md:max-w-lg">
    <p class="text-2xl font-bold md:text-3xl">Welcome to Multitexter</p>
    <p class="text-muted-foreground mt-1">Let's get you signed up</p>
    <div class="border-border bg-surface mt-6 rounded-lg border px-8 py-6">
      <form @submit="onSubmit">
        <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
          <UiInput
            id="firstName"
            v-model="firstName"
            label="Firstname"
            type="text"
            name="firstname"
            :error="errors.firstName"
          />
          <UiInput
            id="lastName"
            v-model="lastName"
            label="Lastname"
            type="text"
            name="lastName"
            :error="errors.lastName"
          />
        </div>
        <div class="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
          <UiInput
            id="email"
            v-model="email"
            label="Email address"
            type="email"
            name="email"
            :error="errors.email"
          />
          <UiInput
            id="phoneNumber"
            v-model="phoneNumber"
            label="Phone number"
            inputmode="numeric"
            type="tel"
            name="phoneNumber"
            :error="errors.phoneNumber"
          />
        </div>
        <div class="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
          <UiInput
            id="password"
            v-model="password"
            label="Password"
            type="password"
            name="password"
            :error="errors.password"
          />
          <UiInput
            id="confirmPassword"
            v-model="confirmPassword"
            label="Confirm password"
            type="password"
            name="confirmPassword"
            :error="errors.confirmPassword"
          />
        </div>
        <UiInput
          id="companyName"
          v-model="companyName"
          label="Company name (optional)"
          type="text"
          name="companyName"
          :error="errors.companyName"
          class="mt-4"
        />

        <UiFormError v-if="errorMessage.length" :message="errorMessage" />

        <UiButton
          type="submit"
          raised
          block
          radius="md"
          :disabled="disabled"
          :loading="loading"
          class="mt-8"
        >
          {{ loading ? '' : 'Create Account' }}
        </UiButton>
        <p class="mt-5 text-center text-sm">
          Already have an account?
          <NuxtLink to="/login" class="text-primary font-semibold">
            Login
          </NuxtLink>
        </p>
      </form>
    </div>

    <div class="mt-5 text-center text-xs">
      By continuing you agree to Multitexter
      <NuxtLink to="/terms" class="text-primary font-semibold">
        Terms
      </NuxtLink>
      &
      <NuxtLink to="/privacy-policy" class="text-primary font-semibold">
        Privacy Policy
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as Yup from 'yup'
import { useField, useForm } from 'vee-validate'
import { apiClient } from '@/repository/api'

const { ref: code, utm_source, utm_medium, utm_campaign } = useRoute().query
const { persistSession } = useAuth()

const schema = Yup.object().shape({
  firstName: Yup.string().required().label('Firstname').trim(),
  lastName: Yup.string().required().label('Lastname').trim(),
  email: Yup.string().required().email().label('Email address').trim(),
  phoneNumber: Yup.string().required().label('Phone number').trim(),
  password: Yup.string()
    .required()
    .label('Password')
    .trim()
    .min(12, 'Must be at least 12 characters')
    .matches(/[A-Z]/, 'Must contain uppercase')
    .matches(/\d/, 'Must contain a number')
    .matches(/[^A-Za-z0-9]/, 'Must contain a special character'),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .label('Confirm password')
    .trim(),
  companyName: Yup.string().label('Company name').trim(),
})
const { errors, handleSubmit, meta } = useForm({
  validationSchema: schema,
  initialValues: {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    companyName: '',
  },
})
const { value: firstName } = useField<string>('firstName')
const { value: lastName } = useField<string>('lastName')
const { value: email } = useField<string>('email')
const { value: phoneNumber } = useField<string>('phoneNumber')
const { value: password } = useField<string>('password')
const { value: confirmPassword } = useField<string>('confirmPassword')
const { value: companyName } = useField<string>('companyName')
const loading = ref(false)
const errorMessage = ref<string | string[]>('')

const disabled = computed(() => {
  return loading.value || !meta.value.valid
})

const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true
    errorMessage.value = ''
    const response = await apiClient.auth.signup({
      email: values.email,
      firstname: values.firstName,
      lastname: values.lastName,
      password: values.password,
      mobile_number: formatPhoneNumber(values.phoneNumber),
      password_confirmation: values.confirmPassword,
      ref: Number(code),
      source: utm_source as string,
      medium: utm_medium as string,
      campaign: utm_campaign as string,
    })
    if (response.status === 1) {
      const result = await apiClient.auth.login({
        email: values.email,
        password: values.password,
      })
      if (result.status === 1) {
        persistSession(result)
      }
    } else if (response.status === -2) {
      errorMessage.value = response.data.msg
        .split('.')
        .map((msg) => msg.trim())
        .filter(Boolean)
    }
  } catch (err) {
    errorMessage.value = formatErrorResponse(err)
  } finally {
    loading.value = false
  }
})
</script>
