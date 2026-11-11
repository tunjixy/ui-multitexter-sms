<template>
  <section class="relative overflow-hidden py-16 lg:py-24">
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--color-muted-foreground)_1px,transparent_1px)] mask-[linear-gradient(to_bottom,black,transparent)] bg-size-[24px_24px] opacity-25"
    />
    <div
      aria-hidden="true"
      class="bg-primary/15 pointer-events-none absolute -top-56 -right-32 size-144 rounded-full blur-3xl"
    />

    <div
      class="wrapper relative grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_28rem] xl:grid-cols-[minmax(0,1fr)_32rem] xl:gap-20"
    >
      <div>
        <p
          class="text-primary text-xs font-semibold tracking-[0.25em] uppercase"
        >
          Our Story &amp; Purpose
        </p>

        <h1
          class="mt-4 text-4xl leading-[1.15] font-semibold tracking-tight text-balance sm:text-5xl xl:text-6xl"
        >
          Engineered for messages that
          <span class="text-primary">must arrive.</span>
        </h1>

        <p
          class="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed sm:text-lg"
        >
          Multitexter is an online Bulk SMS platform for sending text messages
          from any internet connected device. We currently deliver SMS to four
          major GSM networks in Nigeria including, Glo, MTN, Airtel, and T2, and
          most of the major GSM networks internationally.
        </p>

        <div class="mt-8 flex flex-wrap gap-3">
          <NuxtLink
            to="/signup"
            class="bg-primary text-dark-blue hover:bg-primary/85 focus-visible:ring-primary/40 flex h-11 items-center rounded-lg px-6 text-sm font-semibold transition-colors ease-in outline-none focus-visible:ring-3"
          >
            Explore Our Platform
          </NuxtLink>
          <NuxtLink
            to="/contact-sales"
            class="border-border hover:bg-primary/10 focus-visible:ring-primary/30 flex h-11 items-center rounded-lg border px-6 text-sm font-semibold transition-colors ease-in outline-none focus-visible:ring-3"
          >
            Speak With Our Team
          </NuxtLink>
        </div>
      </div>

      <ul class="grid gap-4 sm:grid-cols-2">
        <li
          v-for="stat in stats"
          :key="stat.label"
          class="border-border bg-surface rounded-2xl border p-6"
        >
          <p class="text-3xl font-bold tracking-tight lg:text-4xl">
            {{ stat.value }}
          </p>
          <p
            class="text-primary mt-2 text-xs font-semibold tracking-wide uppercase"
          >
            {{ stat.label }}
          </p>
          <p class="text-muted-foreground mt-3 text-sm leading-relaxed">
            {{ stat.description }}
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Stat {
  value: string
  label: string
  description: string
}

const currentYear = new Date().getFullYear()

const stats: Stat[] = [
  {
    value: '99.8%',
    label: 'Delivery Rate',
    description: 'Direct multi-carrier routing with instant network failovers.',
  },
  {
    value: '15M+',
    label: 'Monthly Dispatches',
    description: 'Trusted by fast-growing startups and household enterprises.',
  },
  {
    value: '36+',
    label: 'States Covered',
    description: 'Nationwide GSM coverage including DND override paths.',
  },
  {
    value: String(currentYear),
    label: 'Modern Stack',
    description: 'Enterprise REST APIs and resilient web & mobile dashboards.',
  },
]
</script>
