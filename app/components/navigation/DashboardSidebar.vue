<template>
  <aside
    class="border-border bg-background fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r lg:flex"
  >
    <div
      class="from-primary/10 to-primary/10 pointer-events-none absolute inset-0 -z-10 bg-linear-to-b via-transparent"
    />
    <div
      class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--color-muted-foreground)_1px,transparent_1px)] mask-[linear-gradient(to_bottom,black,transparent_40%,transparent_60%,black)] bg-size-[20px_20px] opacity-25"
    />
    <SidebarTop />
    <SidebarMenu :menus="menus" />
    <SidebarBottom />
  </aside>
</template>

<script setup lang="ts">
defineProps<{ menus: Menu[] }>()
</script>
