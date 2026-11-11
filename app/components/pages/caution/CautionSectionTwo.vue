<template>
  <section class="py-16 lg:py-24">
    <div class="wrapper space-y-20 lg:space-y-28">
      <div
        v-for="group in groups"
        :key="group.id"
        class="grid items-start gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16"
      >
        <div class="lg:sticky lg:top-32">
          <span
            class="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl"
          >
            <component :is="group.icon" class="size-5" />
          </span>
          <p
            class="text-primary mt-6 text-xs font-semibold tracking-[0.25em] uppercase"
          >
            {{ group.eyebrow }}
          </p>
          <h2
            class="mt-4 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl"
          >
            {{ group.title }}
          </h2>
          <p class="text-muted-foreground mt-5 leading-relaxed">
            {{ group.description }}
          </p>
        </div>

        <ol class="space-y-4">
          <li
            v-for="rule in group.rules"
            :key="rule.number"
            class="bg-surface border-border rounded-3xl border p-6 sm:p-8"
          >
            <div class="flex items-start gap-4">
              <span
                class="border-border bg-background text-primary flex size-10 shrink-0 items-center justify-center rounded-xl border text-xs font-semibold tabular-nums"
              >
                {{ rule.number }}
              </span>
              <div class="min-w-0">
                <h3 class="text-lg font-semibold tracking-tight">
                  {{ rule.title }}
                </h3>
                <p class="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                  {{ rule.description }}
                </p>
              </div>
            </div>

            <div class="mt-6 grid gap-3 sm:grid-cols-2">
              <div class="rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
                <p
                  class="flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400"
                >
                  <X class="size-3.5" />
                  Avoid
                </p>
                <ul class="mt-3 flex flex-wrap gap-2">
                  <li
                    v-for="example in rule.avoid"
                    :key="example"
                    class="border-border bg-surface rounded-md border px-2 py-1 font-mono text-[13px] break-all"
                  >
                    {{ example }}
                  </li>
                </ul>
              </div>

              <div
                class="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4"
              >
                <p
                  class="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                >
                  <Check class="size-3.5" />
                  Instead
                </p>
                <p class="mt-3 text-sm leading-relaxed">
                  {{ rule.instead.text }}
                  <a
                    v-if="rule.instead.link"
                    :href="rule.instead.link.href"
                    target="_blank"
                    rel="noopener"
                    class="text-primary font-semibold hover:underline"
                  >
                    {{ rule.instead.link.label }}</a
                  >
                </p>
                <ul
                  v-if="rule.instead.examples"
                  class="mt-3 flex flex-wrap gap-2"
                >
                  <li
                    v-for="example in rule.instead.examples"
                    :key="example"
                    class="border-border bg-surface rounded-md border px-2 py-1 font-mono text-[13px] break-all"
                  >
                    {{ example }}
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </ol>
      </div>

      <div
        class="bg-surface border-border relative overflow-hidden rounded-3xl border p-8 sm:p-10"
      >
        <div
          aria-hidden="true"
          class="bg-primary/10 pointer-events-none absolute -right-20 -bottom-28 size-72 rounded-full blur-3xl"
        />
        <div class="relative flex flex-col gap-5 sm:flex-row sm:items-start">
          <span
            class="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl"
          >
            <FlaskConical class="size-5" />
          </span>
          <div class="max-w-3xl">
            <h2 class="text-xl font-semibold tracking-tight">
              Run a few tests before you send
            </h2>
            <p class="text-muted-foreground mt-3 leading-relaxed">
              These guidelines are based on non-delivery cases we've seen in the
              past and may change. Network providers don't publish a full list
              of words or phrases for bulk SMS routes, so we advise sending a
              few test messages before sending to all your recipients.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  Check,
  FlaskConical,
  IdCard,
  MessageSquareText,
  X,
} from '@lucide/vue'
import type { Component } from 'vue'

interface Rule {
  number: string
  title: string
  description: string
  avoid: string[]
  instead: {
    text: string
    link?: { label: string; href: string }
    examples?: string[]
  }
}

interface Group {
  id: string
  icon: Component
  eyebrow: string
  title: string
  description: string
  rules: Rule[]
}

const groups: Group[] = [
  {
    id: 'sender-name',
    icon: IdCard,
    eyebrow: 'Sender name',
    title: 'Pick a sender name that gets through.',
    description:
      'Your sender name is what recipients see in the “from” field, so choose it carefully.',
    rules: [
      {
        number: '01',
        title: 'No bank-related names',
        description:
          'Don’t use the name of a bank, or banking terms, as your sender name.',
        avoid: ['BVN', 'ATM'],
        instead: { text: 'Use your own business or brand name.' },
      },
      {
        number: '02',
        title: 'No generic words',
        description: 'Don’t use common, generic words as your sender name.',
        avoid: ['School', 'Church', 'Life', 'Mosque', 'Book'],
        instead: { text: 'Use a name that is unique to you.' },
      },
      {
        number: '03',
        title: 'No spaces between words',
        description:
          'Don’t separate two or three words with spaces in the sender name box.',
        avoid: ['ABC NG'],
        instead: { text: 'Join the words together.', examples: ['ABCNG'] },
      },
    ],
  },
  {
    id: 'message-content',
    icon: MessageSquareText,
    eyebrow: 'Message content',
    title: 'Keep your message content clear.',
    description:
      'What you write in the message matters too. Watch out for these.',
    rules: [
      {
        number: '04',
        title: 'No OTP messages',
        description:
          'Telcos now treat OTPs as international traffic, so they can’t be sent on this platform.',
        avoid: ['Your OTP is 482913'],
        instead: {
          text: 'Send your OTPs on',
          link: { label: 'smsvend.com', href: 'https://smsvend.com' },
        },
      },
      {
        number: '05',
        title: 'Shorten long links',
        description:
          'Avoid long links that contain social media or fintech words, like WhatsApp, Google Meet, Zoom or Paystack links.',
        avoid: ['whatsappus.com/joingroup'],
        instead: {
          text: 'Create a custom short link with a link shortener like',
          link: { label: 'bit.ly', href: 'https://bit.ly' },
          examples: ['bit.ly/JoinGroup'],
        },
      },
    ],
  },
]
</script>
