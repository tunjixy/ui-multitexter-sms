<template>
  <div class="py-6">
    <div class="dashboard-wrapper">
      <section class="border-border bg-surface rounded-2xl border p-6 sm:p-8">
        <span
          class="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl"
        >
          <Gift class="size-5" />
        </span>

        <h1 class="mt-5 text-2xl font-bold tracking-tight">
          Refer people to Multitexter
        </h1>
        <p class="text-muted-foreground mt-2">
          Get rewarded with free units every time they recharge!
        </p>

        <h2 class="mt-6 text-sm font-semibold">
          How can you be a part of this?
        </h2>
        <p class="text-muted-foreground mt-2 max-w-3xl text-sm leading-relaxed">
          Copy and share this link on your social profile, or send it to anyone
          you want to introduce to Multitexter BulkSMS. Once they register, they
          will be added to your profile, and once they recharge you will get
          units equal to 5% of the amount they spend (minimum of ₦1,000).
        </p>

        <div class="mt-6 max-w-xl">
          <UiSkeleton v-if="!userDetail" class="h-11 w-full rounded-lg" />
          <UiInput
            v-else
            :model-value="referUrl"
            name="refer-url"
            aria-label="Your referral link"
            readonly
          >
            <template #trailing>
              <button
                type="button"
                class="text-primary hover:text-primary/80 focus-visible:ring-primary/35 inline-flex cursor-pointer items-center gap-1.5 rounded-sm text-sm font-medium transition-colors outline-none focus-visible:ring-2"
                @click="copy(referUrl)"
              >
                <CheckIcon v-if="copied" class="size-4" />
                <CopyIcon v-else class="size-4" />
                <span>{{ copied ? 'Copied' : 'Copy' }}</span>
              </button>
            </template>
          </UiInput>
        </div>
      </section>

      <ReferralListing class="mt-10" />
      <CommissionListing class="mt-10" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckIcon, CopyIcon, Gift } from '@lucide/vue'

const { userDetail } = storeToRefs(useUserStore())
const { copy, copied } = useClipboard({
  legacy: true,
})

useAppStore().setPageTitle('Refer a Friend')

const referUrl = computed(
  () => `https://www.multitexter.com/signup?ref=${userDetail.value?.userid}`,
)

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useHead({
  title: 'Refer a Friend',
})
</script>
