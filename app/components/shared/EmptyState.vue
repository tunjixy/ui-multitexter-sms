<template>
  <div
    class="border-border flex flex-col items-center rounded-3xl border border-dashed px-6 py-16 text-center"
  >
    <div class="relative">
      <span
        aria-hidden="true"
        class="bg-primary/25 absolute inset-0 rounded-2xl blur-xl"
      />
      <span
        class="border-border bg-surface text-primary relative flex size-12 items-center justify-center rounded-2xl border"
      >
        <component :is="icon ?? Inbox" class="size-5" />
      </span>
    </div>

    <h3 class="mt-5 text-base font-semibold">{{ title }}</h3>
    <p
      v-if="description || $slots.default"
      class="text-muted-foreground mt-1.5 max-w-sm text-sm leading-relaxed"
    >
      <slot>{{ description }}</slot>
    </p>

    <div v-if="$slots.actions" class="mt-6 flex flex-wrap justify-center gap-3">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { Inbox } from '@lucide/vue'

defineProps<{
  title: string
  description?: string
  icon?: Component
}>()
</script>
