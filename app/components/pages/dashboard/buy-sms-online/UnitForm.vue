<template>
  <form
    novalidate
    class="border-border bg-surface rounded-2xl border p-6 sm:p-8"
    @submit="onSubmit"
  >
    <h2 class="font-semibold">Online payment</h2>
    <p class="text-muted-foreground mt-1 text-sm">
      Recharge your account online. Your units are credited as soon as your
      payment goes through.
    </p>

    <div class="mt-6 grid gap-5 sm:grid-cols-2">
      <UiInput
        ref="unitsInput"
        :model-value="formattedUnits"
        name="units"
        label="Number of units"
        inputmode="numeric"
        placeholder="e.g. 1,000"
        hint="Minimum payment is ₦1,000 for 500 units."
        :error="errors.units || quoteError"
        @keypress="isNumber"
        @update:model-value="onUnitsInput"
      >
        <template #leading>
          <CoinsIcon class="size-4" />
        </template>
      </UiInput>

      <UiSelect
        v-model="gateway"
        name="paymentGateway"
        label="Payment type"
        :options="gateways"
      />
    </div>

    <div
      class="border-border divide-border bg-background/40 mt-6 divide-y rounded-xl border px-4 text-sm"
    >
      <div
        v-for="row in breakdown"
        :key="row.label"
        class="flex items-center justify-between gap-4 py-3"
      >
        <dt class="text-muted-foreground">{{ row.label }}</dt>
        <dd class="font-medium tabular-nums">
          <UiSkeleton v-if="quoting" class="h-4 w-16 rounded" />
          <template v-else>{{ row.value }}</template>
        </dd>
      </div>
      <div class="flex items-center justify-between gap-4 py-3">
        <div class="font-semibold">Total payment</div>
        <div class="text-base font-semibold tabular-nums" aria-live="polite">
          <UiSkeleton v-if="quoting" class="h-5 w-20 rounded" />
          <template v-else>
            {{ quote ? formatNaira(quote.total) : '—' }}
          </template>
        </div>
      </div>
    </div>

    <UiFormError v-if="errorMessage" :message="errorMessage" />

    <div
      class="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <p class="text-muted-foreground flex items-center gap-2 text-sm">
        <LockIcon class="size-4 shrink-0" />
        You'll complete your payment securely on {{ gatewayLabel }}.
      </p>
      <UiButton
        type="submit"
        radius="lg"
        class="w-full sm:w-auto"
        :loading="loading"
        :disabled="quoting"
      >
        {{ quote ? `Pay ${formatNaira(quote.total)}` : 'Continue to payment' }}
      </UiButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import * as Yup from 'yup'
import { useField, useForm } from 'vee-validate'
import { CoinsIcon, LockIcon } from '@lucide/vue'
import { apiClient } from '@/repository/api'
import type { SelectOption } from '@/components/ui/UiSelect.vue'
import type { PaymentGateway, UnitPrice } from '@/types/payment'

const gateways: SelectOption[] = [
  { value: 'Paystack', label: 'Paystack' },
  {
    value: 'flutterwave',
    label: 'Flutterwave',
  },
]

const schema = Yup.object({
  units: Yup.string()
    .required('Enter how many units to buy')
    .test('min', 'Minimum unit is 500', (value) => Number(value) > 499),
})

const { errors, handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: {
    units: '',
  },
})
const { value: units } = useField<string>('units')
const gateway = ref<PaymentGateway>('Paystack')
const loading = ref(false)
const errorMessage = ref('')

const quote = ref<UnitPrice | null>(null)
const quoting = ref(false)
const quoteError = ref('')

const unitsInput = useTemplateRef<{ el: HTMLInputElement | null }>('unitsInput')

const formattedUnits = computed(() =>
  units.value ? formatNumberWithComma(units.value) : '',
)

const gatewayLabel = computed(
  () => gateways.find((option) => option.value === gateway.value)?.label,
)

const breakdown = computed(() => [
  {
    label: 'Unit price',
    value: quote.value ? formatNaira(quote.value.price, { fixed: true }) : '—',
  },
  {
    label: 'Amount to pay',
    value: quote.value ? formatNaira(quote.value.amountdue) : '—',
  },
  {
    label: 'Transaction fee',
    value: quote.value ? formatNaira(quote.value.charges) : '—',
  },
])

const onUnitsInput = () => {
  const input = unitsInput.value?.el
  if (input) units.value = formatNumberInput(input)
}

const fetchQuote = async () => {
  quote.value = null
  quoteError.value = ''
  errorMessage.value = ''
  if (!Number(units.value)) return
  try {
    quoting.value = true
    const response = await apiClient.payment.calculateUnitPrice({
      unit: Number(units.value),
      paymentGateway: gateway.value,
    })
    if (response.status === 1) {
      const { price, amountdue, charges, total } = response.data
      quote.value = {
        price: Number(price),
        amountdue: Number(amountdue),
        charges: Number(charges),
        total: Number(total),
      }
    } else {
      quoteError.value =
        response.msg || "We couldn't work out the price. Please try again."
    }
  } catch (err) {
    quoteError.value = formatErrorResponse(err)
  } finally {
    quoting.value = false
  }
}

watchDebounced([units, gateway], fetchQuote, { debounce: 1000, maxWait: 5000 })

const setUnits = (value: number) => {
  units.value = String(value)
  const input = unitsInput.value?.el
  if (!input) return
  input.focus({ preventScroll: true })
  input.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
}

const onSubmit = handleSubmit(async (values) => {
  if (quoteError.value) {
    unitsInput.value?.el?.focus()
    return
  }
  try {
    loading.value = true
    errorMessage.value = ''
    const response = await apiClient.payment.purchaseUnit({
      unit: Number(values.units),
      paymentGateway: gateway.value,
    })
    if (response.status === 1 && response.url) {
      await navigateTo(response.url, { external: true })
      return
    }
    errorMessage.value =
      response.msg || "We couldn't start your payment. Please try again."
  } catch (err) {
    errorMessage.value = formatErrorResponse(err)
  } finally {
    loading.value = false
  }
})

defineExpose({ setUnits })
</script>
