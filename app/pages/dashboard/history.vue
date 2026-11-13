<template>
  <div class="py-6">
    <div class="dashboard-wrapper">
      <h1 class="text-2xl font-bold tracking-tight">History</h1>
      <p class="text-muted-foreground mt-1 max-w-xl text-sm">
        Your payments, recharges and every change to your account.
      </p>

      <UiTabs
        v-model="activeTab"
        :items="tabs"
        variant="segmented"
        aria-label="History type"
        class="mt-6"
      />

      <div role="tabpanel" class="mt-6 overflow-x-clip">
        <Transition name="slide-tab" mode="out-in">
          <KeepAlive>
            <PaymentHistory v-if="activeTab === 'payments'" />
            <RechargeHistory v-else-if="activeTab === 'recharges'" />
            <TransactionHistory v-else />
          </KeepAlive>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useAppStore().setPageTitle('History')

const activeTab = ref('payments')
const tabs = [
  {
    value: 'payments',
    label: 'Payments',
  },
  {
    value: 'recharges',
    label: 'Recharges',
  },
  {
    value: 'transactions',
    label: 'Transactions',
  },
]

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useHead({
  title: 'History',
})
</script>
