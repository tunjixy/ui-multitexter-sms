<template>
  <section class="flex min-h-dvh items-center justify-center">
    <div
      role="status"
      aria-live="polite"
      class="wrapper flex flex-col items-center text-center"
    >
      <span
        aria-hidden="true"
        class="border-primary/20 border-t-primary size-12 rounded-full border-3 motion-safe:animate-spin"
      />
      <h1 class="mt-6 text-xl font-semibold tracking-tight">
        Logging you out...
      </h1>
      <p class="text-muted-foreground mt-2 text-sm">
        This will only take a moment.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
const { clearSession } = useUserStore()

onMounted(() => {
  setTimeout(() => {
    clearSession()
    navigateTo('/login')
  }, 2000)
})

definePageMeta({
  layout: 'secondary',
})

useHead({
  title: 'Log Out',
})
</script>
