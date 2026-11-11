<template>
  <SignupForm />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

usePageSeo({
  title: 'Sign Up',
  description:
    'Create a Multitexter account to send bulk SMS to any network in Nigeria at one unit per SMS, with instant delivery reports.',
})
</script>
