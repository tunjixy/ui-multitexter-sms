<template>
  <ForgotPasswordForm />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

useHead({
  title: 'Forgot Password',
})
</script>
