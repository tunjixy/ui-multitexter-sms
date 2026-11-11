<template>
  <LoginForm />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

usePageSeo({
  title: 'Log In',
  description:
    'Log in to your Multitexter account to send bulk SMS, buy units and view your delivery reports.',
})
</script>
