<template>
  <div class="py-6">
    <div class="dashboard-wrapper">
      <h1 class="text-2xl font-bold tracking-tight">Bank deposit</h1>
      <p class="text-muted-foreground mt-1 max-w-xl text-sm">
        Pay by bank deposit or transfer, then tell us about the payment so we
        can credit your account.
      </p>

      <div
        class="mt-6 grid max-w-2xl items-start gap-6 xl:max-w-none xl:grid-cols-[22rem_minmax(0,42rem)]"
      >
        <section
          class="border-border bg-surface rounded-2xl border p-6 sm:p-8 xl:sticky xl:top-24"
        >
          <p
            class="text-primary text-xs font-semibold tracking-wider uppercase"
          >
            Step 1
          </p>
          <h2 class="mt-1 font-semibold">Pay into our account</h2>
          <p class="text-muted-foreground mt-1 text-sm">
            Make a bank deposit, online transfer or ATM transfer to this
            account.
          </p>

          <AccountDetails class="mt-6" />

          <div
            class="mt-5 flex gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm"
          >
            <InfoIcon
              class="mt-0.5 size-4 shrink-0 text-amber-700 dark:text-amber-400"
            />
            <div>
              <p>
                When you pay, use your email address as the depositor's name so
                we can match the payment to your account.
              </p>
              <p v-if="user?.email" class="mt-1 font-semibold break-all">
                {{ user.email }}
              </p>
            </div>
          </div>
        </section>

        <DepositForm />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { InfoIcon } from '@lucide/vue'

const { user } = storeToRefs(useUserStore())

useAppStore().setPageTitle('Bank Deposit')

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useHead({
  title: 'Bank Deposit',
})
</script>
