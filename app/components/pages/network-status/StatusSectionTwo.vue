<template>
  <section class="py-16 lg:py-24">
    <div
      class="wrapper grid items-start gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16"
    >
      <div class="lg:sticky lg:top-32">
        <p
          v-motion-fade-visible-once
          class="text-primary text-xs font-semibold tracking-[0.25em] uppercase"
        >
          Status history
        </p>
        <h2
          v-motion-reveal
          :delay="100"
          class="mt-4 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl"
        >
          Every update, newest first.
        </h2>
        <p
          v-motion-fade-visible-once
          :delay="300"
          class="text-muted-foreground mt-5 leading-relaxed"
        >
          Filter by network to see the updates that affect your recipients.
        </p>

        <fieldset v-motion-fade-visible-once :delay="400" class="mt-8">
          <legend class="sr-only">Filter by network</legend>
          <div class="flex flex-wrap gap-2">
            <label v-for="option in filters" :key="option.value" :class="chip">
              <input
                v-model="selected"
                type="radio"
                name="network"
                :value="option.value"
                class="sr-only"
              />
              <span
                v-if="option.dot"
                aria-hidden="true"
                :class="['size-2 rounded-full', option.dot]"
              />
              {{ option.label }}
              <span
                class="text-muted-foreground group-has-checked:text-primary/70 tabular-nums"
              >
                {{ option.count }}
              </span>
            </label>
          </div>
        </fieldset>

        <dl
          v-motion-fade-visible-once
          :delay="500"
          class="border-border mt-10 space-y-3 border-t pt-6"
        >
          <div
            v-for="(style, type) in types"
            :key="type"
            class="flex items-center gap-3 text-sm"
          >
            <dt>
              <span
                :class="[
                  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
                  style.chip,
                ]"
              >
                {{ style.label }}
              </span>
            </dt>
            <dd class="text-muted-foreground">{{ style.description }}</dd>
          </div>
        </dl>
      </div>

      <ol aria-live="polite">
        <li
          v-for="(update, index) in filtered"
          :key="`${update.network}-${update.date}`"
          v-motion-slide-visible-once-bottom
          class="relative pb-10 pl-8 last:pb-0 sm:pl-10"
        >
          <span
            v-if="index < filtered.length - 1"
            aria-hidden="true"
            class="bg-border absolute top-4 bottom-0 left-1.75 w-px"
          />
          <span
            aria-hidden="true"
            :class="[
              'ring-border border-background absolute top-1 left-0 size-4 rounded-full border-4 ring-1',
              types[update.type].dot,
            ]"
          />

          <time
            :datetime="update.date"
            class="text-muted-foreground text-sm font-medium"
          >
            {{ formatDate(update.date) }}
          </time>

          <article
            class="bg-surface border-border hover:border-primary/40 mt-3 rounded-3xl border p-6 transition-colors ease-in sm:p-8"
          >
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="border-border inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium"
              >
                <span
                  aria-hidden="true"
                  :class="['size-2 rounded-full', networkDot(update.network)]"
                />
                {{ update.network }}
              </span>
              <span
                :class="[
                  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
                  types[update.type].chip,
                ]"
              >
                {{ types[update.type].label }}
              </span>
            </div>
            <h3 class="mt-4 text-lg font-semibold tracking-tight">
              {{ update.title }}
            </h3>
            <p class="text-muted-foreground mt-2 leading-relaxed">
              {{ update.message }}
            </p>
          </article>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { NetworkUpdateType } from '@/types/network-status'

const { updates, formatDate } = useNetworkStatus()

const types: Record<
  NetworkUpdateType,
  { label: string; description: string; chip: string; dot: string }
> = {
  disruption: {
    label: 'Disruption',
    description: 'Messages may not be delivered.',
    chip: 'border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400',
    dot: 'bg-red-500',
  },
  restriction: {
    label: 'Restriction',
    description: 'Delivery is limited or delayed.',
    chip: 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  notice: {
    label: 'Notice',
    description: 'A change in how messages arrive.',
    chip: 'border-primary/20 bg-primary/10 text-primary',
    dot: 'bg-primary',
  },
}

const networkDots: Record<string, string> = {
  'MTN Nigeria': 'bg-yellow-400',
  'Airtel Nigeria': 'bg-red-500',
}
const networkDot = (network: string) =>
  networkDots[network] ?? 'bg-muted-foreground'

const selected = ref('all')

const filters = computed(() => {
  const networks = [...new Set(updates.map(({ network }) => network))].sort()
  return [
    { value: 'all', label: 'All networks', count: updates.length, dot: '' },
    ...networks.map((network) => ({
      value: network,
      label: network,
      count: updates.filter((update) => update.network === network).length,
      dot: networkDot(network),
    })),
  ]
})

const filtered = computed(() =>
  selected.value === 'all'
    ? updates
    : updates.filter(({ network }) => network === selected.value),
)

const chip =
  'group border-border text-muted-foreground not-has-checked:hover:border-muted-foreground has-checked:border-primary has-checked:bg-primary/10 has-checked:text-primary has-focus-visible:ring-primary/35 inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-medium transition-[background-color,border-color,color,box-shadow] select-none has-focus-visible:ring-3'
</script>
