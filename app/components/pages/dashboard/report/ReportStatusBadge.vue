<template>
  <span
    :class="[
      'inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold',
      meta.tone,
    ]"
  >
    {{ meta.label }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  status: string
}>()

const statuses: Record<string, { label: string; tone: string }> = {
  delivered: {
    label: 'Delivered',
    tone: 'bg-green-500/10 text-green-700 dark:text-green-400',
  },
  sent: {
    label: 'Sent',
    tone: 'bg-primary/10 text-primary',
  },
  deliveredpp: {
    label: 'DeliveredPP',
    tone: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  },
}

const meta = computed(
  () =>
    statuses[props.status?.toLowerCase() ?? ''] ?? {
      label: props.status || 'Unknown',
      tone: 'bg-foreground/5 text-muted-foreground',
    },
)
</script>
