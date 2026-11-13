<template>
  <form
    novalidate
    class="border-border bg-surface max-w-2xl rounded-2xl border p-6 sm:p-8"
    @submit="onSubmit"
  >
    <div class="space-y-5">
      <UiInput
        v-model="email"
        type="email"
        name="email"
        label="Recipient's email"
        placeholder="name@example.com"
        spellcheck="false"
        hint="The email address they use to log in to Multitexter."
        :error="errors.email"
      >
        <template #leading>
          <MailIcon class="size-4" />
        </template>
      </UiInput>

      <UiInput
        ref="unitsInput"
        :model-value="formattedUnits"
        name="units"
        label="Units to share"
        inputmode="numeric"
        placeholder="e.g. 1,000"
        :error="errors.units"
        @keypress="isNumber"
        @update:model-value="onUnitsInput"
      >
        <template #leading>
          <CoinsIcon class="size-4" />
        </template>
      </UiInput>
    </div>

    <div
      class="border-border divide-border bg-background/40 mt-6 divide-y rounded-xl border px-4 text-sm"
    >
      <div class="flex items-center justify-between gap-4 py-3">
        <dt class="text-muted-foreground">Current balance</dt>
        <dd class="font-medium tabular-nums">
          <UiSkeleton v-if="!userDetail" class="h-4 w-16 rounded" />
          <template v-else>{{ formatNumberWithComma(balance) }}</template>
        </dd>
      </div>
      <div class="flex items-center justify-between gap-4 py-3">
        <dt class="text-muted-foreground">Balance after sharing</dt>
        <dd
          aria-live="polite"
          :class="[
            'font-semibold tabular-nums',
            remaining < 0 && 'text-red-600 dark:text-red-400',
          ]"
        >
          <UiSkeleton v-if="!userDetail" class="h-4 w-16 rounded" />
          <template v-else>{{ formatNumberWithComma(remaining) }}</template>
        </dd>
      </div>
    </div>

    <UiFormError v-if="errorMessage" :message="errorMessage" />

    <div class="mt-6 flex justify-end">
      <UiButton type="submit" radius="lg" :loading="loading">
        Share units
      </UiButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import * as Yup from 'yup'
import { useField, useForm } from 'vee-validate'
import { CoinsIcon, MailIcon } from '@lucide/vue'
import { apiClient } from '@/repository/api'

const { $toast } = useNuxtApp()
const { userDetail } = storeToRefs(useUserStore())
const { fetchUserDetails } = useAuth()
const { fetchSharedUnits } = useSharedUnits()

const balance = computed(() => parseNumber(userDetail.value?.balance ?? 0))

const schema = Yup.object({
  email: Yup.string()
    .trim()
    .required("Enter the recipient's email")
    .email('Enter a valid email address')
    .test(
      'not-self',
      "You can't share units with your own account",
      (value) => value?.toLowerCase() !== userDetail.value?.email.toLowerCase(),
    ),
  units: Yup.string()
    .required('Enter how many units to share')
    .test('min', 'Share at least 1 unit', (value) => Number(value) > 0)
    .test(
      'balance',
      () => `You only have ${formatNumberWithComma(balance.value)} units`,
      (value) => !userDetail.value || Number(value) <= balance.value,
    ),
})

const { errors, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    email: '',
    units: '',
  },
})
const { value: email } = useField<string>('email')
const { value: units } = useField<string>('units')
const loading = ref(false)
const errorMessage = ref('')

const unitsInput = useTemplateRef<{ el: HTMLInputElement | null }>('unitsInput')

const formattedUnits = computed(() =>
  units.value ? formatNumberWithComma(units.value) : '',
)

const remaining = computed(
  () => Math.round((balance.value - (Number(units.value) || 0)) * 100) / 100,
)

const onUnitsInput = () => {
  const input = unitsInput.value?.el
  if (input) units.value = formatNumberInput(input)
}

const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true
    errorMessage.value = ''
    const response = await apiClient.share.transferUnit({
      to: values.email.trim(),
      numberOfUnit: Number(values.units),
    })
    if (response.status === 1) {
      $toast.success(response.msg || 'Your units have been shared.')
      resetForm()
      fetchSharedUnits()
      fetchUserDetails()
    } else {
      errorMessage.value =
        response.msg || "We couldn't share your units. Please try again."
    }
  } catch (err) {
    errorMessage.value = formatErrorResponse(err)
  } finally {
    loading.value = false
  }
})
</script>
