<template>
  <div
    class="scrollbar-thumb-grey bg-surface w-full scrollbar-thin scrollbar-track-transparent overflow-auto"
  >
    <table class="w-full border-collapse" :class="props.class">
      <slot />
    </table>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ class?: string }>()
</script>
