<template>
  <section>
    <div class="flex items-center gap-2">
      <h2 class="text-lg font-semibold">Commissions</h2>
      <span
        v-if="commissions?.length"
        class="bg-primary/10 text-primary inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold"
      >
        {{ commissions.length }}
      </span>
    </div>
    <p class="text-muted-foreground mt-1 text-sm">
      Units you've earned when your referrals recharge.
    </p>

    <div class="mt-4">
      <div v-if="loading" class="space-y-3">
        <UiSkeleton v-for="n in 4" :key="n" class="h-12 w-full rounded-lg" />
      </div>

      <UiErrorState v-else-if="error" @try-again="fetchCommissions" />

      <EmptyState
        v-else-if="!commissions?.length"
        :icon="Wallet"
        title="No commissions yet"
        description="You'll earn 5% in units each time someone you referred recharges."
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
            <TableRow v-for="(commission, index) in commissions" :key="index">
              <TableCell class="text-muted-foreground w-12">
                {{ index + 1 }}.
              </TableCell>
              <TableCell>{{ commission.name }}</TableCell>
              <TableCell>{{ commission.email }}</TableCell>
              <TableCell class="font-medium">
                {{ formatNaira(Number(commission.amount)) }}
              </TableCell>
              <TableCell>
                <span
                  :class="[
                    'inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold',
                    isPaid(commission)
                      ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                      : 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
                  ]"
                >
                  {{ isPaid(commission) ? 'Paid' : 'Not paid' }}
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
import { Wallet } from '@lucide/vue'
import type { Commission } from '@/types/referral'
import { apiClient } from '@/repository/api'

const headings = ['', 'Name', 'Email', 'Amount', 'Status']
const commissions = ref<Commission[] | null>(null)
const loading = ref(true)
const error = ref(false)

const isPaid = (commission: Commission) =>
  commission.payment_status?.toLowerCase() === 'paid'

const fetchCommissions = async () => {
  try {
    loading.value = true
    error.value = false
    const response = await apiClient.referral.fetchCommissions()
    if (response.status === 1) {
      commissions.value = response.data
    }
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(fetchCommissions)
</script>
