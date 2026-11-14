<template>
  <div class="py-6">
    <div class="dashboard-wrapper">
      <h1 class="text-2xl font-bold tracking-tight">Delivery reports</h1>
      <p class="text-muted-foreground mt-1 max-w-xl text-sm">
        See whether each message you sent reached its recipient. Open a report
        to read the full message.
      </p>

      <div class="mt-5 grid gap-3 text-sm sm:grid-cols-3">
        <div
          v-for="item in statuses"
          :key="item.status"
          class="flex items-start gap-2.5"
        >
          <div class="shrink-0">
            <ReportStatusBadge :status="item.status" />
          </div>
          <div class="text-muted-foreground pt-0.5">{{ item.description }}</div>
        </div>
      </div>

      <ReportFilter class="mt-6" />
      <ReportListing class="mt-6" />
    </div>
  </div>
</template>

<script setup lang="ts">
const statuses = [
  {
    status: 'delivered',
    description: "The message reached the recipient's phone.",
  },
  {
    status: 'sent',
    description:
      "It may have been delivered, but the network didn't send a final report.",
  },
  {
    status: 'deliveredpp',
    description: 'Delivered despite DND, using a fixed numeric sender ID.',
  },
]

useAppStore().setPageTitle('Delivery Reports')

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useHead({
  title: 'Delivery Reports',
})
</script>
