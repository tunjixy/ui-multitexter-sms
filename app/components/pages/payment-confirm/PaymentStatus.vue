<template>
  <div class="flex flex-col items-center text-center">
    <div class="relative flex size-40 items-center justify-center">
      <template v-if="status === 'verifying'">
        <span
          aria-hidden="true"
          class="border-primary/30 absolute inset-2 rounded-full border [animation-duration:2.4s] motion-safe:animate-ping"
        />
        <span
          aria-hidden="true"
          class="border-primary/20 absolute inset-6 rounded-full border [animation-delay:1.2s] [animation-duration:2.4s] motion-safe:animate-ping"
        />
      </template>
      <span
        v-else
        aria-hidden="true"
        :class="[
          'absolute inset-6 rounded-full blur-2xl',
          status === 'success' ? 'bg-emerald-500/30' : 'bg-red-500/25',
        ]"
      />

      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        :class="[
          'absolute inset-6 size-28 -rotate-90',
          status === 'verifying' &&
            '[animation-duration:1.4s] motion-safe:animate-spin',
        ]"
      >
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke-width="3"
          class="stroke-border"
        />
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke-width="3"
          stroke-linecap="round"
          :stroke-dasharray="status === 'verifying' ? '72 217' : '289 0'"
          :class="[
            'transition-[stroke-dasharray,stroke] duration-700 ease-out',
            ring,
          ]"
        />
      </svg>

      <Transition
        mode="out-in"
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="scale-50 opacity-0"
        leave-active-class="transition duration-150 ease-in"
        leave-to-class="scale-75 opacity-0"
      >
        <span
          :key="status"
          :class="[
            'bg-surface border-border relative flex size-16 items-center justify-center rounded-2xl border shadow-lg shadow-black/5',
            iconColor,
          ]"
        >
          <component :is="icon" class="size-7" :stroke-width="2.25" />
        </span>
      </Transition>
    </div>

    <div role="status" aria-live="polite" class="mt-8">
      <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">
        {{ title }}
      </h1>

      <div class="relative mx-auto mt-3 min-h-12 max-w-sm">
        <Transition
          mode="out-in"
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="translate-y-1 opacity-0"
          leave-active-class="transition duration-200 ease-in"
          leave-to-class="-translate-y-1 opacity-0"
        >
          <p
            :key="description"
            class="text-muted-foreground text-center text-sm leading-relaxed sm:text-base"
          >
            {{ description }}
          </p>
        </Transition>
      </div>
    </div>

    <p
      v-if="reference"
      class="border-border bg-surface text-muted-foreground mt-6 inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-1 text-xs"
    >
      <span class="shrink-0">Reference</span>
      <code class="text-foreground truncate">{{ reference }}</code>
    </p>

    <p
      class="text-muted-foreground mt-10 flex items-center gap-1.5 text-xs font-medium"
    >
      <Lock class="size-3.5" />
      {{
        status === 'verifying'
          ? 'Please don’t close or refresh this page'
          : 'Redirecting you now…'
      }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { Check, CreditCard, Lock, X } from '@lucide/vue'
import type { PaymentStatusState } from '@/types/payment'

const {
  status,
  provider = '',
  reference = '',
  message = '',
} = defineProps<{
  status: PaymentStatusState
  provider?: string
  reference?: string
  message?: string
}>()

const hints = computed(() => [
  provider
    ? `Confirming your payment with ${provider}.`
    : 'Confirming your payment.',
  'This usually takes just a few seconds.',
  'Hang tight, we’re almost there.',
])

const hintIndex = ref(0)
const { pause, resume } = useIntervalFn(
  () => {
    hintIndex.value = (hintIndex.value + 1) % hints.value.length
  },
  2800,
  { immediate: false },
)

watch(
  () => status,
  (value) => (value === 'verifying' ? resume() : pause()),
  { immediate: true },
)

const icon = computed(() =>
  status === 'success' ? Check : status === 'error' ? X : CreditCard,
)

const iconColor = computed(
  () =>
    ({
      verifying: 'text-primary',
      success: 'text-emerald-600 dark:text-emerald-400',
      error: 'text-red-600 dark:text-red-400',
    })[status],
)

const ring = computed(
  () =>
    ({
      verifying: 'stroke-primary',
      success: 'stroke-emerald-500',
      error: 'stroke-red-500',
    })[status],
)

const title = computed(
  () =>
    ({
      verifying: 'Verifying your payment',
      success: 'Payment confirmed',
      error: 'We couldn’t confirm your payment',
    })[status],
)

const description = computed(() =>
  status === 'verifying' ? hints.value[hintIndex.value] : message,
)
</script>
