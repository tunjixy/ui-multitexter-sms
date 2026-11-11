<template>
  <VerifyOTPForm />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

useHead({
  title: 'Verify OTP',
})
</script>
