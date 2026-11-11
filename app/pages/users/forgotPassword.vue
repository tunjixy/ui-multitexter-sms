<template>
  <div></div>
</template>

<script setup lang="ts">
definePageMeta({
  redirect: (to) => ({
    path: '/forgot-password',
    query: to.query,
    hash: to.hash,
  }),
})

useHead({
  title: 'Forgot Password',
})
</script>
