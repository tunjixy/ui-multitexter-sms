<template>
  <section class="py-16 lg:py-24">
    <div
      class="wrapper grid items-start gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16"
    >
      <div class="lg:sticky lg:top-32">
        <p
          class="text-primary text-xs font-semibold tracking-[0.25em] uppercase"
        >
          What we can help with
        </p>
        <h2
          class="mt-4 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl"
        >
          Messaging built around your business.
        </h2>
        <p class="text-muted-foreground mt-5 leading-relaxed">
          Tell us about your traffic and our sales team will recommend the right
          setup and pricing.
        </p>

        <ul class="mt-10 space-y-6">
          <li
            v-for="solution in solutions"
            :key="solution.title"
            class="flex gap-4"
          >
            <span
              class="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl"
            >
              <component :is="solution.icon" class="size-5" />
            </span>
            <div class="min-w-0">
              <h3 class="text-base font-semibold">{{ solution.title }}</h3>
              <p class="text-muted-foreground mt-1 text-sm leading-relaxed">
                {{ solution.description }}
              </p>
            </div>
          </li>
        </ul>

        <p
          class="border-border text-muted-foreground mt-10 border-t pt-6 text-sm"
        >
          Prefer email? Reach our sales team at
          <a
            href="mailto:info@multitexter.com"
            class="text-primary font-semibold break-all hover:underline"
          >
            info@multitexter.com
          </a>
        </p>
      </div>

      <div class="bg-surface border-border rounded-3xl border p-6 sm:p-10">
        <span
          class="bg-primary/10 text-primary border-primary/30 inline-block rounded-full border px-3 py-1 text-xs font-medium"
        >
          Sales Enquiry
        </span>
        <h2 class="mt-4 text-2xl font-semibold tracking-tight">
          Tell us about your business
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
                id="sales-name"
                v-model="name"
                label="Full Name"
                name="name"
                autocomplete="name"
                placeholder="e.g. Babatunde Adeleke"
                :error="errors.name"
                class="sm:col-span-2"
              />
              <UiInput
                id="sales-email"
                v-model="email"
                label="Email"
                type="email"
                name="email"
                autocomplete="email"
                placeholder="babatunde@company.ng"
                :error="errors.email"
              />
              <UiInput
                id="sales-phone"
                v-model="phoneNumber"
                label="Phone Number"
                type="tel"
                name="phoneNumber"
                autocomplete="tel"
                placeholder="e.g. 08012345678"
                :error="errors.phoneNumber"
              />
              <UiInput
                id="sales-company"
                v-model="companyName"
                label="Company Name"
                name="companyName"
                autocomplete="organization"
                placeholder="e.g. Adeleke Logistics Ltd"
                :error="errors.companyName"
              />
              <UiSelect
                id="sales-role"
                v-model="role"
                label="Job Role"
                name="role"
                placeholder="Select a role"
                :options="toOptions(roles)"
                :error="errors.role"
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
              <UiSelect
                id="sales-employees"
                v-model="noOfEmployees"
                label="Number of Employees"
                name="noOfEmployees"
                placeholder="Select a range"
                :options="toOptions(employeesRange)"
                :error="errors.noOfEmployees"
              />
              <UiSelect
                id="sales-country"
                v-model="country"
                label="Country"
                name="country"
                placeholder="Choose country"
                search-placeholder="Search countries…"
                searchable
                :options="toOptions(countries)"
                :error="errors.country"
              />
            </div>

            <fieldset class="mt-6">
              <legend class="text-sm font-semibold">Services Requested</legend>
              <div class="mt-2 flex flex-wrap gap-2">
                <label v-for="option in services" :key="option" :class="chip">
                  <input
                    v-model="service"
                    type="checkbox"
                    name="service"
                    :value="option"
                    class="sr-only"
                  />
                  <Check
                    class="hidden size-3.5 group-has-checked:block"
                    :stroke-width="3"
                  />
                  {{ option }}
                </label>
              </div>
              <p
                v-if="errors.service"
                class="mt-1 text-sm text-red-600 dark:text-red-400"
                role="alert"
              >
                {{ errors.service }}
              </p>
            </fieldset>

            <fieldset class="mt-6">
              <legend class="text-sm font-semibold">
                Monthly Average Volume to Switch
              </legend>
              <div class="mt-2 flex flex-wrap gap-2">
                <label v-for="option in volumes" :key="option" :class="chip">
                  <input
                    v-model="volume"
                    type="radio"
                    name="volume"
                    :value="option"
                    class="sr-only"
                  />
                  {{ option }}
                </label>
              </div>
              <p
                v-if="errors.volume"
                class="mt-1 text-sm text-red-600 dark:text-red-400"
                role="alert"
              >
                {{ errors.volume }}
              </p>
            </fieldset>
          </fieldset>

          <fieldset class="mt-10">
            <legend
              class="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase"
            >
              Anything else
            </legend>
            <UiTextarea
              id="sales-other-request"
              v-model="otherRequest"
              label="Other Requests"
              name="otherRequest"
              :rows="4"
              placeholder="Anything else we should know about your messaging needs?"
              :error="errors.otherRequest"
              class="mt-5"
            />
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
            {{ loading ? '' : 'Submit' }}
          </UiButton>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as Yup from 'yup'
