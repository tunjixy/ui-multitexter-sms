<template>
  <div class="mx-auto w-full py-4 sm:py-0 md:max-w-lg">
    <p class="text-2xl font-bold md:text-3xl">Welcome back</p>
    <p class="text-muted-foreground mt-1">Sign in to access your account</p>
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
        <UiInput
          id="password"
          v-model="password"
          label="Password"
          type="password"
          name="password"
          :error="errors.password"
          class="mt-4"
        />
        <NuxtLink
          to="/forgot-password"
          class="text-primary mt-4 inline-block text-sm"
        >
          Forgot password?
        </NuxtLink>

        <UiFormError v-if="errorMessage" :message="errorMessage" />

        <UiButton
          type="submit"
          raised
          block
          radius="md"
          :disabled="disabled"
          :loading="loading"
          class="mt-8"
        >
          Login
        </UiButton>
        <p class="mt-5 text-center text-sm">
          Don't have an account?
          <NuxtLink to="/signup" class="text-primary font-semibold">
            Create account
          </NuxtLink>
        </p>
      </form>
    </div>

    <div class="mt-3 flex items-center justify-between gap-3">
      <p class="text-center text-sm">
        Trouble signing in?
        <a
          href="https://wa.me/2348148734028"
          target="_blank"
          rel="noopener"
          class="text-primary text-xs font-semibold"
        >
          Chat with us
        </a>
      </p>
      <div class="flex items-center gap-2 text-xs">
        <NuxtLink to="/privacy-policy" class="hover:text-primary font-semibold">
          Privacy
        </NuxtLink>
        |
        <NuxtLink to="/terms" class="hover:text-primary font-semibold">
          Terms
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as Yup from 'yup'
import { useField, useForm } from 'vee-validate'
import { apiClient } from '@/repository/api'

const { activated } = useRoute().query
const { $toast } = useNuxtApp()
const { persistSession } = useAuth()

const schema = Yup.object().shape({
  email: Yup.string().required().email().label('Email address').trim(),
  password: Yup.string().required().label('Password').trim(),
})
const { errors, handleSubmit, meta } = useForm({
  validationSchema: schema,
  initialValues: {
    email: '',
    password: '',
  },
})
const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')
const loading = ref(false)
const errorMessage = ref('')

const disabled = computed(() => {
  return loading.value || !meta.value.valid
})

onMounted(() => {
  if (Number(activated) === 1) {
    $toast.success('Your account has been verified')
  }
})

const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true
    errorMessage.value = ''
    const response = await apiClient.auth.login({
      email: values.email,
      password: values.password,
    })
    if (response.status === 1) {
      persistSession(response)
    } else if (response.status === -2 || response.status === -3) {
      errorMessage.value = response.msg
    }
  } catch (err) {
    errorMessage.value = formatErrorResponse(err)
  } finally {
    loading.value = false
  }
})
</script>
