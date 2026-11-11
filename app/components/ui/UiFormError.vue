<template>
  <div class="mt-2 flex items-start gap-1 text-xs font-bold text-red-500">
    <InfoIcon :size="16" class="shrink-0" />
    <ul v-if="Array.isArray(message)" class="space-y-1">
      <li v-for="item in message" :key="item">{{ item }}</li>
    </ul>
    <p v-else>{{ message }}</p>
  </div>
</template>

<script lang="ts" setup>
import { InfoIcon } from '@lucide/vue'

const { message } = defineProps<{
  message: string | string[] | undefined
}>()
</script>
