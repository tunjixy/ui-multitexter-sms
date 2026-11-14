<template>
  <span
    :class="[
      'inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold',
      completed
        ? 'bg-green-500/10 text-green-700 dark:text-green-400'
        : 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    ]"
  >
    {{ completed ? 'Completed' : 'Pending' }}
  </span>
</template>

<script setup lang="ts">
defineProps<{
  completed: boolean
}>()
</script>
