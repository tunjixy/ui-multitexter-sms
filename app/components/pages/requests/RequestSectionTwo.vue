<template>
  <section class="py-16 lg:py-24">
    <div
      class="wrapper grid items-start gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16"
    >
      <div class="lg:sticky lg:top-32">
        <p
          v-motion-fade-visible-once
          class="text-primary text-xs font-semibold tracking-[0.25em] uppercase"
        >
          Before you submit
        </p>
        <h2
          v-motion-reveal
          :delay="100"
          class="mt-4 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl"
        >
          What to include in your request.
        </h2>
        <p
          v-motion-fade-visible-once
          :delay="300"
          class="text-muted-foreground mt-5 leading-relaxed"
        >
          The more detail you share, the faster we can scope your integration.
        </p>

        <ol class="mt-10 space-y-6">
          <li
            v-for="(tip, index) in tips"
            :key="tip.title"
            v-motion-slide-visible-once-bottom
            :delay="index * 100"
            class="flex gap-4"
          >
            <span
              class="border-border bg-surface text-primary flex size-8 shrink-0 items-center justify-center rounded-lg border text-xs font-semibold tabular-nums"
            >
              {{ formatIndex(index) }}
            </span>
            <div class="min-w-0">
              <h3 class="text-base font-semibold">{{ tip.title }}</h3>
              <p class="text-muted-foreground mt-1 text-sm leading-relaxed">
                {{ tip.description }}
              </p>
            </div>
          </li>
        </ol>

        <p
          v-motion-fade-visible-once
          :delay="300"
          class="border-border text-muted-foreground mt-10 border-t pt-6 text-sm"
        >
          Prefer email? Reach our technical team at
          <a
            href="mailto:support@multitexter.com"
            class="text-primary font-semibold break-all hover:underline"
          >
            support@multitexter.com
          </a>
        </p>
      </div>

      <div
        v-motion-slide-visible-once-bottom
        :delay="200"
        class="bg-surface border-border rounded-3xl border p-6 sm:p-10"
      >
        <span
          class="bg-primary/10 text-primary border-primary/30 inline-block rounded-full border px-3 py-1 text-xs font-medium"
        >
          New Request
        </span>
        <h2
          v-motion-reveal
          :delay="300"
          class="mt-4 text-2xl font-semibold tracking-tight"
        >
          Submit an integration request
        </h2>
        <p class="text-muted-foreground mt-2 text-sm">
          All fields are required.
        </p>

        <form
          class="border-border mt-8 border-t pt-8"
          novalidate
          @submit.prevent="onSubmit"
        >
          <fieldset>
            <legend
              class="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase"
            >
              Your details
            </legend>
            <div class="mt-5 grid gap-6 sm:grid-cols-2">
              <UiInput
                id="request-fullname"
                v-model="fullname"
                label="Full Name"
                name="fullname"
                autocomplete="name"
                placeholder="e.g. Babatunde Adeleke"
                :error="errors.fullname"
                class="sm:col-span-2"
              />
              <UiInput
                id="request-email"
                v-model="email"
                label="Email"
                type="email"
                name="email"
                autocomplete="email"
                placeholder="babatunde@company.ng"
                :error="errors.email"
              />
              <UiInput
                id="request-phone"
                v-model="phoneNumber"
                label="Phone Number"
                type="tel"
                name="phoneNumber"
                autocomplete="tel"
                placeholder="e.g. 08012345678"
                :error="errors.phoneNumber"
              />
            </div>
          </fieldset>

          <fieldset class="mt-10">
            <legend
              class="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase"
            >
              Your request
            </legend>
            <div class="mt-5 grid gap-6 sm:grid-cols-2">
              <UiInput
                id="request-name"
                v-model="requestName"
                label="Request Name"
                name="requestName"
                placeholder="e.g. WooCommerce order alerts"
                :error="errors.requestName"
                class="sm:col-span-2"
              />
              <UiTextarea
                id="request-description"
                v-model="requestDescription"
                label="Request Description"
                name="requestDescription"
                :rows="5"
                placeholder="What should the integration do, and when should messages be sent?"
                :error="errors.requestDescription"
                class="sm:col-span-2"
              />
              <UiInput
                id="request-framework"
                v-model="framework"
                label="Programming Language/Framework"
                name="framework"
                placeholder="e.g. Laravel, Django, Node.js"
                :error="errors.framework"
              />
              <UiInput
                id="request-amount"
                ref="amountInput"
                :model-value="formattedAmount"
                label="Amount Willing to Pay"
                name="amountToPay"
                inputmode="numeric"
                placeholder="e.g. 150,000"
                :error="errors.amountToPay"
                @keypress="isNumber"
                @update:model-value="onAmountInput"
              >
                <template #leading>
                  <span class="text-sm font-medium" aria-hidden="true">₦</span>
                </template>
              </UiInput>
            </div>
          </fieldset>

          <UiFormError
            v-if="errorMessage"
            :message="errorMessage"
            class="mt-3"
          />

          <RecaptchaV2
            class="mt-10"
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
            {{ loading ? '' : 'Submit Request' }}
          </UiButton>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as Yup from 'yup'
