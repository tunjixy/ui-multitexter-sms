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

    <div class="wrapper relative py-16 lg:py-24">
      <p
        class="border-border bg-surface/70 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm"
      >
        <span class="relative flex size-2">
          <span
            class="bg-primary/60 absolute inset-0 rounded-full motion-safe:animate-ping"
          />
          <span class="bg-primary relative size-2 rounded-full" />
        </span>
        Last updated
        <time :datetime="latest.date" class="text-foreground">
          {{ formatDate(latest.date) }}
        </time>
      </p>

      <h1
        class="mt-6 max-w-3xl text-4xl leading-[1.15] font-semibold tracking-tight text-balance sm:text-5xl xl:text-6xl"
      >
        Network and delivery updates.
      </h1>
      <p
        class="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed sm:text-lg"
      >
        The latest network and delivery status of the GSM networks we send to,
        so you know what to expect before you send.
      </p>

      <div
        class="border-border bg-surface/70 mt-10 flex max-w-2xl flex-col gap-4 rounded-2xl border p-5 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="flex items-start gap-3">
          <span
            class="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg"
          >
            <MailCheck class="size-4" />
          </span>
          <div>
            <p class="text-sm font-semibold">Sending to MTN DND numbers?</p>
            <p class="text-muted-foreground mt-0.5 text-sm">
              Get a verification link by email to enable MTN DND delivery.
            </p>
          </div>
        </div>
        <NuxtLink
          to="/resend-activation"
          class="bg-primary text-dark-blue hover:bg-primary/85 focus-visible:ring-primary/40 flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition-colors ease-in outline-none focus-visible:ring-3"
        >
          Get link
          <ArrowRight class="size-4" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowRight, MailCheck } from '@lucide/vue'

const { updates, formatDate } = useNetworkStatus()
const latest = updates[0]!
</script>
