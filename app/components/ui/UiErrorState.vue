<template>
  <div
    role="alert"
    class="border-border flex flex-col items-center rounded-3xl border border-dashed px-6 py-16 text-center"
  >
    <span
      class="flex size-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400"
    >
      <CircleAlert v-if="isOnline" class="size-5" />
      <WifiOff v-else class="size-5" />
    </span>

    <h3 class="mt-5 text-base font-semibold">
      {{ isOnline ? title : "You're offline" }}
    </h3>
    <p class="text-muted-foreground mt-1.5 max-w-sm text-sm leading-relaxed">
      {{
        isOnline
          ? description
          : "Check your internet connection. We'll try again once you're back online."
      }}
    </p>

    <UiButton
      variant="outline"
      radius="lg"
      class="mt-6"
      @click="emit('try-again')"
    >
      <template #leading>
        <RotateCw class="size-4" />
      </template>
      Try again
    </UiButton>
  </div>
</template>

<script setup lang="ts">
import { CircleAlert, RotateCw, WifiOff } from '@lucide/vue'

withDefaults(
  defineProps<{
    title?: string
    description?: string
  }>(),
  {
    title: 'Something went wrong',
    description: "We couldn't load this right now. Please try again.",
  },
)

const emit = defineEmits<{
  'try-again': []
}>()

const { isOnline } = useNetwork()

watch(isOnline, (online) => {
  if (online) emit('try-again')
})
</script>
