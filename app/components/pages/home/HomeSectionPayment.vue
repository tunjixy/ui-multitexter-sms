<template>
  <section class="py-16 lg:py-24">
    <div
      class="wrapper grid items-center gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16"
    >
      <ul
        aria-label="Accepted payment methods"
        class="order-last grid grid-cols-2 gap-3 sm:grid-cols-3 lg:order-first"
      >
        <li
          v-for="method in methods"
          :key="method"
          class="bg-surface border-border flex h-15 items-center rounded-lg border px-5 text-sm font-medium"
        >
          {{ method }}
        </li>
        <li
          class="bg-dark-blue col-span-full flex min-h-15 items-center rounded-lg border border-white/10 px-5 py-4 text-sm text-white"
        >
          First Bank, Diamond Bank, GTBank and Zenith Bank
        </li>
      </ul>

      <div>
        <p
          class="text-primary text-xs font-semibold tracking-[0.25em] uppercase"
        >
          Payments
        </p>
        <h2
          class="mt-4 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl"
        >
          Multiple and flexible payment options
        </h2>
        <p
          class="text-muted-foreground mt-5 max-w-xl text-base leading-relaxed"
        >
          With either Bank Deposits or Online Transfer, payment is easily
          integrated to give you your SMS units. We accept MasterCard, Verified
          by Visa, eTranzact, Verve and Interswitch Cards for online payments
          and for Bank Deposits, First Bank, Diamond Bank, GTBank and Zenith
          Bank.
        </p>
        <NuxtLink
          to="/pricing"
          class="bg-primary text-dark-blue hover:bg-primary/85 focus-visible:ring-primary/40 mt-8 inline-flex h-12 items-center rounded-lg px-6 text-sm font-semibold transition-colors ease-in outline-none focus-visible:ring-3"
        >
          View Pricing
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const methods = [
  'MasterCard',
  'Verified by Visa',
  'eTranzact',
  'Verve',
  'Interswitch',
  'Bank Deposit',
]
</script>
