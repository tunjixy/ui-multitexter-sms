<template>
  <UiModal
    v-model:open="open"
    title="Edit alert settings"
    description="Choose when we warn you about a low balance, and who we notify."
    :close-on-backdrop="!loading"
    :close-on-esc="!loading"
  >
    <form
      :id="formId"
      novalidate
      class="divide-border divide-y"
      @submit="onSubmit"
    >
      <div class="py-5 first:pt-0">
        <UiInput
          v-model="balanceThreshold"
          type="number"
          name="balanceThreshold"
          label="Low balance threshold"
          inputmode="numeric"
          min="1"
          step="1"
          hint="We'll alert you when your balance drops below this."
          :error="errors.balanceThreshold"
        >
          <template #trailing>units</template>
        </UiInput>
      </div>

      <div class="py-5">
        <p class="text-sm font-semibold">SMS alerts</p>
        <div class="mt-3 grid gap-4 sm:grid-cols-[9rem_1fr]">
          <UiInput
            v-model="smsFrequency"
            type="number"
            name="smsFrequency"
            label="Repeat every"
            inputmode="numeric"
            min="1"
            step="1"
            :error="errors.smsFrequency"
          >
            <template #trailing>days</template>
          </UiInput>
          <UiInput
            v-model="smsTo"
            type="tel"
            name="smsTo"
            label="Phone number"
            placeholder="08012345678"
            :error="errors.smsTo"
          />
        </div>
      </div>

      <div class="py-5 last:pb-0">
        <p class="text-sm font-semibold">Email alerts</p>
        <div class="mt-3 grid gap-4 sm:grid-cols-[9rem_1fr]">
          <UiInput
            v-model="emailFrequency"
            type="number"
            name="emailFrequency"
            label="Repeat every"
            inputmode="numeric"
            min="1"
            step="1"
            :error="errors.emailFrequency"
          >
            <template #trailing>days</template>
          </UiInput>
          <UiInput
            v-model="emailTo"
            type="email"
            name="emailTo"
            label="Email address"
            placeholder="you@company.com"
            autocomplete="off"
            :error="errors.emailTo"
          />
        </div>
      </div>
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
        {{ loading ? '' : ' Save changes' }}
      </UiButton>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import * as Yup from 'yup'
import { useField, useForm } from 'vee-validate'
import { apiClient } from '@/repository/api'
import type { Alert } from '@/types/alert'

const props = defineProps<{
  alert: Alert
}>()

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  updated: [alert: Alert]
}>()

const { $toast } = useNuxtApp()
const formId = useId()

const days = Yup.number()
  .typeError('Enter a number of days')
  .required('Enter a number of days')
  .integer('Use whole days')
  .min(1, 'Must be at least 1 day')

const schema = Yup.object({
  balanceThreshold: Yup.number()
    .typeError('Enter a threshold')
    .required('Enter a threshold')
    .integer('Use whole units')
    .min(1, 'Must be at least 1 unit'),
  smsFrequency: days,
  smsTo: Yup.string()
    .trim()
    .required('Enter a phone number')
    .test(
      'phone',
      'Enter a valid phone number',
      (value) => !value || /^\+?\d{10,15}$/.test(value.replace(/[\s-]/g, '')),
    ),
  emailFrequency: days,
  emailTo: Yup.string()
    .trim()
    .required('Enter an email address')
    .email('Enter a valid email address'),
})

const toValues = (alert: Alert) => ({
  balanceThreshold: alert.low_balance_threshold,
  smsFrequency: alert.sms_frequency,
  smsTo: alert.sms_to ?? '',
  emailFrequency: alert.email_frequency,
  emailTo: alert.email_to ?? '',
})

const { errors, handleSubmit, meta, resetForm } = useForm({
  validationSchema: schema,
  initialValues: toValues(props.alert),
})
const { value: balanceThreshold } = useField<number | null>('balanceThreshold')
const { value: smsFrequency } = useField<number | null>('smsFrequency')
const { value: smsTo } = useField<string>('smsTo')
const { value: emailFrequency } = useField<number | null>('emailFrequency')
const { value: emailTo } = useField<string>('emailTo')
const loading = ref(false)
const errorMessage = ref('')

const disabled = computed(
  () => loading.value || !meta.value.dirty || !meta.value.valid,
)

watch(open, (isOpen) => {
  if (!isOpen) return
  errorMessage.value = ''
  resetForm({ values: toValues(props.alert) })
})

const onSubmit = handleSubmit(async (values) => {
  const updated: Alert = {
    ...props.alert,
    low_balance_threshold: values.balanceThreshold,
    sms_frequency: values.smsFrequency,
    sms_to: values.smsTo.trim(),
    email_frequency: values.emailFrequency,
    email_to: values.emailTo.trim(),
  }

  try {
    loading.value = true
    errorMessage.value = ''
    const response = await apiClient.alert.editAlert({
      sms_frequency: updated.sms_frequency,
      sms_recipients: updated.sms_to,
      email_frequency: updated.email_frequency,
      email_recipients: updated.email_to,
      balance_threshold: updated.low_balance_threshold,
    })
    if (response.status === 1) {
      emit('updated', updated)
      $toast.success(response.msg || 'Your alert settings have been saved.')
      open.value = false
    } else {
      errorMessage.value =
        response.msg ||
        "We couldn't save your alert settings. Please try again."
    }
  } catch (err) {
    errorMessage.value = formatErrorResponse(err)
  } finally {
    loading.value = false
  }
})
</script>
