<template>
  <section class="border-border relative overflow-hidden border-b">
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--color-muted-foreground)_1px,transparent_1px)] mask-[linear-gradient(to_bottom,black,transparent)] bg-size-[24px_24px] opacity-25"
    />
    <div
      aria-hidden="true"
      class="bg-primary/15 pointer-events-none absolute -top-56 -right-32 size-144 rounded-full blur-3xl"
    />
    <div
      aria-hidden="true"
      class="pointer-events-none absolute top-1/2 -right-40 hidden size-144 -translate-y-1/2 lg:block"
    >
      <span
        v-for="ring in 4"
        :key="ring"
        class="border-primary/15 absolute inset-0 m-auto rounded-full border"
        :style="{ width: `${ring * 25}%`, height: `${ring * 25}%` }"
      />
      <span
        class="bg-primary/40 absolute inset-0 m-auto size-3 rounded-full motion-safe:animate-ping"
      />
      <span class="bg-primary absolute inset-0 m-auto size-3 rounded-full" />
    </div>

    <div class="wrapper relative py-16 lg:py-24">
      <p class="text-primary text-xs font-semibold tracking-[0.25em] uppercase">
        SMS Coverage
      </p>
      <h1
        class="mt-4 max-w-3xl text-4xl leading-[1.15] font-semibold tracking-tight text-balance sm:text-5xl xl:text-6xl"
      >
        We cover where you need to reach.
      </h1>
      <p
        class="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed sm:text-lg"
      >
        Send messages to mobile networks across Nigeria and around the world.
        Find your destination below to see how many networks we reach there.
      </p>

      <dl v-if="coverages.length" class="mt-10 flex flex-wrap gap-x-12 gap-y-6">
        <div v-for="stat in stats" :key="stat.label" class="flex flex-col-reverse">
          <dt class="text-muted-foreground mt-1 text-sm">{{ stat.label }}</dt>
          <dd class="text-3xl font-semibold tracking-tight tabular-nums">
            {{ stat.value }}
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Coverage } from '@/types/coverage'

const { coverages } = defineProps<{
  coverages: Coverage[]
}>()

const stats = computed(() => [
  {
    label: 'Countries',
    value: formatNumberWithComma(coverages.length),
  },
  {
    label: 'Mobile networks',
    value: formatNumberWithComma(
      coverages.reduce((total, { networkcount }) => total + networkcount, 0),
    ),
  },
])
</script>
