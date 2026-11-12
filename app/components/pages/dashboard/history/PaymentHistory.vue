<template>
  <section>
    <p class="text-muted-foreground text-sm">
      Online payments you've made to buy units.
    </p>

    <div class="mt-4">
      <div v-if="loading" class="space-y-3">
        <UiSkeleton v-for="n in 5" :key="n" class="h-12 w-full rounded-lg" />
      </div>

      <UiErrorState v-else-if="error" @try-again="fetchPaymentHistory" />

      <EmptyState
        v-else-if="!rows.length"
        :icon="CreditCard"
        title="No payments yet"
        description="Payments you make to buy units online will show up here."
      />

      <div v-else class="border-border overflow-hidden rounded-lg border">
        <UiTable>
          <TableHeader>
            <TableRow>
              <TableHead v-for="heading in headings" :key="heading">
                {{ heading }}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(payment, index) in rows" :key="index">
              <TableCell class="text-muted-foreground w-12">
                {{ index + 1 }}.
              </TableCell>
              <TableCell>
                {{ payment.paidAt.date }}
                <span
                  v-if="payment.paidAt.time"
                  class="text-muted-foreground block text-xs"
                >
                  {{ payment.paidAt.time }}
                </span>
              </TableCell>
              <TableCell class="text-muted-foreground font-mono text-xs">
                {{ payment.transid }}
              </TableCell>
              <TableCell class="font-medium">{{ payment.amount }}</TableCell>
              <TableCell>{{ formatNumberWithComma(payment.units) }}</TableCell>
              <TableCell>
                <span
                  :class="[
                    'inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold',
                    payment.state.tone,
                  ]"
                >
                  {{ payment.state.label }}
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </UiTable>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { CreditCard } from '@lucide/vue'
import type { PaymentHistory } from '@/types/history'
import { apiClient } from '@/repository/api'

const headings = ['', 'Date', 'Transaction ID', 'Amount', 'Units', 'Status']
const payments = ref<PaymentHistory[] | null>(null)
const loading = ref(true)
const error = ref(false)

const statuses = {
  failed: {
    label: 'Failed',
    tone: 'bg-red-500/10 text-red-700 dark:text-red-400',
  },
  pending: {
    label: 'Pending',
    tone: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  },
  successful: {
    label: 'Successful',
    tone: 'bg-green-500/10 text-green-700 dark:text-green-400',
  },
}

const paymentStatus = (status: string) => {
  const value = status?.toLowerCase() ?? ''
  if (value.includes('fail')) return statuses.failed
  if (value.includes('pend')) return statuses.pending
  return statuses.successful
}

const rows = computed(() =>
  (payments.value ?? []).map((payment) => ({
    ...payment,
    paidAt: {
      date: useDateFormat(payment.date, 'Do MMM YYYY').value,
      time: useDateFormat(`${payment.date} ${payment.time}`, 'h:mm a').value,
    },
    amount: formatNaira(parseNumber(payment.amount_pay) || 0),
    state: paymentStatus(payment.status),
  })),
)

const fetchPaymentHistory = async () => {
  try {
    loading.value = true
    error.value = false
    const response = await apiClient.history.fetchPaymentHistory()
    if (response.status === 1) {
      payments.value = response.data
    }
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(fetchPaymentHistory)
</script>
