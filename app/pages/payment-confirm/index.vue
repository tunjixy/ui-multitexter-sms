<template>
  <section class="relative isolate flex min-h-dvh items-center overflow-hidden">
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--color-muted-foreground)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_center,black,transparent_70%)] bg-size-[24px_24px] opacity-25"
    />
    <div
      aria-hidden="true"
      class="bg-primary/15 pointer-events-none absolute top-1/2 left-1/2 -z-10 size-144 -translate-1/2 rounded-full blur-3xl"
    />

    <div class="wrapper py-16">
      <PaymentStatus
        :status="status"
        :provider="provider"
        :reference="reference"
        :message="message"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { apiClient } from '@/repository/api'
import type { PaymentStatusState } from '@/types/payment'

const route = useRoute()
const { $toast } = useNuxtApp()

const status = ref<PaymentStatusState>('verifying')
const message = ref('')
const redirectTo = ref('/dashboard/buy-sms-online')

const reference = computed(() => {
  const { trxref, transid } = route.query
  if (typeof trxref === 'string') return trxref
  if (typeof transid === 'string') return transid
  return ''
})

const provider = computed(() =>
  typeof route.query.trxref === 'string' ? 'Paystack' : '',
)

const { start: redirect } = useTimeoutFn(
  () => navigateTo(redirectTo.value),
  1500,
  { immediate: false },
)

const finish = (state: PaymentStatusState, text: string, to: string) => {
  status.value = state
  message.value = text
  redirectTo.value = to
  redirect()
}

onMounted(async () => {
  try {
    const response = await apiClient.payment.verify({
      transid: reference.value,
    })
    if (response.status === 1) {
      $toast.success(response.msg)
      finish('success', response.msg, '/dashboard/compose-sms')
    } else {
      $toast.error(response.msg)
      finish('error', response.msg, '/dashboard/buy-sms-online')
    }
  } catch (err) {
    const text = formatErrorResponse(err)
    $toast.error(text)
    finish('error', text, '/dashboard/buy-sms-online')
  }
})

definePageMeta({
  layout: 'secondary',
  middleware: 'auth',
})

useHead({
  title: 'Payment Confirmation',
})
</script>
