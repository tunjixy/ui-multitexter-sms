<template>
  <form
    novalidate
    class="border-border bg-surface rounded-2xl border p-6 sm:p-8"
    @submit="onSubmit"
  >
    <p class="text-primary text-xs font-semibold tracking-wider uppercase">
      Step 2
    </p>
    <h2 class="mt-1 font-semibold">Tell us about your payment</h2>
    <p class="text-muted-foreground mt-1 text-sm">
      Once you've paid, send us these details so we can credit your account.
    </p>

    <div class="mt-6 grid gap-5 sm:grid-cols-2">
      <UiDatePicker
        v-model="paymentDate"
        name="paymentDate"
        label="Payment date"
        type="date"
        format="D MMM YYYY"
        value-type="YYYY-MM-DD"
        placeholder="Pick a date"
        :disabled-date="isFutureDate"
        :error="errors.paymentDate"
      />

      <UiInput
        ref="amountInput"
        :model-value="formattedAmount"
        name="amount"
        label="Amount paid"
        inputmode="numeric"
        placeholder="e.g. 10,000"
        :error="errors.amount"
        @keypress="isNumber"
        @update:model-value="onAmountInput"
      >
        <template #leading>
          <span class="text-sm">₦</span>
        </template>
      </UiInput>

      <UiInput
        v-model="depositor"
        name="depositor"
        label="Depositor's name"
        hint="As written on the deposit slip or transfer."
        :error="errors.depositor"
      />

      <UiInput
        v-model="phone"
        type="tel"
        name="phone"
        label="Phone number"
        inputmode="tel"
        autocomplete="tel"
        placeholder="e.g. 08012345678"
        :error="errors.phone"
      />

      <UiInput
        v-model="branch"
        name="branch"
        label="Bank / ATM branch"
        hint="For a transfer, enter the bank you paid from."
        :error="errors.branch"
      />

      <UiInput
        v-model="tellerNo"
        name="tellerNo"
        label="Teller number / reference"
        hint="The teller number, transaction ID or reference."
        spellcheck="false"
        :error="errors.tellerNo"
      />
    </div>

    <UiFileUpload
      v-model="receipt"
      name="receipt"
      label="Payment receipt (optional)"
      accept="image/*,application/pdf"
      placeholder="Choose a file"
      description="Image or PDF, up to 5MB"
      :disabled="loading"
      :error="errors.receipt"
      class="mt-5"
    />

    <UiFormError v-if="errorMessage" :message="errorMessage" />

    <div class="mt-6 flex justify-end">
      <UiButton type="submit" radius="lg" :loading="loading">
        Submit payment details
      </UiButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import * as Yup from 'yup'
import { useField, useForm } from 'vee-validate'
import { apiClient } from '@/repository/api'
import type { BankDepositReq } from '@/types/misc'

const MAX_RECEIPT_SIZE = 5 * 1024 * 1024

const { $toast } = useNuxtApp()

const today = new Date(new Date().setHours(0, 0, 0, 0))
const isFutureDate = (date: Date) => date > today

const isImageOrPdf = (file: File) =>
  file.type.startsWith('image/') || file.type === 'application/pdf'

const schema = Yup.object({
  paymentDate: Yup.string().required('Pick the date you paid'),
  amount: Yup.string()
    .required('Enter the amount you paid')
    .test('min', 'Enter an amount above ₦0', (value) => Number(value) > 0),
  depositor: Yup.string().trim().required("Enter the depositor's name"),
  phone: Yup.string()
    .trim()
    .required('Enter your phone number')
    .test(
      'phone',
      'Enter a valid phone number',
      (value) => !value || /^\+?\d{10,15}$/.test(value.replace(/[\s-]/g, '')),
    ),
  branch: Yup.string().trim().required('Enter the bank or ATM branch'),
  tellerNo: Yup.string()
    .trim()
    .required('Enter the teller number or reference'),
  receipt: Yup.mixed<File>()
    .nullable()
    .test('type', 'Choose an image or PDF', (value) =>
      value ? isImageOrPdf(value) : true,
    )
    .test('size', 'Choose a file smaller than 5MB', (value) =>
      value ? value.size <= MAX_RECEIPT_SIZE : true,
    ),
})

const { errors, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    paymentDate: '',
    amount: '',
    depositor: '',
    phone: '',
    branch: '',
    tellerNo: '',
    receipt: null as File | null,
  },
})
const { value: paymentDate } = useField<string>('paymentDate')
const { value: amount } = useField<string>('amount')
const { value: depositor } = useField<string>('depositor')
const { value: phone } = useField<string>('phone')
const { value: branch } = useField<string>('branch')
const { value: tellerNo } = useField<string>('tellerNo')
const { value: receipt } = useField<File | null>('receipt')
const loading = ref(false)
const errorMessage = ref('')

const amountInput = useTemplateRef<{ el: HTMLInputElement | null }>(
  'amountInput',
)

const formattedAmount = computed(() =>
  amount.value ? formatNumberWithComma(amount.value) : '',
)

const onAmountInput = () => {
  const input = amountInput.value?.el
  if (input) amount.value = formatNumberInput(input)
}

const onSubmit = handleSubmit(async (values) => {
  const body: BankDepositReq = {
    paymentdate: values.paymentDate,
    branch: values.branch.trim(),
    depositor: values.depositor.trim(),
    amount: values.amount,
    tellerno: values.tellerNo.trim(),
    payer_phone: values.phone.replace(/[\s-]/g, ''),
    receipt: values.receipt ?? undefined,
  }

  const formData = new FormData()
  for (const [key, value] of Object.entries(body)) {
    if (value) formData.append(key, value)
  }

  try {
    loading.value = true
    errorMessage.value = ''
    const response = await apiClient.misc.submitPaymentDetails(formData)
    if (response.status === 1) {
      $toast.success(response.msg || 'Your payment details have been sent.')
      resetForm()
    } else {
      errorMessage.value =
        response.msg ||
        "We couldn't send your payment details. Please try again."
    }
  } catch (err) {
    errorMessage.value = formatErrorResponse(err)
  } finally {
    loading.value = false
  }
})
</script>
