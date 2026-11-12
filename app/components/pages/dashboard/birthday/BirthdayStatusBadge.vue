<template>
  <span
    :class="[
      'inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold capitalize',
      active
        ? 'bg-green-500/10 text-green-700 dark:text-green-400'
        : 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    ]"
  >
    {{ active ? 'Active' : status || 'Stopped' }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  status: string
}>()

const active = computed(() => props.status?.toLowerCase() === 'active')
</script>