import { useField, useForm } from 'vee-validate'
import { BellRing, Check, KeyRound, Landmark } from '@lucide/vue'
import { RecaptchaV2, useRecaptcha } from 'vue3-recaptcha-v2'
import { apiClient } from '@/repository/api'

const { $toast } = useNuxtApp()
const { handleReset } = useRecaptcha()

const solutions = [
  {
    icon: KeyRound,
    title: 'One-Time Passwords',
    description:
      'Verification codes for sign-ups, logins and payment confirmation.',
  },
  {
    icon: Landmark,
    title: 'Bank Traffic',
    description:
      'Transaction alerts and account updates for banks and financial institutions.',
  },
  {
    icon: BellRing,
    title: 'Notifications',
    description:
      'Order updates, reminders and alerts that keep your customers informed.',
  },
]

const roles = [
  'CTO - Chief Technology Officer',
  'CEO - Chief Executive Officer',
  'CIO - Chief Information Officer',
]
const employeesRange = ['1 - 10', '11 - 50', '51 - 100', '100+']
const services = ['OTP - One Time Password', 'Bank Traffic', 'Notification']
const volumes = ['<10K', '10K-100K', '100K-500K', '500K-1M', '1M+', 'Not sure']

const toOptions = (values: string[]) =>
  values.map((value) => ({ value, label: value }))

const chip =
  'group border-border text-muted-foreground not-has-checked:hover:border-muted-foreground has-checked:border-primary has-checked:bg-primary/10 has-checked:text-primary has-focus-visible:ring-primary/35 inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-[background-color,border-color,color,box-shadow] select-none has-focus-visible:ring-3'

const schema = Yup.object().shape({
  name: Yup.string().required().label('Full Name').trim(),
  email: Yup.string().required().label('Email').trim().email(),
  phoneNumber: Yup.string().required().label('Phone Number').trim(),
  companyName: Yup.string().required().label('Company Name').trim(),
  role: Yup.string().required().label('Job Role').trim(),
  noOfEmployees: Yup.string().required().label('Number of Employees').trim(),
  service: Yup.array()
    .of(Yup.string().required())
    .min(1, 'Select at least one service')
    .label('Services Requested'),
  country: Yup.string().required().label('Country').trim(),
  volume: Yup.string().required('Select a monthly volume').trim(),
  otherRequest: Yup.string().required().label('Other Requests').trim(),
})
const { errors, handleSubmit, meta, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    name: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    role: '',
    noOfEmployees: '',
    service: [],
    country: 'Nigeria',
    volume: '',
    otherRequest: '',
  },
})
const { value: name } = useField<string>('name')
const { value: email } = useField<string>('email')
const { value: phoneNumber } = useField<string>('phoneNumber')
const { value: companyName } = useField<string>('companyName')
const { value: role } = useField<string>('role')
const { value: noOfEmployees } = useField<string>('noOfEmployees')
const { value: service } = useField<string[]>('service')
const { value: country } = useField<string>('country')
const { value: volume } = useField<string>('volume')
const { value: otherRequest } = useField<string>('otherRequest')
const loading = ref(false)
const errorMessage = ref('')
const emailsToDeliverTo = ['kunle@lordni.com', 'tayo.ojo@fullware.group']

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
    const response = await apiClient.contact.contactSales({
      name: values.name,
      email: values.email,
      mobile: values.phoneNumber,
      company_name: values.companyName,
      title: values.role,
      employees: values.noOfEmployees,
      services: values.service.toString(),
      volume: values.volume,
      country: values.country,
      requests: values.otherRequest,
      source: 'Multitexter.com',
      salesmail: emailsToDeliverTo,
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