import { useField, useForm } from 'vee-validate'
import { RecaptchaV2, useRecaptcha } from 'vue3-recaptcha-v2'
import { apiClient } from '@/repository/api'

const { $toast } = useNuxtApp()
const { handleReset } = useRecaptcha()

const recaptchaWidgetId = ref<number | null>(null)
const recaptchaToken = ref('')

const tips = [
  {
    title: 'A clear request name',
    description:
      'A short title, like “WooCommerce order alerts” or “OTP for app login”.',
  },
  {
    title: 'What it should do',
    description:
      'What triggers a message, who receives it and what it should say.',
  },
  {
    title: 'Your stack',
    description:
      'The language or framework your system runs on, so we can plan the work.',
  },
  {
    title: 'Your budget',
    description:
      'The amount you are willing to pay helps us scope the integration.',
  },
]

const schema = Yup.object().shape({
  fullname: Yup.string().required().label('Full Name').trim(),
  email: Yup.string().required().label('Email').trim().email(),
  phoneNumber: Yup.string().required().label('Phone Number').trim(),
  requestName: Yup.string().required().label('Request Name').trim(),
  requestDescription: Yup.string()
    .required()
    .label('Request Description')
    .trim(),
  framework: Yup.string()
    .required()
    .label('Programming Language/Framework')
    .trim(),
  amountToPay: Yup.string().required().label('Amount').trim(),
})
const { errors, handleSubmit, meta, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    fullname: '',
    email: '',
    phoneNumber: '',
    requestName: '',
    requestDescription: '',
    framework: '',
    amountToPay: '',
  },
})
const { value: fullname } = useField<string>('fullname')
const { value: email } = useField<string>('email')
const { value: phoneNumber } = useField<string>('phoneNumber')
const { value: requestName } = useField<string>('requestName')
const { value: requestDescription } = useField<string>('requestDescription')
const { value: framework } = useField<string>('framework')
const { value: amountToPay } = useField<string>('amountToPay')
const loading = ref(false)
const errorMessage = ref('')

const amountInput = useTemplateRef<{ el: HTMLInputElement | null }>(
  'amountInput',
)

const disabled = computed(() => {
  return loading.value || !meta.value.valid || !recaptchaToken.value
})

const formattedAmount = computed(() =>
  amountToPay.value ? formatNumberWithComma(amountToPay.value) : '',
)

const formatIndex = (index: number) => String(index + 1).padStart(2, '0')

const onAmountInput = () => {
  const input = amountInput.value?.el
  if (input) amountToPay.value = formatNumberInput(input)
}

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
    const response = await apiClient.contact.integrationRequest({
      name: values.fullname,
      email: values.email,
      mobile: values.phoneNumber,
      service: values.requestName,
      description: values.requestDescription,
      language: values.framework,
      amount: values.amountToPay,
    })
    if (response.status === 1) {
      $toast.success(response.msg)
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
