<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />
    <div class="bg-background relative flex-1">
      <slot />
    </div>
    <AppFooter />
  </div>
</template>

<script setup lang="ts"></script>
