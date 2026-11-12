<template>
  <section class="py-16 lg:py-24">
    <div class="wrapper">
      <div
        class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16"
      >
        <div class="max-w-3xl">
          <p
            v-motion-fade-visible-once
            class="text-primary text-xs font-semibold tracking-[0.25em] uppercase"
          >
            Why Choose Us
          </p>
          <h2
            v-motion-reveal
            :delay="100"
            class="mt-4 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl"
          >
            Built for messages that have to arrive.
          </h2>
        </div>
        <p
          v-motion-fade-visible-once
          :delay="300"
          class="text-muted-foreground max-w-md text-base leading-relaxed lg:pb-1"
        >
          Manage marketing campaigns and internal communications from one simple
          dashboard, on the web or on your phone.
        </p>
      </div>

      <ul class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <li
          v-motion-slide-visible-once-bottom
          class="bg-dark-blue relative overflow-hidden rounded-xl border border-white/10 text-white sm:col-span-2 lg:col-span-4"
        >
          <div
            aria-hidden="true"
            class="pointer-events-none absolute -bottom-48 -left-32 size-112 rounded-full bg-teal-400/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            class="bg-primary/15 pointer-events-none absolute -top-40 right-1/4 size-96 rounded-full blur-3xl"
          />

          <div
            class="relative grid h-full items-center gap-8 p-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:p-10"
          >
            <div>
              <p
                class="text-primary text-xs font-semibold tracking-[0.25em] uppercase"
              >
                Mobile App
              </p>
              <h3
                class="mt-3 text-2xl font-semibold tracking-tight text-balance sm:text-3xl"
              >
                Get the MultiTexter Mobile App
              </h3>
              <p class="mt-3 max-w-md text-base leading-relaxed text-white/75">
                Send, schedule and track your bulk SMS from your Android phone.
              </p>
              <a
                :href="playStoreUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-dark-blue focus-visible:ring-primary/50 mt-8 inline-flex h-12 items-center gap-3 rounded-xl bg-white px-5 text-sm font-semibold transition-colors ease-in outline-none hover:bg-white/85 focus-visible:ring-3"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  class="size-4.5"
                >
                  <path
                    d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z"
                  />
                </svg>
                Get it on Google Play
              </a>
            </div>

            <NuxtImg
              src="/images/mobile.png"
              alt="MultiTexter SMS app login screen"
              width="195"
              height="317"
              loading="lazy"
              class="hidden h-64 w-auto -rotate-3 drop-shadow-2xl sm:block"
            />
          </div>
        </li>

        <li
          v-for="(feature, index) in features"
          :key="feature.title"
          v-motion-slide-visible-once-bottom
          :delay="(index % 3) * 100"
          :class="[
            'bg-surface border-border rounded-xl border p-8',
            index >= features.length - 2 ? 'lg:col-span-3' : 'lg:col-span-2',
          ]"
        >
          <span
            class="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl"
          >
            <component :is="feature.icon" class="size-5" />
          </span>
          <h3 class="mt-8 text-lg font-semibold">{{ feature.title }}</h3>
          <p class="text-muted-foreground mt-2 text-sm leading-relaxed">
            {{ feature.description }}
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  Calendar,
  Clock,
  Monitor,
  ShieldCheck,
  Upload,
  Users,
} from '@lucide/vue'

const playStoreUrl =
  'https://play.google.com/store/apps/details?id=com.multitexter.multitexterapp'

const features = [
  {
    icon: Monitor,
    title: 'Easy-to-Use Web Interface',
    description:
      'Manage marketing campaigns and internal communications online.',
  },
  {
    icon: Clock,
    title: 'Save Time & Send in Bulk',
    description: 'Stop sending texts one by one and send in bulk instead.',
  },
  {
    icon: ShieldCheck,
    title: 'Fast, Secure & Reliable',
    description:
      'All texts are delivered quickly via Tier 1 routes around the world.',
  },
  {
    icon: Calendar,
    title: 'Schedule and Send Later',
    description:
      'Schedule messages for later delivery. Set up multiple schedules at a time and let our system do the rest.',
  },
  {
    icon: Upload,
    title: 'Upload Contacts in .CSV',
    description:
      'Do you need to upload contacts? You can now upload numbers that are in .CSV format.',
  },
  {
    icon: Users,
    title: 'Unlimited SMS Recipients',
    description:
      'Send messages to unlimited number of recipients. You are only limited by your available credit units.',
  },
]
</script>
