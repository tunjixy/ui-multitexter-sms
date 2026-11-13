<template>
  <section>
    <h2 class="text-lg font-semibold tracking-tight">Quick actions</h2>

    <ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
      <li v-for="action in actions" :key="action.to">
        <NuxtLink
          :to="action.to"
          class="group border-border bg-surface hover:border-primary/40 focus-visible:ring-primary/35 flex h-full flex-col rounded-2xl border p-5 transition-colors outline-none focus-visible:ring-3"
        >
          <div class="flex items-start justify-between gap-3">
            <span
              class="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl"
            >
              <component :is="action.icon" class="size-5" />
            </span>
            <ArrowRightIcon
              class="text-muted-foreground group-hover:text-primary size-4 transition group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            />
          </div>
          <h3 class="mt-4 font-semibold">{{ action.title }}</h3>
          <p class="text-muted-foreground mt-1 text-sm leading-relaxed">
            {{ action.description }}
          </p>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import {
  ArrowRightIcon,
  BookUserIcon,
  CakeIcon,
  GiftIcon,
  HistoryIcon,
  IdCardIcon,
} from '@lucide/vue'

const actions = [
  {
    icon: IdCardIcon,
    title: 'Register Sender ID',
    description: 'Send messages under your own brand name.',
    to: '/dashboard/sender-id-management',
  },
  {
    icon: BookUserIcon,
    title: 'Phonebook',
    description: 'Keep your contacts organised in groups.',
    to: '/dashboard/phonebook',
  },
  {
    icon: CakeIcon,
    title: 'Birthdays',
    description: 'Text people automatically on their birthday.',
    to: '/dashboard/birthdays',
  },
  {
    icon: GiftIcon,
    title: 'Refer a friend',
    description: 'Earn free units when the people you invite recharge.',
    to: '/dashboard/refer',
  },
  {
    icon: HistoryIcon,
    title: 'History',
    description: 'Your payments, recharges and transactions.',
    to: '/dashboard/history',
  },
]
</script>
