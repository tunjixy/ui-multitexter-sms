<template>
  <span
    :class="[
      'inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold capitalize',
      tone,
    ]"
  >
    {{ status || 'Unknown' }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  status: string
}>()

const tone = computed(() => {
  const status = props.status?.toLowerCase()
  if (status === 'completed')
    return 'bg-green-500/10 text-green-700 dark:text-green-400'
  if (status === 'processing')
    return 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
  return 'bg-red-500/10 text-red-700 dark:text-red-400'
})
</script>
