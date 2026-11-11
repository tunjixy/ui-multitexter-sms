<template>
  <header
    class="border-border bg-background/80 sticky top-0 z-40 h-16 w-full border-b backdrop-blur-lg backdrop-saturate-180"
  >
    <div class="dashboard-wrapper">
      <div class="flex h-16 w-full items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <button
            class="hover:bg-grey dark:hover:bg-grey/5 flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors ease-in lg:hidden"
            type="button"
            aria-label="Toggle menu"
            @click="$emit('toggle')"
          >
            <MenuIcon :size="18" />
          </button>
          <div class="font-semibold">
            {{ pageTitle }}
          </div>
        </div>
        <div class="flex items-center">
          <div v-if="userDetail" class="flex items-center gap-2">
            <CoinsIcon class="text-primary size-4" />
            <span class="text-sm font-bold">
              {{ formatNumberWithComma(userDetail.balance) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { CoinsIcon, MenuIcon } from '@lucide/vue'

defineEmits(['toggle'])

const { pageTitle } = storeToRefs(useAppStore())
const { userDetail } = storeToRefs(useUserStore())
</script>
