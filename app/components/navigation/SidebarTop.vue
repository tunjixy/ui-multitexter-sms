<template>
  <div class="flex h-16 shrink-0 items-center justify-between gap-2 px-5">
    <AppLogo />

    <button
      v-if="closable"
      type="button"
      class="text-muted-foreground hover:bg-surface hover:text-foreground focus-visible:ring-primary/35 -mr-2 inline-flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors outline-none focus-visible:ring-3"
      aria-label="Close menu"
      @click="$emit('close')"
    >
      <XIcon class="size-4.5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { XIcon } from '@lucide/vue'

const { closable = false } = defineProps<{ closable?: boolean }>()

defineEmits(['close'])
</script>
