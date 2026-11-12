<template>
  <section>
    <p class="text-muted-foreground text-sm">
      Units added to your account, with your balance after each one.
    </p>

    <div class="mt-4">
      <div v-if="loading" class="space-y-3">
        <UiSkeleton v-for="n in 5" :key="n" class="h-12 w-full rounded-lg" />
      </div>

      <UiErrorState v-else-if="error" @try-again="fetchRechargeHistory" />

      <EmptyState
        v-else-if="!rows.length"
        :icon="Coins"
        title="No recharges yet"
        description="Every time units are added to your account, it will show up here."
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
            <TableRow v-for="(recharge, index) in rows" :key="index">
              <TableCell class="text-muted-foreground w-12">
                {{ index + 1 }}.
              </TableCell>
              <TableCell>
                {{ recharge.rechargedAt.date }}
                <span
                  v-if="recharge.rechargedAt.time"
                  class="text-muted-foreground block text-xs"
                >
                  {{ recharge.rechargedAt.time }}
                </span>
              </TableCell>
              <TableCell class="font-medium">
                {{ formatNumberWithComma(recharge.units) }}
              </TableCell>
              <TableCell>
                {{ formatNumberWithComma(recharge.balance) }}
              </TableCell>
              <TableCell>
                <span class="block min-w-56 whitespace-normal">
                  {{ recharge.description || '—' }}
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
import { Coins } from '@lucide/vue'
import type { RechargeHistory } from '@/types/history'
import { apiClient } from '@/repository/api'

const headings = ['', 'Date', 'Units', 'Balance', 'Description']
const recharges = ref<RechargeHistory[] | null>(null)
const loading = ref(true)
const error = ref(false)

const rows = computed(() =>
  (recharges.value ?? []).map((recharge) => ({
    ...recharge,
    rechargedAt: {
      date: useDateFormat(recharge.date, 'Do MMM YYYY').value,
      time: recharge.date.includes(':')
        ? useDateFormat(recharge.date, 'h:mm a').value
        : null,
    },
  })),
)

const fetchRechargeHistory = async () => {
  try {
    loading.value = true
    error.value = false
    const response = await apiClient.history.fetchRechargeHistory()
    if (response) {
      recharges.value = response.msg
    }
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(fetchRechargeHistory)
</script>
