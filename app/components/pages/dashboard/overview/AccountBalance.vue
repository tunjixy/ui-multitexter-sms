<template>
  <UiSkeleton v-if="!userDetail" class="h-56 w-full rounded-2xl lg:h-44" />

  <section
    v-else
    class="border-border bg-surface grid overflow-hidden rounded-2xl border lg:grid-cols-[minmax(0,1fr)_22rem]"
  >
    <div class="p-6 sm:p-8">
      <p class="text-muted-foreground flex items-center gap-2 text-sm">
        <CoinsIcon class="text-primary size-4 shrink-0" />
        Unit balance
      </p>
      <p class="mt-2 text-4xl font-bold tracking-tight break-all">
        {{ formatNumberWithComma(userDetail.balance) }}
      </p>

      <div class="mt-6 flex flex-wrap gap-3">
        <UiButton radius="lg" @click="navigateTo('/dashboard/buy-sms-online')">
          <template #leading>
            <CreditCardIcon class="size-4" />
          </template>
          Buy units
        </UiButton>
        <UiButton
          variant="outline"
          radius="lg"
          @click="navigateTo('/dashboard/share-credit')"
        >
          <template #leading>
            <Share2Icon class="size-4" />
          </template>
          Share credit
        </UiButton>
      </div>
    </div>

    <div
      class="border-border divide-border bg-background/40 flex flex-col justify-center divide-y border-t px-6 sm:px-8 lg:border-t-0 lg:border-l"
    >
      <div class="flex items-center justify-between gap-4 py-3.5">
        <div class="text-muted-foreground text-sm">Free SMS</div>
        <div class="text-sm font-semibold">
          {{ formatNumberWithComma(userDetail.freesms) }}
        </div>
      </div>

      <div class="flex items-center justify-between gap-4 py-3.5">
        <div class="text-muted-foreground text-sm">Last message sent</div>
        <div class="text-right text-sm font-semibold">
          <div v-if="userDetail.lastmessage">
            {{ lastMessage }}
          </div>
          <span v-else class="text-muted-foreground font-normal">
            None yet
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { CoinsIcon, CreditCardIcon, Share2Icon } from '@lucide/vue'

const { userDetail } = storeToRefs(useUserStore())

const lastMessage = useDateFormat(
  () => userDetail.value?.lastmessage ?? '',
  'Do MMM YYYY',
)
</script>
