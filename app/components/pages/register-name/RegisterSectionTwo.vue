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
          Before you apply
        </p>
        <h2
          v-motion-reveal
          :delay="100"
          class="mt-4 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl"
        >
          Make your sender name count.
        </h2>

        <div v-motion-slide-visible-once-bottom :delay="300" class="mt-8">
          <div
            class="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase"
          >
            Preview
          </div>
          <div
            class="bg-dark-blue relative mt-3 overflow-hidden rounded-3xl border border-white/10 p-5 text-white"
          >
            <div
              aria-hidden="true"
              class="bg-primary/25 pointer-events-none absolute -top-16 -right-16 size-48 rounded-full blur-3xl"
            />
            <div class="relative flex items-center gap-3">
              <span
                class="bg-primary/15 text-primary flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
              >
                {{ previewName.charAt(0) }}
              </span>
              <div class="min-w-0">
                <p class="truncate font-semibold tracking-wide">
                  {{ previewName }}
                </p>
                <p class="text-xs text-white/50">now</p>
              </div>
            </div>
            <p
              class="relative mt-4 rounded-2xl rounded-tl-md bg-white/10 px-4 py-3 text-sm leading-relaxed text-white/85"
            >
              Hi there! Your order has been confirmed. Thank you for shopping
              with us.
            </p>
          </div>
        </div>

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
          Not sure what to avoid? Read our
          <NuxtLink
            to="/caution-words"
            class="text-primary font-semibold hover:underline"
          >
            caution words
          </NuxtLink>
          before you submit.
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
          Sender Name Request
        </span>
        <h2
          v-motion-reveal
          :delay="300"
          class="mt-4 text-2xl font-semibold tracking-tight"
        >
          Register a sender name
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
                id="register-fullname"
                v-model="fullname"
                label="Full Name"
                name="fullname"
                autocomplete="name"
                placeholder="e.g. Babatunde Adeleke"
                :error="errors.fullname"
              />
              <UiInput
                id="register-email"
                v-model="companyEmail"
                label="Company Email"
                type="email"
                name="companyEmail"
                autocomplete="email"
                placeholder="babatunde@company.ng"
                :error="errors.companyEmail"
              />
            </div>
          </fieldset>

          <fieldset class="mt-10">
            <legend
              class="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase"
            >
              Your business
            </legend>
            <div class="mt-5 grid gap-6 sm:grid-cols-2">
              <UiInput
                id="register-business-name"
                v-model="businessName"
                label="Business Name"
                name="businessName"
                autocomplete="organization"
                placeholder="e.g. ABC Stores Ltd"
                :error="errors.businessName"
              />
              <UiInput
                id="register-cac"
                v-model="cacNumber"
                label="Registered CAC Number"
                name="cacNumber"
                placeholder="e.g. RC1234567"
                :error="errors.cacNumber"
              />
              <UiTextarea
                id="register-nature"
                v-model="businessNature"
                label="Nature of Business"
                name="businessNature"
                :rows="4"
                placeholder="What does your business do, and what will you send to customers?"
                :error="errors.businessNature"
                class="sm:col-span-2"
              />
            </div>
          </fieldset>

          <fieldset class="mt-10">
            <legend
              class="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase"
            >
              Sender name
            </legend>
            <UiInput
              id="register-sender-name"
              v-model="senderName"
              label="Preferred Sender Name"
              name="senderName"
              :maxlength="MAX_SENDER_LENGTH"
              placeholder="e.g. ABCSTORES"
              :hint="`${senderName.length}/${MAX_SENDER_LENGTH} characters, no spaces`"
              :error="errors.senderName"
              class="mt-5"
            >
              <template #leading>
                <MessageSquareText class="size-4" />
              </template>
            </UiInput>
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
            Submit Request
          </UiButton>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as Yup from 'yup'
import { useField, useForm } from 'vee-validate'
import { MessageSquareText } from '@lucide/vue'
import { RecaptchaV2, useRecaptcha } from 'vue3-recaptcha-v2'
import { apiClient } from '@/repository/api'

const { $toast } = useNuxtApp()
const { handleReset } = useRecaptcha()

const recaptchaWidgetId = ref<number | null>(null)
const recaptchaToken = ref('')

const MAX_SENDER_LENGTH = 11

const tips = [
  {
    title: 'Keep it short',
    description:
      'Sender names can be up to 11 characters. Join words together instead of using spaces.',
  },
  {
    title: 'Make it yours',
    description:
      'Use your brand name. Bank-related names and generic words like “School” or “Church” are not allowed.',
  },
  {
    title: 'Have your CAC number ready',
    description:
      'We need your registered CAC number to confirm the business behind the name.',
  },
]

const formatIndex = (index: number) => String(index + 1).padStart(2, '0')

const schema = Yup.object().shape({
  fullname: Yup.string().required().label('Full Name').trim(),
  companyEmail: Yup.string().required().label('Company Email').trim().email(),
  businessName: Yup.string().required().label('Business Name').trim(),
  cacNumber: Yup.string().required().label('CAC Number').trim(),
  businessNature: Yup.string().required().label('Nature of Business').trim(),
  senderName: Yup.string()
    .required()
    .label('Sender Name')
    .trim()
    .max(MAX_SENDER_LENGTH)
    .matches(/^\S+$/, 'Sender Name cannot contain spaces'),
})
const { errors, handleSubmit, meta, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    fullname: '',
    companyEmail: '',
    businessName: '',
    cacNumber: '',
    businessNature: '',
    senderName: '',
  },
})
const { value: fullname } = useField<string>('fullname')
const { value: companyEmail } = useField<string>('companyEmail')
const { value: businessName } = useField<string>('businessName')
const { value: cacNumber } = useField<string>('cacNumber')
const { value: businessNature } = useField<string>('businessNature')
const { value: senderName } = useField<string>('senderName')
const loading = ref(false)
const errorMessage = ref('')

const previewName = computed(() => senderName.value.trim() || 'YOURBRAND')

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
    const response = await apiClient.misc.senderNameRequest({
      fullname: values.fullname,
      company_email: values.companyEmail,
      bussiness_name: values.businessName,
      cac_number: values.cacNumber,
      bussiness_nature: values.businessNature,
      sender_name: values.senderName,
    })
    if (response.status === 1) {
      $toast.success(response.msg)
      resetForm()
      resetRecaptcha()
    } else {
      $toast.error(response.msg)
    }
  } catch (err) {
    errorMessage.value = formatErrorResponse(err)
  } finally {
    loading.value = false
  }
})
</script>
