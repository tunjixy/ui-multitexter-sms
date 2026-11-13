<template>
  <div
    class="border-border bg-background/40 flex items-start gap-4 rounded-xl border p-4 text-sm"
  >
    <NuxtImg
      src="/images/providus-bank.png"
      alt="Providus bank logo"
      width="48"
      height="48"
      class="border-border size-12 shrink-0 rounded-full border"
    />

    <div class="min-w-0 flex-1 space-y-3">
      <div>
        <div class="text-muted-foreground">Account name</div>
        <div class="mt-0.5 font-medium">{{ account.name }}</div>
      </div>
      <div>
        <div class="text-muted-foreground">Account number</div>
        <div
          class="mt-0.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1"
        >
          <span class="text-lg font-semibold tracking-wide tabular-nums">
            {{ account.number }}
          </span>
          <button
            type="button"
            class="text-primary hover:text-primary/80 focus-visible:ring-primary/35 inline-flex cursor-pointer items-center gap-1.5 rounded-sm text-sm font-medium transition-colors outline-none focus-visible:ring-2"
            @click="copy(account.number)"
          >
            <CheckIcon v-if="copied" class="size-4" />
            <CopyIcon v-else class="size-4" />
            <span>
              {{ copied ? 'Copied' : 'Copy' }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckIcon, CopyIcon } from '@lucide/vue'

const { copy, copied } = useClipboard({ legacy: true })

const account = {
  name: 'Fullware Solutions MultiTexter',
  number: '1307669875',
}
</script>
