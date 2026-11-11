<template>
  <section class="py-16 lg:py-24">
    <div class="wrapper">
      <div class="max-w-3xl">
        <p
          class="text-primary text-xs font-semibold tracking-[0.25em] uppercase"
        >
          Dependability at Scale
        </p>

        <h2
          class="text-foreground mt-4 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl"
        >
          Why Nigerian organizations trust our message routing.
        </h2>

        <p
          class="text-muted-foreground mt-5 max-w-2xl text-base leading-relaxed sm:text-lg"
        >
          SMS remains the most direct medium in West Africa. We designed
          MultiTexter around speed, telco compliance, and absolute
          deliverability.
        </p>
      </div>

      <ul class="mt-12 grid gap-6 md:grid-cols-2 lg:mt-14 lg:grid-cols-3">
        <li
          v-for="feature in features"
          :key="feature.title"
          class="bg-surface border-border hover:border-primary/40 flex flex-col rounded-2xl border p-7 transition-colors ease-in"
        >
          <span
            class="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl"
          >
            <component :is="feature.icon" class="size-5" />
          </span>

          <h3 class="text-foreground mt-6 text-lg font-semibold">
            {{ feature.title }}
          </h3>

          <p class="text-muted-foreground mt-3 text-sm leading-relaxed">
            {{ feature.description }}
          </p>

          <p
            class="border-border text-primary mt-auto border-t pt-5 text-xs font-semibold"
          >
            {{ feature.highlight }}
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { CodeXml, ShieldCheck, Wifi } from '@lucide/vue'

interface Feature {
  icon: Component
  title: string
  description: string
  highlight: string
}

const features: Feature[] = [
  {
    icon: Wifi,
    title: 'Direct Telco Interconnects',
    description:
      'Instead of routing through unpredictable intermediaries, our systems connect through high-priority carrier pipes across MTN, Airtel, Glo, and T2.',
    highlight: 'Sub-3 second delivery latency',
  },
  {
    icon: ShieldCheck,
    title: 'DND Override Channels',
    description:
      'Transactional and financial communications do not get trapped by Do-Not-Disturb configurations. We provide dedicated corporate routes that land critical alerts safely.',
    highlight: 'Financial institution approved',
  },
  {
    icon: CodeXml,
    title: 'Developer REST API',
    description:
      'Modern JSON endpoints, balance interrogation hooks, and multi-language SDK documentation that integrate directly into existing CRMs and ERP systems.',
    highlight: 'Full webhooks & delivery reports',
  },
]
</script>
