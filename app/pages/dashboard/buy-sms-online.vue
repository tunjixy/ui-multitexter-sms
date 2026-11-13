<template>
  <div class="py-6">
    <div class="dashboard-wrapper">
      <h1 class="text-2xl font-bold tracking-tight">Buy SMS units</h1>
      <p class="text-muted-foreground mt-1 max-w-xl text-sm">
        Pay online with your ATM, credit or debit card and your units are
        credited instantly.
      </p>

      <div
        class="mt-6 grid max-w-2xl grid-cols-1 items-start gap-6 xl:max-w-none xl:grid-cols-[minmax(0,44rem)_24rem]"
      >
        <UnitForm ref="unitForm" class="xl:col-start-1 xl:row-start-1" />

        <PriceCalculator class="xl:col-start-2 xl:row-span-2 xl:row-start-1">
          <template #default="{ units }">
            <UiButton
              variant="outline"
              radius="lg"
              block
              class="mt-4"
              :disabled="!units"
              @click="unitForm?.setUnits(units)"
            >
              Use this estimate
            </UiButton>
          </template>
        </PriceCalculator>

        <section
          class="border-border bg-surface rounded-2xl border p-6 sm:p-8 xl:col-start-1 xl:row-start-2"
        >
          <h2 class="font-semibold">Prefer bank transfer?</h2>
          <p class="text-muted-foreground mt-1 text-sm">
            Pay into this account, then send us your payment details. Transfers
            are credited once we confirm them, which can take longer at
            weekends.
          </p>

          <AccountDetails class="mt-5" />

          <NuxtLink
            to="/dashboard/bank-deposit"
            class="text-primary hover:text-primary/80 focus-visible:ring-primary/35 mt-5 inline-flex items-center gap-1.5 rounded-sm text-sm font-medium transition-colors outline-none focus-visible:ring-2"
          >
            Send your payment details
            <ArrowRightIcon class="size-4" />
          </NuxtLink>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRightIcon } from '@lucide/vue'

const unitForm = useTemplateRef<{ setUnits: (units: number) => void }>(
  'unitForm',
)

const { fetchPrices } = usePricing()

onMounted(fetchPrices)

useAppStore().setPageTitle('Buy SMS Units')

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useHead({
  title: 'Buy SMS Units',
})
</script>
