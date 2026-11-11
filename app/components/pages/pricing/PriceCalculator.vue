<template>
  <aside
    id="calculator"
    aria-labelledby="calculator-title"
    class="bg-surface border-border scroll-mt-32 rounded-3xl border p-6 sm:p-8 lg:sticky lg:top-32"
  >
    <div class="flex items-center gap-3">
      <span
        class="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl"
      >
        <Calculator class="size-5" />
      </span>
      <div>
        <h2 id="calculator-title" class="text-lg font-semibold">
          Price calculator
        </h2>
        <p class="text-muted-foreground text-sm">
          Estimate the cost of a campaign.
        </p>
      </div>
    </div>

    <div class="mt-8 space-y-6">
      <UiInput
        id="calculator-recipients"
        ref="recipientsInput"
        :model-value="formattedRecipients"
        label="Recipients"
        hint="How many people are you sending SMS to?"
        inputmode="numeric"
        placeholder="e.g. 5,000"
        @keypress="isNumber"
        @update:model-value="onRecipientsInput"
      >
        <template #leading>
          <Users class="size-4" />
        </template>
      </UiInput>

      <div class="flex flex-col gap-1">
        <label for="calculator-pages" class="text-sm font-semibold">
          SMS pages
        </label>
        <div
          class="border-border bg-surface focus-within:border-primary focus-within:ring-primary/35 flex h-10 items-center rounded-lg border transition-[border-color,box-shadow] focus-within:ring-3"
        >
          <button
            type="button"
            aria-label="Remove a page"
            :disabled="pages <= 1"
            class="text-muted-foreground hover:text-foreground flex h-full w-10 shrink-0 cursor-pointer items-center justify-center transition-colors ease-in outline-none disabled:cursor-not-allowed disabled:opacity-40"
            @click="setPages(pages - 1)"
          >
            <Minus class="size-4" />
          </button>
          <input
            id="calculator-pages"
            :value="pages"
            inputmode="numeric"
            aria-describedby="calculator-pages-hint"
            class="h-full min-w-0 flex-1 bg-transparent text-center text-base tabular-nums outline-none sm:text-sm"
            @keypress="isNumber"
            @input="onPagesInput"
            @blur="onPagesBlur"
          />
          <button
            type="button"
            aria-label="Add a page"
            class="text-muted-foreground hover:text-foreground flex h-full w-10 shrink-0 cursor-pointer items-center justify-center transition-colors ease-in outline-none"
            @click="setPages(pages + 1)"
          >
            <Plus class="size-4" />
          </button>
        </div>
        <p id="calculator-pages-hint" class="text-muted-foreground text-sm">
          1 page is up to 160 characters.
        </p>
      </div>
    </div>

    <div class="border-primary/20 bg-primary/5 mt-8 rounded-2xl border p-5">
      <p
        class="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase"
      >
        Estimated cost
      </p>
      <p
        class="mt-2 text-4xl font-semibold tracking-tight break-all tabular-nums"
        aria-live="polite"
      >
        {{ formatNaira(amount) }}
      </p>

      <dl class="border-primary/15 mt-5 space-y-2.5 border-t pt-5 text-sm">
        <div class="flex justify-between gap-4">
          <dt class="text-muted-foreground">Units needed</dt>
          <dd class="font-medium tabular-nums">
            {{ formatNumberWithComma(units) }}
          </dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="text-muted-foreground">Price per unit</dt>
          <dd class="font-medium tabular-nums">
            {{
              matchedTier
                ? formatNaira(matchedTier.price, { fixed: true })
                : '—'
            }}
          </dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="text-muted-foreground">Package</dt>
          <dd class="text-right font-medium">
            {{ matchedTier?.title ?? '—' }}
          </dd>
        </div>
      </dl>

      <p
        v-if="minimumUnits && units && units < minimumUnits"
        class="mt-4 text-xs text-amber-700 dark:text-amber-400"
      >
        The minimum purchase is
        {{ formatNumberWithComma(minimumUnits) }} units.
      </p>
    </div>

    <p class="text-muted-foreground mt-6 text-sm leading-relaxed">
      Pay online with your ATM, credit or debit card and get your units credited
      instantly.
    </p>
  </aside>
</template>

<script setup lang="ts">
import { Calculator, Minus, Plus, Users } from '@lucide/vue'
import type { Price } from '@/types/pricing'

const tier = defineModel<Price | null>('tier', { default: null })

const { prices } = usePricing()

const UNITS_PER_PAGE = 2
const recipients = ref('')
const pages = ref(1)

const recipientsInput = useTemplateRef<{ el: HTMLInputElement | null }>(
  'recipientsInput',
)

const tiers = computed(() => prices.value ?? [])

const minimumUnits = computed(() => tiers.value[0]?.minimum_units ?? 0)

const formattedRecipients = computed(() =>
  recipients.value ? formatNumberWithComma(recipients.value) : '',
)

const onRecipientsInput = () => {
  const input = recipientsInput.value?.el
  if (input) recipients.value = formatNumberInput(input)
}

const setPages = (value: number) => {
  pages.value = Math.max(1, Math.round(value) || 1)
}

const onPagesInput = (event: Event) => {
  const digits = (event.target as HTMLInputElement).value.replace(/\D/g, '')
  if (digits) setPages(Number(digits))
}

const onPagesBlur = (event: FocusEvent) => {
  const input = event.target as HTMLInputElement
  input.value = String(pages.value)
}

const units = computed(
  () => (Number(recipients.value) || 0) * pages.value * UNITS_PER_PAGE,
)

const matchedTier = computed(() => {
  if (!units.value) return null
  return (
    tiers.value.findLast(({ minimum_units }) => minimum_units <= units.value) ??
    tiers.value[0] ??
    null
  )
})

const amount = computed(() =>
  matchedTier.value ? units.value * matchedTier.value.price : 0,
)

watch(matchedTier, (value) => (tier.value = value), { immediate: true })
</script>
