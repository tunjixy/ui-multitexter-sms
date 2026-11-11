<template>
  <section class="py-16 lg:py-24">
    <div
      class="wrapper grid items-start gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16"
    >
      <div>
        <p
          class="text-primary text-xs font-semibold tracking-[0.25em] uppercase"
        >
          Direct Channels
        </p>

        <h2
          class="text-foreground mt-4 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl"
        >
          Connect with the right department.
        </h2>

        <p class="text-muted-foreground mt-5 text-base leading-relaxed">
          Choose the fastest channel for your enquiry or visit our headquarters
          located at the commercial tech corridor in Sabo, Yaba.
        </p>

        <ul class="mt-10 flex flex-col gap-4">
          <li
            v-for="channel in channels"
            :key="channel.email"
            class="bg-surface border-border hover:border-primary/40 flex gap-4 rounded-2xl border p-6 transition-colors ease-in"
          >
            <span
              class="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl"
            >
              <component :is="channel.icon" class="size-5" />
            </span>

            <div class="min-w-0">
              <h3 class="text-foreground text-base font-semibold">
                {{ channel.title }}
              </h3>
              <p class="text-muted-foreground mt-1 text-sm">
                {{ channel.description }}
              </p>
              <a
                :href="`mailto:${channel.email}`"
                class="text-primary mt-3 inline-block text-sm font-semibold break-all hover:underline"
              >
                {{ channel.email }}
              </a>
            </div>
          </li>
        </ul>
      </div>

      <div class="bg-surface border-border rounded-3xl border p-6 sm:p-10">
        <span
          class="bg-primary/10 text-primary border-primary/30 inline-block rounded-full border px-3 py-1 text-xs font-medium"
        >
          Quick Inquiry
        </span>

        <h2 class="text-foreground mt-4 text-2xl font-semibold tracking-tight">
          Send us a message
        </h2>
        <p class="text-muted-foreground mt-2 text-sm">
          Tell us what you need and the right team will get back to you.
        </p>

        <form
          class="border-border mt-8 flex flex-col border-t pt-8"
          novalidate
          @submit.prevent="onSubmit"
        >
          <div class="grid gap-6 sm:grid-cols-2">
            <UiInput
              id="contact-fullname"
              v-model="fullname"
              label="Full Name"
              name="fullname"
              autocomplete="name"
              placeholder="e.g. Babatunde Adeleke"
              :error="errors.fullname"
            />
            <UiInput
              id="contact-email"
              v-model="email"
              label="Email"
              type="email"
              name="email"
              autocomplete="email"
              placeholder="babatunde@company.ng"
              :error="errors.email"
            />
          </div>
          <UiTextarea
            id="contact-message"
            v-model="message"
            label="Message"
            name="message"
            :rows="4"
            placeholder="Describe your request, monthly message estimate, or technical questions..."
            :error="errors.message"
            class="mt-6"
          />

          <UiFormError
            v-if="errorMessage"
            :message="errorMessage"
            class="mt-3"
          />

          <RecaptchaV2
            class="mt-6"
            @widget-id="handleWidgetId"
            @error-callback="handleErrorCallback"
            @expired-callback="handleExpiredCallback"
            @load-callback="handleLoadCallback"
          />

          <UiButton
            type="submit"
            size="lg"
            block
            raised
            radius="lg"
            :loading="loading"
            :disabled="disabled"
            class="mt-8"
          >
            Send Message
          </UiButton>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as Yup from 'yup'
import { useField, useForm } from 'vee-validate'
import { Phone, Sparkles } from '@lucide/vue'
import { RecaptchaV2, useRecaptcha } from 'vue3-recaptcha-v2'
import { apiClient } from '@/repository/api'

const { $toast } = useNuxtApp()
const { handleReset } = useRecaptcha()

const channels = [
  {
    icon: Phone,
    title: 'Sales & Enterprise Pricing',
    description: 'Custom SMS tiering, wholesale rates & financial institutions',
    email: 'info@multitexter.com',
  },
  {
    icon: Sparkles,
    title: 'API & Technical Support',
    description: 'REST API assistance, webhooks & deliverability tickets',
    email: 'support@multitexter.com',
  },
]

const schema = Yup.object().shape({
  fullname: Yup.string().required().label('FullName').trim(),
  email: Yup.string().required().label('Email').trim().email(),
  message: Yup.string().required().label('Message').trim(),
})
const { errors, handleSubmit, meta, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    fullname: '',
    email: '',
    message: '',
  },
})
const { value: fullname } = useField<string>('fullname')
const { value: email } = useField<string>('email')
const { value: message } = useField<string>('message')
const loading = ref(false)
const errorMessage = ref('')

const recaptchaWidgetId = ref<number | null>(null)
const recaptchaToken = ref('')

const disabled = computed(() => {
  return loading.value || !meta.value.valid || !recaptchaToken.value
})

const handleWidgetId = (widgetId: number) => {
  recaptchaWidgetId.value = widgetId
}
const handleErrorCallback = () => {
  recaptchaToken.value = ''
}
const handleExpiredCallback = () => {
  recaptchaToken.value = ''
}
const handleLoadCallback = (token: unknown) => {
  recaptchaToken.value = typeof token === 'string' ? token : ''
}
const resetRecaptcha = () => {
  recaptchaToken.value = ''
  if (recaptchaWidgetId.value !== null) handleReset(recaptchaWidgetId.value)
}

const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true
    errorMessage.value = ''
    const response = await apiClient.contact.sendFeedback({
      name: values.fullname,
      email: values.email,
      message: values.message,
      token: recaptchaToken.value,
    })
    if (response.status === 1) {
      $toast.success(
        response.msg ||
          'Your feedback has been sent, we will review your message and get back to you within 48 hours.',
      )
      resetForm()
      resetRecaptcha()
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
