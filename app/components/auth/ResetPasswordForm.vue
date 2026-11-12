<template>
  <div class="mx-auto w-full py-4 sm:py-0 md:max-w-lg">
    <p class="text-2xl font-bold md:text-3xl">Reset password</p>
    <p class="text-muted-foreground mt-1">
      Choose a new password for your account
    </p>
    <div class="border-border bg-surface mt-6 rounded-lg border px-8 py-6">
      <div
        v-if="linkState === 'checking'"
        role="status"
        aria-live="polite"
        class="flex flex-col items-center py-6 text-center"
      >
        <span
          aria-hidden="true"
          class="border-primary/20 border-t-primary size-10 rounded-full border-3 motion-safe:animate-spin"
        />
        <p class="text-muted-foreground mt-4 text-sm">
          Checking your reset link...
        </p>
      </div>

      <form v-else-if="linkState === 'valid'" @submit="onSubmit">
        <UiInput
          id="email"
          v-model="email"
          label="Email address"
          type="email"
          name="email"
          readonly
          disabled
          :error="errors.email"
        />
        <UiInput
          id="password"
          v-model="password"
          label="New password"
          type="password"
          name="password"
          :error="errors.password"
          class="mt-4"
        />
        <UiInput
          id="confirmPassword"
          v-model="confirmPassword"
          label="Confirm new password"
          type="password"
          name="confirmPassword"
          :error="errors.confirmPassword"
          class="mt-4"
        />

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
          {{ loading ? '' : 'Reset password' }}
        </UiButton>
      </form>

      <div v-else class="flex flex-col items-center py-2 text-center">
        <div class="relative">
          <span
            aria-hidden="true"
            class="absolute inset-0 rounded-2xl bg-amber-500/25 blur-xl"
          />
          <span
            class="border-border bg-surface relative flex size-12 items-center justify-center rounded-2xl border text-amber-600 dark:text-amber-400"
          >
            <WifiOff v-if="linkState === 'error'" class="size-6" />
            <Link2Off v-else class="size-6" />
          </span>
        </div>
        <h2 class="mt-5 text-lg font-semibold tracking-tight">
          {{
            linkState === 'error'
              ? "We couldn't check your link"
              : 'This link has expired or is invalid'
          }}
        </h2>
        <p class="text-muted-foreground mt-1 text-sm text-pretty" role="alert">
          {{
            linkError ||
            "Password reset links expire after a while. Request a new one and we'll email it to you."
          }}
        </p>

        <UiButton
          v-if="linkState === 'error'"
          raised
          block
          radius="md"
          class="mt-6"
          @click="checkResetLink"
        >
          Try again
        </UiButton>
        <NuxtLink
          v-else
          to="/forgot-password"
          class="bg-primary hover:bg-primary/90 focus-visible:ring-primary/35 mt-6 flex h-10 w-full items-center justify-center rounded-md px-4 text-sm font-semibold text-white shadow-sm transition outline-none hover:shadow-md focus-visible:ring-3"
        >
          Request a new link
        </NuxtLink>
      </div>

      <p v-if="linkState !== 'checking'" class="mt-3 text-center text-sm">
        <NuxtLink
          to="/login"
          class="text-primary inline-flex items-center gap-1.5 font-semibold"
          :class="{ 'pointer-events-none opacity-50': loading }"
          :aria-disabled="loading"
          :tabindex="loading ? -1 : undefined"
        >
          <ArrowLeft class="size-4" />
          Back to login
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as Yup from 'yup'
import { ArrowLeft, Link2Off, WifiOff } from '@lucide/vue'
import { useField, useForm } from 'vee-validate'
import { apiClient } from '@/repository/api'

const { reset } = useRoute().query
const { $toast } = useNuxtApp()

const token = typeof reset === 'string' ? reset : ''

const schema = Yup.object().shape({
  email: Yup.string().required().email().label('Email address').trim(),
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
})
const { errors, handleSubmit, meta } = useForm({
  validationSchema: schema,
  initialValues: {
    email: '',
    password: '',
    confirmPassword: '',
  },
})
const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')
const { value: confirmPassword } = useField<string>('confirmPassword')
const loading = ref(false)
const errorMessage = ref('')

const linkState = ref<'checking' | 'valid' | 'invalid' | 'error'>(
  token ? 'checking' : 'invalid',
)
const linkError = ref('')
const resetCode = ref('')

const disabled = computed(() => {
  return loading.value || !meta.value.valid
})

const checkResetLink = async () => {
  linkState.value = 'checking'
  linkError.value = ''
  try {
    const response = await apiClient.auth.resetCodeCheck(token)
    if (response.status === 1) {
      email.value = response.email
      resetCode.value = response.resetcode
      linkState.value = 'valid'
    } else {
      linkError.value = response.msg
      linkState.value = 'invalid'
    }
  } catch (err: any) {
    const status = err?.response?.status
    linkError.value = formatErrorResponse(err)
    linkState.value = status && status < 500 ? 'invalid' : 'error'
  }
}

onMounted(() => {
  if (token) checkResetLink()
})

const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true
    errorMessage.value = ''
    const response = await apiClient.auth.resetPassword({
      email: values.email,
      password: values.password,
      password_confirmation: values.confirmPassword,
      token: resetCode.value,
    })
    if (response) {
      $toast.success('Your password has been reset. Log in to continue.')
      await navigateTo('/login')
    } else {
      errorMessage.value = "We couldn't reset your password. Please try again."
    }
  } catch (err) {
    errorMessage.value = formatErrorResponse(err)
  } finally {
    loading.value = false
  }
})
</script>
