<template>
  <ResendActivationForm />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

useHead({
  title: 'Resend Activation',
})
</script>
