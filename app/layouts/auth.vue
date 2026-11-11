<template>
  <div class="min-h-dvh sm:h-dvh">
    <div
      class="grid h-full min-h-dvh grid-cols-1 grid-rows-[auto_1fr] md:grid-cols-2 md:grid-rows-none"
    >
      <aside
        class="bg-dark-blue relative isolate flex items-center justify-center overflow-hidden py-8 text-white md:py-0"
      >
        <div
          aria-hidden="true"
          class="via-dark-blue to-dark-blue pointer-events-none absolute inset-0 -z-10 bg-linear-to-br from-sky-950"
        />
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle,rgb(255_255_255/0.18)_1px,transparent_1.5px)] mask-[radial-gradient(ellipse_at_center,black_25%,transparent_80%)] bg-size-[22px_22px]"
        />
        <div
          aria-hidden="true"
          class="bg-primary/20 pointer-events-none absolute -top-48 -left-48 -z-10 size-128 rounded-full blur-3xl"
        />
        <div
          aria-hidden="true"
          class="bg-primary/10 pointer-events-none absolute -right-40 -bottom-56 -z-10 size-128 rounded-full blur-3xl"
        />
        <div
          v-for="line in lines"
          :key="line"
          aria-hidden="true"
          :class="[
            'from-primary/40 pointer-events-none absolute -z-10 hidden h-px to-transparent md:block',
            line,
          ]"
        />

        <div class="max-w-md px-6 text-center md:px-10">
          <AppLogo class="inline-block" />

          <p
            class="mt-5 text-lg leading-tight font-semibold tracking-tight text-balance md:mt-10 md:text-3xl xl:text-4xl"
          >
            One message, thousands reached.
            <span class="text-primary block">Every network in Nigeria.</span>
          </p>

          <p
            class="mt-5 hidden leading-relaxed text-pretty text-white/60 md:block"
          >
            Bulk SMS at one unit per message, with instant delivery reports on
            every send.
          </p>

          <div class="mt-10 hidden justify-center gap-2 md:flex lg:gap-10">
            <div
              v-for="stat in stats"
              :key="stat.label"
              class="flex flex-col-reverse"
            >
              <div
                class="mt-1 text-[11px] font-medium tracking-wider text-white/50 uppercase"
              >
                {{ stat.label }}
              </div>
              <div class="text-primary text-2xl font-semibold tracking-tight">
                {{ stat.value }}
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div class="flex h-full flex-col items-center justify-center">
        <div class="wrapper">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const lines = [
  'top-[18%] right-0 w-2/5 bg-linear-to-l',
  'top-1/2 left-0 w-1/3 bg-linear-to-r',
  'top-[66%] right-0 w-1/2 bg-linear-to-l',
]

const stats = [
  { value: '1 unit', label: 'Per SMS' },
  { value: 'Tier 1', label: 'Delivery routes' },
  { value: 'Instant', label: 'Reports' },
]
</script>
