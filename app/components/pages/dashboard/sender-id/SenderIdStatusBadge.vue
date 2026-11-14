<template>
  <span
    :class="[
      'inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold capitalize',
      tone,
    ]"
  >
    {{ text }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  status: number
  label?: string
}>()

const text = computed(
  () => props.label || (props.status === 1 ? 'Active' : 'Not active'),
)

const tone = computed(() => {
  if (props.status === 1)
    return 'bg-green-500/10 text-green-700 dark:text-green-400'
  if (/reject|declin/i.test(props.label ?? ''))
    return 'bg-red-500/10 text-red-700 dark:text-red-400'
  return 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
})
</script>
